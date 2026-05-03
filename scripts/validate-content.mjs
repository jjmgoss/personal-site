import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const rootDirectory = process.cwd();
const projectsDirectory = path.join(rootDirectory, 'content', 'projects');
const writingDirectory = path.join(rootDirectory, 'content', 'writing');
const publicDirectory = path.join(rootDirectory, 'public');

const PROJECT_STATUSES = new Set(['idea', 'planning', 'active', 'paused', 'shipped', 'archived']);
const ALLOWED_STATIC_ROUTES = new Set(['/', '/projects', '/writing', '/now']);
const markdownLinkPattern = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toTrimmedString(value) {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function requireStringField(data, field, filePath, errors, scope) {
  const value = data[field];

  if (!isNonEmptyString(value)) {
    errors.push(`${scope}: ${filePath} -> "${field}" is required.`);
    return undefined;
  }

  return value.trim();
}

function requireStringArrayField(data, field, filePath, errors, scope, { allowEmpty = false } = {}) {
  const value = data[field];

  if (!Array.isArray(value) || value.some((item) => !isNonEmptyString(item))) {
    errors.push(`${scope}: ${filePath} -> "${field}" must be a list of non-empty strings.`);
    return [];
  }

  const trimmed = value.map((item) => item.trim());
  if (!allowEmpty && trimmed.length === 0) {
    errors.push(`${scope}: ${filePath} -> "${field}" must not be empty.`);
  }

  return trimmed;
}

function validateOptionalUrlField(data, field, filePath, errors, scope) {
  const value = data[field];
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (!isNonEmptyString(value)) {
    errors.push(`${scope}: ${filePath} -> "${field}" must be a string when provided.`);
    return undefined;
  }

  return value.trim();
}

function normalizeDate(value, filePath, errors) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (!isNonEmptyString(value)) {
    errors.push(`writing: ${filePath} -> "date" is required.`);
    return undefined;
  }

  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    errors.push(`writing: ${filePath} -> "date" must use YYYY-MM-DD format.`);
    return undefined;
  }

  if (Number.isNaN(Date.parse(trimmed))) {
    errors.push(`writing: ${filePath} -> "date" must be a valid date.`);
    return undefined;
  }

  return trimmed;
}

async function fileExists(filePath) {
  try {
    const fileStats = await stat(filePath);
    return fileStats.isFile();
  } catch {
    return false;
  }
}

async function collectContentFiles(directory) {
  const fileNames = await readdir(directory);
  return fileNames.filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx')).sort();
}

function extractInternalLinks(content) {
  const links = [];

  for (const match of content.matchAll(markdownLinkPattern)) {
    const rawTarget = match[1]?.trim();
    if (!rawTarget || !rawTarget.startsWith('/')) {
      continue;
    }

    links.push(rawTarget);
  }

  return links;
}

function normalizeInternalPath(target) {
  return target.split('#')[0].split('?')[0] || '/';
}

function validateInternalLink(target, sourceFile, knownProjectSlugs, knownWritingSlugs, errors) {
  const normalizedPath = normalizeInternalPath(target);

  if (ALLOWED_STATIC_ROUTES.has(normalizedPath)) {
    return;
  }

  if (normalizedPath.startsWith('/projects/')) {
    const segments = normalizedPath.split('/').filter(Boolean);
    if (segments.length === 2 && knownProjectSlugs.has(segments[1])) {
      return;
    }

    errors.push(`links: ${sourceFile} -> internal link "${target}" does not match a known project route.`);
    return;
  }

  if (normalizedPath.startsWith('/writing/')) {
    const segments = normalizedPath.split('/').filter(Boolean);
    if (segments.length === 2 && knownWritingSlugs.has(segments[1])) {
      return;
    }

    errors.push(`links: ${sourceFile} -> internal link "${target}" does not match a known writing route.`);
    return;
  }

  errors.push(`links: ${sourceFile} -> internal link "${target}" points to an unsupported route.`);
}

