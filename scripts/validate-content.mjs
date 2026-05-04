import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const rootDirectory = process.cwd();
const projectsDirectory = path.join(rootDirectory, 'content', 'projects');
const writingDirectory = path.join(rootDirectory, 'content', 'writing');
const siteDirectory = path.join(rootDirectory, 'content', 'site');
const publicDirectory = path.join(rootDirectory, 'public');

const PROJECT_STATUSES = new Set(['idea', 'planning', 'active', 'paused', 'shipped', 'archived']);
const ALLOWED_STATIC_ROUTES = new Set(['/', '/projects', '/writing', '/now']);
const REQUIRED_SITE_FILES = ['site.json', 'home.md', 'projects.md', 'notes.md', 'now.md'];
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

function isValidExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
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

function validateLinkTarget(target, sourceFile, fieldName, knownProjectSlugs, knownWritingSlugs, errors) {
  if (!isNonEmptyString(target)) {
    errors.push(`${sourceFile} -> "${fieldName}" must be a non-empty string.`);
    return;
  }

  if (target.startsWith('/')) {
    validateInternalLink(target, sourceFile, knownProjectSlugs, knownWritingSlugs, errors);
    return;
  }

  if (!isValidExternalUrl(target)) {
    errors.push(`${sourceFile} -> "${fieldName}" must be an internal route or a valid http(s) URL.`);
  }
}

