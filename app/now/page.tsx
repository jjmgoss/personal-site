import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectEntries } from '@/lib/content/projects';
import { getNowContent } from '@/lib/content/site';

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getNowContent();

  return {
    title: pageContent.metadataTitle,
    description: pageContent.metadataDescription,
  };
}

export default async function NowPage() {
  const [pageContent, projects] = await Promise.all([getNowContent(), getProjectEntries()]);
  const projectMap = new Map(projects.map((project) => [project.slug, project]));

  return (
    <section className="stack page-shell">
      <p className="eyebrow">{pageContent.eyebrow}</p>
      <h1>{pageContent.headline}</h1>
      <p className="lede">{pageContent.intro}</p>

      <div className="stack-tight">
        <h2>{pageContent.overview.title}</h2>
        <p className="lede">{pageContent.overview.body}</p>
      </div>

      <div className="project-list">
        {pageContent.statusSections.map((section) => (
          <article className="project-card" key={section.title}>
            <div className="stack-tight">
              <p className="status-pill">Current</p>
              <h2>{section.title}</h2>
            </div>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <div className="stack-tight">
        <h2>{pageContent.activeProjects.title}</h2>
        <p className="lede">{pageContent.activeProjects.intro}</p>
      </div>

      <ul className="project-list">
        {pageContent.activeProjects.items.map((project) => {
          const projectEntry = projectMap.get(project.slug);
          const href = `/projects/${project.slug}`;
          const title = projectEntry?.title ?? project.slug;

          return (
          <li className="project-card" key={project.slug}>
            <div className="stack-tight">
              <p className="status-pill">Active</p>
              <h2>
                <Link href={href}>{title}</Link>
              </h2>
            </div>
            <p>{project.summary}</p>
          </li>
          );
        })}
      </ul>

      <div className="stack-tight">
        <h2>{pageContent.explore.title}</h2>
        <ul className="project-links">
          {pageContent.explore.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}