import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const PROJECT_STATUSES = [
  'idea',
  'planning',
  'active',
  'paused',
  'shipped',
  'archived',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectMetadata = {
  title: string;
  slug: string;
  status: ProjectStatus;
  summary: string;
  stack: string[];
  next_milestone: string;
  repo_url: string;
  live_url?: string;
  docs_url?: string;
};

export type ProjectEntry = ProjectMetadata & {
  content: string;
};

const projectsDirectory = path.join(process.cwd(), 'content', 'projects');

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireStringField(data: Record<string, unknown>, field: string, filePath: string): string {
  const value = data[field];

  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid project frontmatter in ${filePath}: "${field}" is required.`);
  }

  return value.trim();
}

function isOptionalUrl(value: unknown): value is string | undefined {
  return value === undefined || value === null || isNonEmptyString(value);
}

function toOptionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function parseProjectMetadata(filePath: string, data: Record<string, unknown>): ProjectMetadata {
  const title = requireStringField(data, 'title', filePath);
  const slug = requireStringField(data, 'slug', filePath);
  const summary = requireStringField(data, 'summary', filePath);
  const nextMilestone = requireStringField(data, 'next_milestone', filePath);
  const repoUrl = requireStringField(data, 'repo_url', filePath);

  if (!PROJECT_STATUSES.includes(data.status as ProjectStatus)) {
    throw new Error(
      `Invalid project frontmatter in ${filePath}: "status" must be one of ${PROJECT_STATUSES.join(', ')}.`
    );
  }

  if (!Array.isArray(data.stack) || data.stack.length === 0 || data.stack.some((item) => !isNonEmptyString(item))) {
    throw new Error(`Invalid project frontmatter in ${filePath}: "stack" must be a non-empty list of strings.`);
  }

  if (!isOptionalUrl(data.live_url)) {
    throw new Error(`Invalid project frontmatter in ${filePath}: "live_url" must be a string when provided.`);
  }

  if (!isOptionalUrl(data.docs_url)) {
    throw new Error(`Invalid project frontmatter in ${filePath}: "docs_url" must be a string when provided.`);
  }

  return {
    title,
    slug,
    status: data.status as ProjectStatus,
    summary,
    stack: data.stack.map((item) => item.trim()),
    next_milestone: nextMilestone,
    repo_url: repoUrl,
    live_url: toOptionalString(data.live_url),
    docs_url: toOptionalString(data.docs_url),
  };
}

export async function getProjectEntries(): Promise<ProjectEntry[]> {
  const fileNames = await readdir(projectsDirectory);
  const projectFiles = fileNames.filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'));

  const projects = await Promise.all(
    projectFiles.map(async (fileName) => {
      const filePath = path.join(projectsDirectory, fileName);
      const rawFile = await readFile(filePath, 'utf8');
      const { data, content } = matter(rawFile);
      const metadata = parseProjectMetadata(fileName, data);

      return {
        ...metadata,
        content: content.trim(),
      };
    })
  );

  const slugs = new Set<string>();
  for (const project of projects) {
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug detected: "${project.slug}".`);
    }
    slugs.add(project.slug);
  }

  return projects.sort((left, right) => left.title.localeCompare(right.title));
}