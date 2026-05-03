import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectEntries } from '@/lib/content/projects';
import { getProjectsPageContent } from '@/lib/content/site';

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getProjectsPageContent();

  return {
    title: pageContent.metadataTitle,
    description: pageContent.metadataDescription,
  };
}

export default async function ProjectsPage() {
  const [projects, pageContent] = await Promise.all([getProjectEntries(), getProjectsPageContent()]);

  return (
    <section className="stack page-shell">
      <p className="eyebrow">{pageContent.eyebrow}</p>
      <h1>{pageContent.headline}</h1>
      <p className="lede">{pageContent.intro}</p>
      <ul className="project-list">
        {projects.map((project) => (
          <li className="project-card" key={project.slug}>
            {project.screenshots?.[0] ? (
              <Link className="project-card-visual" href={`/projects/${project.slug}`}>
                <img
                  alt={project.screenshots[0].alt}
                  className="project-card-image"
                  src={project.screenshots[0].src}
                />
              </Link>
            ) : null}
            <div className="project-card-header">
              <div className="stack-tight">
                <p className="status-pill">{project.status}</p>
                <h2>
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
              </div>
              <p className="card-copy">{project.summary}</p>
            </div>
            {project.screenshots?.length ? (
              <p className="project-meta">Preview available</p>
            ) : null}
            <p className="project-meta">
              <span>Stack: {project.stack.join(' · ')}</span>
            </p>
            <p className="project-meta">Next milestone: {project.next_milestone}</p>
            <ul className="project-links">
              <li>
                <a href={project.repo_url} rel="noreferrer" target="_blank">
                  Repository
                </a>
              </li>
              {project.docs_url ? (
                <li>
                  <a href={project.docs_url} rel="noreferrer" target="_blank">
                    Docs
                  </a>
                </li>
              ) : null}
              {project.live_url ? (
                <li>
                  <a href={project.live_url} rel="noreferrer" target="_blank">
                    Live
                  </a>
                </li>
              ) : null}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}