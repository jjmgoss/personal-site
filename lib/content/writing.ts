import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { getProjectSlugs } from '@/lib/content/projects';

export type WritingMetadata = {
  title: string;
  slug: string;
  author: string;
  date: string;
  summary: string;
  tags: string[];
  related_projects: string[];
};

export type WritingEntry = WritingMetadata & {
  content: string;
};

const writingDirectory = path.join(process.cwd(), 'content', 'writing');

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireStringField(data: Record<string, unknown>, field: string, filePath: string): string {
  const value = data[field];

  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid writing frontmatter in ${filePath}: "${field}" is required.`);
  }

  return value.trim();
}

function requireStringArrayField(
  data: Record<string, unknown>,
  field: string,
  filePath: string,
  options: { allowEmpty?: boolean } = {}
): string[] {
  const value = data[field];

  if (!Array.isArray(value) || value.some((item) => !isNonEmptyString(item))) {
    throw new Error(`Invalid writing frontmatter in ${filePath}: "${field}" must be a list of strings.`);
  }

  if (!options.allowEmpty && value.length === 0) {
    throw new Error(`Invalid writing frontmatter in ${filePath}: "${field}" must not be empty.`);
  }

  return value.map((item) => item.trim());
}

function requireDateField(data: Record<string, unknown>, field: string, filePath: string): string {
  const rawValue = data[field];
  const value = rawValue instanceof Date ? rawValue.toISOString().slice(0, 10) : requireStringField(data, field, filePath);

  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`Invalid writing frontmatter in ${filePath}: "${field}" must be a valid date string.`);
  }

  return value;
}

async function parseWritingMetadata(filePath: string, data: Record<string, unknown>): Promise<WritingMetadata> {
  const title = requireStringField(data, 'title', filePath);
  const slug = requireStringField(data, 'slug', filePath);
  const author = requireStringField(data, 'author', filePath);
  const date = requireDateField(data, 'date', filePath);
  const summary = requireStringField(data, 'summary', filePath);
  const tags = requireStringArrayField(data, 'tags', filePath);
  const relatedProjects = requireStringArrayField(data, 'related_projects', filePath, { allowEmpty: true });
  const validProjectSlugs = new Set(await getProjectSlugs());

  for (const relatedProject of relatedProjects) {
    if (!validProjectSlugs.has(relatedProject)) {
      throw new Error(
        `Invalid writing frontmatter in ${filePath}: related project "${relatedProject}" does not exist in content/projects.`
      );
    }
  }

  return {
    title,
    slug,
    author,
    date,
    summary,
    tags,
    related_projects: relatedProjects,
  };
}

export async function getWritingEntries(): Promise<WritingEntry[]> {
  const fileNames = await readdir(writingDirectory);
  const writingFiles = fileNames.filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'));

  const entries = await Promise.all(
    writingFiles.map(async (fileName) => {
      const filePath = path.join(writingDirectory, fileName);
      const rawFile = await readFile(filePath, 'utf8');
      const { data, content } = matter(rawFile);
      const metadata = await parseWritingMetadata(fileName, data);

      return {
        ...metadata,
        content: content.trim(),
      };
    })
  );

  const slugs = new Set<string>();
  for (const entry of entries) {
    if (slugs.has(entry.slug)) {
      throw new Error(`Duplicate writing slug detected: "${entry.slug}".`);
    }
    slugs.add(entry.slug);
  }

  return entries.sort((left, right) => right.date.localeCompare(left.date));
}

export async function getWritingEntry(slug: string): Promise<WritingEntry | undefined> {
  const entries = await getWritingEntries();
  return entries.find((entry) => entry.slug === slug);
}

export async function getWritingSlugs(): Promise<string[]> {
  const entries = await getWritingEntries();
  return entries.map((entry) => entry.slug);
}