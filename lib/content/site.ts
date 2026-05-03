import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';

export type SiteLink = {
  href: string;
  label: string;
};

export type SiteConfig = {
  title: string;
  metadataDescription: string;
  headerKicker: string;
  headerSubtitle: string;
  footerTitle: string;
  footerSummary: string;
  primaryNav: SiteLink[];
  footerLinks: SiteLink[];
};

export type HomeContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  primaryCta: SiteLink;
  secondaryCta: SiteLink;
  support: string;
  projectsSection: {
    eyebrow: string;
    title: string;
    body: string;
    link: SiteLink;
  };
  notesSection: {
    eyebrow: string;
    title: string;
    body: string;
    latestNoteLabel: string;
    notesLink: SiteLink;
    snapshotLink: SiteLink;
  };
};

export type IndexPageContent = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  headline: string;
  intro: string;
};

export type NowContent = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  headline: string;
  intro: string;
  overview: {
    title: string;
    body: string;
  };
  statusSections: Array<{
    title: string;
    body: string;
  }>;
  activeProjects: {
    title: string;
    intro: string;
    items: Array<{
      slug: string;
      summary: string;
    }>;
  };
  explore: {
    title: string;
    links: SiteLink[];
  };
};

const siteDirectory = path.join(process.cwd(), 'content', 'site');

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireStringField(data: Record<string, unknown>, field: string, filePath: string): string {
  const value = data[field];

  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid site content in ${filePath}: "${field}" is required.`);
  }

  return value.trim();
}

function parseLink(value: unknown, filePath: string, field: string): SiteLink {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid site content in ${filePath}: "${field}" must be an object.`);
  }

  const link = value as Record<string, unknown>;
  return {
    href: requireStringField(link, 'href', filePath),
    label: requireStringField(link, 'label', filePath),
  };
}

function parseLinkArray(value: unknown, filePath: string, field: string): SiteLink[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid site content in ${filePath}: "${field}" must be a non-empty list.`);
  }

  return value.map((item, index) => parseLink(item, filePath, `${field}[${index}]`));
}

function parseStringArrayObjects<T>(
  value: unknown,
  filePath: string,
  field: string,
  mapper: (item: Record<string, unknown>, index: number) => T
): T[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid site content in ${filePath}: "${field}" must be a non-empty list.`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Invalid site content in ${filePath}: "${field}[${index}]" must be an object.`);
    }

    return mapper(item as Record<string, unknown>, index);
  });
}

async function readSiteMarkdownFile(fileName: string): Promise<Record<string, unknown>> {
  const filePath = path.join(siteDirectory, fileName);
  const rawFile = await readFile(filePath, 'utf8');
  const { data } = matter(rawFile);
  return data;
}

const readSiteJsonConfig = cache(async (): Promise<Record<string, unknown>> => {
  const filePath = path.join(siteDirectory, 'site.json');
  const rawFile = await readFile(filePath, 'utf8');
  return JSON.parse(rawFile) as Record<string, unknown>;
});

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const data = await readSiteJsonConfig();
  const filePath = 'content/site/site.json';

  return {
    title: requireStringField(data, 'title', filePath),
    metadataDescription: requireStringField(data, 'metadataDescription', filePath),
    headerKicker: requireStringField(data, 'headerKicker', filePath),
    headerSubtitle: requireStringField(data, 'headerSubtitle', filePath),
    footerTitle: requireStringField(data, 'footerTitle', filePath),
    footerSummary: requireStringField(data, 'footerSummary', filePath),
    primaryNav: parseLinkArray(data.primaryNav, filePath, 'primaryNav'),
    footerLinks: parseLinkArray(data.footerLinks, filePath, 'footerLinks'),
  };
});

export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const data = await readSiteMarkdownFile('home.md');
  const filePath = 'content/site/home.md';

  return {
    eyebrow: requireStringField(data, 'eyebrow', filePath),
    headline: requireStringField(data, 'headline', filePath),
    intro: requireStringField(data, 'intro', filePath),
    primaryCta: {
      label: requireStringField(data, 'primary_cta_label', filePath),
      href: requireStringField(data, 'primary_cta_href', filePath),
    },
    secondaryCta: {
      label: requireStringField(data, 'secondary_cta_label', filePath),
      href: requireStringField(data, 'secondary_cta_href', filePath),
    },
    support: requireStringField(data, 'support', filePath),
    projectsSection: {
      eyebrow: requireStringField(data, 'projects_section_eyebrow', filePath),
      title: requireStringField(data, 'projects_section_title', filePath),
      body: requireStringField(data, 'projects_section_body', filePath),
      link: {
        label: requireStringField(data, 'projects_section_link_label', filePath),
        href: requireStringField(data, 'projects_section_link_href', filePath),
      },
    },
    notesSection: {
      eyebrow: requireStringField(data, 'notes_section_eyebrow', filePath),
      title: requireStringField(data, 'notes_section_title', filePath),
      body: requireStringField(data, 'notes_section_body', filePath),
      latestNoteLabel: requireStringField(data, 'latest_note_label', filePath),
      notesLink: {
        label: requireStringField(data, 'notes_section_link_label', filePath),
        href: requireStringField(data, 'notes_section_link_href', filePath),
      },
      snapshotLink: {
        label: requireStringField(data, 'snapshot_link_label', filePath),
        href: requireStringField(data, 'snapshot_link_href', filePath),
      },
    },
  };
});

async function getIndexPageContent(fileName: string): Promise<IndexPageContent> {
  const data = await readSiteMarkdownFile(fileName);
  const filePath = `content/site/${fileName}`;

  return {
    metadataTitle: requireStringField(data, 'metadata_title', filePath),
    metadataDescription: requireStringField(data, 'metadata_description', filePath),
    eyebrow: requireStringField(data, 'eyebrow', filePath),
    headline: requireStringField(data, 'headline', filePath),
    intro: requireStringField(data, 'intro', filePath),
  };
}

export const getProjectsPageContent = cache(async (): Promise<IndexPageContent> => getIndexPageContent('projects.md'));

export const getNotesPageContent = cache(async (): Promise<IndexPageContent> => getIndexPageContent('notes.md'));

export const getNowContent = cache(async (): Promise<NowContent> => {
  const data = await readSiteMarkdownFile('now.md');
  const filePath = 'content/site/now.md';

  return {
    metadataTitle: requireStringField(data, 'metadata_title', filePath),
    metadataDescription: requireStringField(data, 'metadata_description', filePath),
    eyebrow: requireStringField(data, 'eyebrow', filePath),
    headline: requireStringField(data, 'headline', filePath),
    intro: requireStringField(data, 'intro', filePath),
    overview: {
      title: requireStringField(data, 'overview_title', filePath),
      body: requireStringField(data, 'overview_body', filePath),
    },
    statusSections: parseStringArrayObjects(data.status_sections, filePath, 'status_sections', (item) => ({
      title: requireStringField(item, 'title', filePath),
      body: requireStringField(item, 'body', filePath),
    })),
    activeProjects: {
      title: requireStringField(data, 'active_projects_title', filePath),
      intro: requireStringField(data, 'active_projects_intro', filePath),
      items: parseStringArrayObjects(data.active_projects, filePath, 'active_projects', (item) => ({
        slug: requireStringField(item, 'slug', filePath),
        summary: requireStringField(item, 'summary', filePath),
      })),
    },
    explore: {
      title: requireStringField(data, 'explore_title', filePath),
      links: parseLinkArray(data.explore_links, filePath, 'explore_links'),
    },
  };
});