function requireObjectField(value, field, filePath, errors, scope) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${scope}: ${filePath} -> "${field}" must be an object.`);
    return undefined;
  }

  return value;
}

function requireObjectArrayField(data, field, filePath, errors, scope, { allowEmpty = false } = {}) {
  const value = data[field];

  if (!Array.isArray(value) || value.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
    errors.push(`${scope}: ${filePath} -> "${field}" must be a list of objects.`);
    return [];
  }

  if (!allowEmpty && value.length === 0) {
    errors.push(`${scope}: ${filePath} -> "${field}" must not be empty.`);
  }

  return value;
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
    const author = requireStringField(data, 'author', fileName, errors, 'writing');
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

    entries.push({ fileName, title, slug, author, date, summary, tags, relatedProjects, content });
  }

  for (const [slug, count] of slugCounts.entries()) {
    if (count > 1) {
      errors.push(`writing: duplicate slug detected -> "${slug}".`);
    }
  }

  return entries;
}

async function validateSiteFiles(projectSlugs, writingSlugs, errors) {
  for (const fileName of REQUIRED_SITE_FILES) {
    const absolutePath = path.join(siteDirectory, fileName);
    if (!(await fileExists(absolutePath))) {
      errors.push(`site: required file missing -> content/site/${fileName}.`);
    }
  }

  const siteJsonPath = path.join(siteDirectory, 'site.json');
  if (await fileExists(siteJsonPath)) {
    let siteConfig;
    try {
      siteConfig = JSON.parse(await readFile(siteJsonPath, 'utf8'));
    } catch (error) {
      errors.push(`site: content/site/site.json -> failed to parse JSON (${error.message}).`);
      siteConfig = undefined;
    }

    if (siteConfig && typeof siteConfig === 'object' && !Array.isArray(siteConfig)) {
      const filePath = 'content/site/site.json';
      requireStringField(siteConfig, 'title', filePath, errors, 'site');
      requireStringField(siteConfig, 'metadataDescription', filePath, errors, 'site');
      requireStringField(siteConfig, 'headerKicker', filePath, errors, 'site');
      requireStringField(siteConfig, 'headerSubtitle', filePath, errors, 'site');
      requireStringField(siteConfig, 'footerTitle', filePath, errors, 'site');
      requireStringField(siteConfig, 'footerSummary', filePath, errors, 'site');

      const primaryNav = requireObjectArrayField(siteConfig, 'primaryNav', filePath, errors, 'site');
      primaryNav.forEach((item, index) => {
        requireStringField(item, 'label', filePath, errors, 'site');
        const href = requireStringField(item, 'href', filePath, errors, 'site');
        if (href) {
          validateLinkTarget(href, filePath, `primaryNav[${index}].href`, projectSlugs, writingSlugs, errors);
        }
      });

      const footerLinks = requireObjectArrayField(siteConfig, 'footerLinks', filePath, errors, 'site');
      footerLinks.forEach((item, index) => {
        requireStringField(item, 'label', filePath, errors, 'site');
        const href = requireStringField(item, 'href', filePath, errors, 'site');
        if (href) {
          validateLinkTarget(href, filePath, `footerLinks[${index}].href`, projectSlugs, writingSlugs, errors);
        }
      });
    } else if (siteConfig !== undefined) {
      errors.push('site: content/site/site.json -> root value must be an object.');
    }
  }

  const siteMarkdownFiles = ['home.md', 'projects.md', 'notes.md', 'now.md'];

  for (const fileName of siteMarkdownFiles) {
    const absolutePath = path.join(siteDirectory, fileName);
    if (!(await fileExists(absolutePath))) {
      continue;
    }

    const rawFile = await readFile(absolutePath, 'utf8');
    const { data, content } = matter(rawFile);
    const filePath = `content/site/${fileName}`;

    if (fileName === 'home.md') {
      const requiredFields = [
        'eyebrow',
        'headline',
        'intro',
        'primary_cta_label',
        'primary_cta_href',
        'secondary_cta_label',
        'secondary_cta_href',
        'support',
        'projects_section_eyebrow',
        'projects_section_title',
        'projects_section_body',
        'projects_section_link_label',
        'projects_section_link_href',
        'notes_section_eyebrow',
        'notes_section_title',
        'notes_section_body',
        'latest_note_label',
        'notes_section_link_label',
        'notes_section_link_href',
        'snapshot_link_label',
        'snapshot_link_href',
      ];

      for (const field of requiredFields) {
        requireStringField(data, field, fileName, errors, 'site');
      }

      for (const field of [
        'primary_cta_href',
        'secondary_cta_href',
        'projects_section_link_href',
        'notes_section_link_href',
        'snapshot_link_href',
      ]) {
        const href = toTrimmedString(data[field]);
        if (href) {
          validateLinkTarget(href, filePath, field, projectSlugs, writingSlugs, errors);
        }
      }
    }

    if (fileName === 'projects.md' || fileName === 'notes.md') {
      for (const field of ['metadata_title', 'metadata_description', 'eyebrow', 'headline', 'intro']) {
        requireStringField(data, field, fileName, errors, 'site');
      }
    }

    if (fileName === 'now.md') {
      for (const field of [
        'metadata_title',
        'metadata_description',
        'eyebrow',
        'headline',
        'intro',
        'current_state_title',
        'current_state_body',
        'live_routes_title',
        'live_routes_intro',
        'active_projects_title',
        'active_projects_intro',
        'recently_changed_title',
        'next_likely_work_title',
        'agent_maintenance_title',
      ]) {
        requireStringField(data, field, fileName, errors, 'site');
      }

      const liveRoutes = requireObjectArrayField(data, 'live_routes', fileName, errors, 'site');
      liveRoutes.forEach((route, index) => {
        requireStringField(route, 'label', fileName, errors, 'site');
        requireStringField(route, 'summary', fileName, errors, 'site');
        const href = requireStringField(route, 'href', fileName, errors, 'site');
        requireObjectField(route, `live_routes[${index}]`, fileName, errors, 'site');
        if (href) {
          validateLinkTarget(href, filePath, `live_routes[${index}].href`, projectSlugs, writingSlugs, errors);
        }
      });

      const activeProjects = requireObjectArrayField(data, 'active_projects', fileName, errors, 'site');
      activeProjects.forEach((project, index) => {
        const slug = requireStringField(project, 'slug', fileName, errors, 'site');
        requireStringField(project, 'summary', fileName, errors, 'site');
        if (slug && !projectSlugs.has(slug)) {
          errors.push(`site: ${fileName} -> active_projects[${index}].slug "${slug}" does not exist in content/projects.`);
        }
      });

      requireStringArrayField(data, 'recently_changed', fileName, errors, 'site');
      requireStringArrayField(data, 'next_likely_work', fileName, errors, 'site');
      requireStringArrayField(data, 'agent_maintenance', fileName, errors, 'site');
    }

    for (const target of extractInternalLinks(content)) {
      validateInternalLink(target, filePath, projectSlugs, writingSlugs, errors);
    }
  }
}

async function main() {
  const errors = [];

  const projects = await validateProjectFiles(errors);
  const projectSlugs = new Set(projects.map((project) => project.slug).filter(Boolean));
  const writingEntries = await validateWritingFiles(projectSlugs, errors);
  const writingSlugs = new Set(writingEntries.map((entry) => entry.slug).filter(Boolean));

  await validateSiteFiles(projectSlugs, writingSlugs, errors);

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
    `Content validation passed for ${projects.length} project file(s), ${writingEntries.length} writing file(s), and ${REQUIRED_SITE_FILES.length} site file(s).`
  );
}

await main();