async function validateProjectFiles(errors) {
  const fileNames = await collectContentFiles(projectsDirectory);
  const slugCounts = new Map();
  const projects = [];

  for (const fileName of fileNames) {
    const absolutePath = path.join(projectsDirectory, fileName);
    const rawFile = await readFile(absolutePath, 'utf8');
    const { data, content } = matter(rawFile);

    const title = requireStringField(data, 'title', fileName, errors, 'project');
    const slug = requireStringField(data, 'slug', fileName, errors, 'project');
    const summary = requireStringField(data, 'summary', fileName, errors, 'project');
    const nextMilestone = requireStringField(data, 'next_milestone', fileName, errors, 'project');
    const repoUrl = requireStringField(data, 'repo_url', fileName, errors, 'project');
    const stack = requireStringArrayField(data, 'stack', fileName, errors, 'project');
    const liveUrl = validateOptionalUrlField(data, 'live_url', fileName, errors, 'project');
    const docsUrl = validateOptionalUrlField(data, 'docs_url', fileName, errors, 'project');

    if (!PROJECT_STATUSES.has(data.status)) {
      errors.push(
        `project: ${fileName} -> "status" must be one of ${Array.from(PROJECT_STATUSES).join(', ')}.`
      );
    }

    let screenshots = [];
    if (data.screenshots !== undefined && data.screenshots !== null) {
      if (!Array.isArray(data.screenshots)) {
        errors.push(`project: ${fileName} -> "screenshots" must be a list when provided.`);
      } else {
        screenshots = data.screenshots;
        for (const [index, screenshot] of screenshots.entries()) {
          if (!screenshot || typeof screenshot !== 'object' || Array.isArray(screenshot)) {
            errors.push(`project: ${fileName} -> "screenshots[${index}]" must be an object.`);
            continue;
          }

          const src = requireStringField(screenshot, 'src', fileName, errors, 'project');
          requireStringField(screenshot, 'alt', fileName, errors, 'project');
          const caption = screenshot.caption;
          if (caption !== undefined && caption !== null && !isNonEmptyString(caption)) {
            errors.push(`project: ${fileName} -> "screenshots[${index}].caption" must be a string when provided.`);
          }

          if (src && !src.startsWith('/')) {
            errors.push(`project: ${fileName} -> "screenshots[${index}].src" must start with "/".`);
          }

          if (src?.startsWith('/')) {
            const publicPath = path.join(publicDirectory, src.replace(/^\//, '').split('/').join(path.sep));
            if (!(await fileExists(publicPath))) {
              errors.push(`project: ${fileName} -> screenshot file "${src}" was not found under public/.`);
            }
          }
        }
      }
    }

    if (slug) {
      slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
    }

    projects.push({ fileName, title, slug, summary, nextMilestone, repoUrl, liveUrl, docsUrl, stack, screenshots, content });
  }

  for (const [slug, count] of slugCounts.entries()) {
    if (count > 1) {
      errors.push(`project: duplicate slug detected -> "${slug}".`);
    }
  }

  return projects;
}

async function validateWritingFiles(projectSlugs, errors) {
  const fileNames = await collectContentFiles(writingDirectory);
  const slugCounts = new Map();
  const entries = [];

  for (const fileName of fileNames) {
    const absolutePath = path.join(writingDirectory, fileName);
    const rawFile = await readFile(absolutePath, 'utf8');
    const { data, content } = matter(rawFile);

    const title = requireStringField(data, 'title', fileName, errors, 'writing');
    const slug = requireStringField(data, 'slug', fileName, errors, 'writing');
    const date = normalizeDate(data.date, fileName, errors);
    const summary = requireStringField(data, 'summary', fileName, errors, 'writing');
    const tags = requireStringArrayField(data, 'tags', fileName, errors, 'writing');
    const relatedProjects = requireStringArrayField(data, 'related_projects', fileName, errors, 'writing', {
      allowEmpty: true,
    });

    for (const relatedProject of relatedProjects) {
      if (!projectSlugs.has(relatedProject)) {
        errors.push(
          `writing: ${fileName} -> related project "${relatedProject}" does not exist in content/projects.`
        );
      }
    }

    if (slug) {
      slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
    }

    entries.push({ fileName, title, slug, date, summary, tags, relatedProjects, content });
  }

  for (const [slug, count] of slugCounts.entries()) {
    if (count > 1) {
      errors.push(`writing: duplicate slug detected -> "${slug}".`);
    }
  }

  return entries;
}

async function main() {
  const errors = [];

  const projects = await validateProjectFiles(errors);
  const projectSlugs = new Set(projects.map((project) => project.slug).filter(Boolean));
  const writingEntries = await validateWritingFiles(projectSlugs, errors);
  const writingSlugs = new Set(writingEntries.map((entry) => entry.slug).filter(Boolean));

  for (const project of projects) {
    for (const target of extractInternalLinks(project.content)) {
      validateInternalLink(target, `content/projects/${project.fileName}`, projectSlugs, writingSlugs, errors);
    }
  }

  for (const entry of writingEntries) {
    for (const target of extractInternalLinks(entry.content)) {
      validateInternalLink(target, `content/writing/${entry.fileName}`, projectSlugs, writingSlugs, errors);
    }
  }

  if (errors.length > 0) {
    console.error('Content validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Content validation passed for ${projects.length} project file(s) and ${writingEntries.length} writing file(s).`
  );
}

await main();