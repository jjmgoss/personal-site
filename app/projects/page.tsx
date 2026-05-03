import Link from 'next/link';
import { getProjectEntries } from '@/lib/content/projects';

export default async function ProjectsPage() {
  const projects = await getProjectEntries();

  return (
    <section className="stack">
      <p className="eyebrow">Projects</p>
      <h1>Project content foundation</h1>
      <p className="lede">
        Project entries are generated from Markdown content files so the catalog
        stays static-first, reviewable, and easy to extend.
      </p>
      <ul className="project-list">
        {projects.map((project) => (
          <li className="project-card" key={project.slug}>
            <div className="project-card-header">
              <div className="stack-tight">
                <p className="status-pill">{project.status}</p>
                <h2>
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
              </div>
              <p>{project.summary}</p>
            </div>
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