import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { expect, test, type Page } from '@playwright/test';

const repoRoot = path.resolve(__dirname, '..');

type SiteConfig = {
  title: string;
  primaryNav: Array<{
    href: string;
    label: string;
  }>;
};

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(repoRoot, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function readFrontmatter(relativePath: string): Record<string, unknown> {
  const filePath = path.join(repoRoot, relativePath);
  const rawFile = fs.readFileSync(filePath, 'utf8');
  return matter(rawFile).data;
}

const siteConfig = readJsonFile<SiteConfig>('content/site/site.json');
const homeContent = readFrontmatter('content/site/home.md');
const projectsPageContent = readFrontmatter('content/site/projects.md');
const notesPageContent = readFrontmatter('content/site/notes.md');
const nowPageContent = readFrontmatter('content/site/now.md');
const personalSiteProject = readFrontmatter('content/projects/personal-site.md');
const autonomousProductDevelopmentPath = path.join(
  repoRoot,
  'content/projects/autonomous-product-development.md'
);
const autonomousProductDevelopment = fs.existsSync(autonomousProductDevelopmentPath)
  ? readFrontmatter('content/projects/autonomous-product-development.md')
  : undefined;

async function assertNoObviousAppError(page: Page) {
  await expect(page.locator('body')).not.toContainText(/Application error|Unhandled Runtime Error/i);
}

async function assertLoadedImages(page: Page) {
  const images = page.locator('img');
  const count = await images.count();

  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();

    await expect
      .poll(async () => {
        return image.evaluate((node) => {
          const img = node as HTMLImageElement;

          if (!img.complete) {
            return 'pending';
          }

          return img.naturalWidth > 0 && img.naturalHeight > 0 ? 'loaded' : 'broken';
        });
      })
      .toBe('loaded');
  }
}

async function assertRoute(page: Page, route: string, expectedHeading: string, expectedTitleFragment: string) {
  const response = await page.goto(route, { waitUntil: 'networkidle' });

  expect(response).not.toBeNull();
  expect(response?.ok(), `Expected ${route} to load successfully.`).toBeTruthy();

  await assertNoObviousAppError(page);
  await expect(page.getByRole('heading', { level: 1, name: expectedHeading })).toBeVisible();
  await expect(page.locator('body')).toContainText(siteConfig.title);

  const pageTitle = await page.title();
  expect(pageTitle.trim().length).toBeGreaterThan(0);
  expect(pageTitle).toContain(expectedTitleFragment);

  await assertLoadedImages(page);
}

test.describe('public route smoke tests', () => {
  test('homepage renders and primary navigation works', async ({ page }) => {
    await assertRoute(
      page,
      '/',
      String(homeContent.headline),
      siteConfig.title
    );

    const navigation = page.getByRole('navigation', { name: 'Primary' });
    const projectsLink = navigation.getByRole('link', {
      name: siteConfig.primaryNav.find((item) => item.href === '/projects')?.label ?? 'Projects',
    });
    const notesLink = navigation.getByRole('link', {
      name: siteConfig.primaryNav.find((item) => item.href === '/writing')?.label ?? 'Notes',
    });

    await expect(projectsLink).toBeVisible();
    await expect(notesLink).toBeVisible();

    await projectsLink.click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { level: 1, name: String(projectsPageContent.headline) })).toBeVisible();

    await page.goto('/', { waitUntil: 'networkidle' });
    await notesLink.click();
    await expect(page).toHaveURL(/\/writing$/);
    await expect(page.getByRole('heading', { level: 1, name: String(notesPageContent.headline) })).toBeVisible();
  });

  test('theme control follows system preference and persists manual overrides', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/', { waitUntil: 'networkidle' });

    const root = page.locator('html');
    const themeGroup = page.getByRole('radiogroup', { name: 'Theme' });
    const systemOption = page.getByRole('radio', { name: 'System' });
    const lightOption = page.getByRole('radio', { name: 'Light' });
    const darkOption = page.getByRole('radio', { name: 'Dark' });

    await expect(themeGroup).toBeVisible();
    await expect(systemOption).toBeChecked();
    await expect(root).toHaveAttribute('data-theme-preference', 'system');
    await expect(root).toHaveAttribute('data-theme', 'dark');

    await lightOption.check();
    await expect(lightOption).toBeChecked();
    await expect(root).toHaveAttribute('data-theme-preference', 'light');
    await expect(root).toHaveAttribute('data-theme', 'light');

    await page.reload({ waitUntil: 'networkidle' });
    await expect(lightOption).toBeChecked();
    await expect(root).toHaveAttribute('data-theme-preference', 'light');
    await expect(root).toHaveAttribute('data-theme', 'light');

    await darkOption.check();
    await expect(darkOption).toBeChecked();
    await expect(root).toHaveAttribute('data-theme-preference', 'dark');
    await expect(root).toHaveAttribute('data-theme', 'dark');

    await systemOption.check();
    await expect(systemOption).toBeChecked();
    await expect(root).toHaveAttribute('data-theme-preference', 'system');
    await expect(root).toHaveAttribute('data-theme', 'dark');
  });

  test('projects index renders', async ({ page }) => {
    await assertRoute(
      page,
      '/projects',
      String(projectsPageContent.headline),
      String(projectsPageContent.metadata_title)
    );
  });

  test('personal-site project page renders without broken images', async ({ page }) => {
    await assertRoute(
      page,
      '/projects/personal-site',
      String(personalSiteProject.title),
      String(personalSiteProject.title)
    );

    await expect(page.locator('body')).toContainText(String(personalSiteProject.summary));
    await expect(page.locator('text=Current visual snapshot')).toHaveCount(0);
  });

  test('writing index renders', async ({ page }) => {
    await assertRoute(
      page,
      '/writing',
      String(notesPageContent.headline),
      String(notesPageContent.metadata_title)
    );
  });

  test('now page renders', async ({ page }) => {
    await assertRoute(
      page,
      '/now',
      String(nowPageContent.headline),
      String(nowPageContent.metadata_title)
    );
  });

  if (autonomousProductDevelopment) {
    test('autonomous product development page renders', async ({ page }) => {
      await assertRoute(
        page,
        '/projects/autonomous-product-development',
        String(autonomousProductDevelopment.title),
        String(autonomousProductDevelopment.title)
      );

      await expect(page.locator('body')).toContainText(String(autonomousProductDevelopment.summary));
    });
  }
});