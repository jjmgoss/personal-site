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
        <h2>{pageContent.currentState.title}</h2>
        <p className="lede">{pageContent.currentState.body}</p>
      </div>

      <div className="stack-tight">
        <h2>{pageContent.liveRoutes.title}</h2>
        <p className="lede">{pageContent.liveRoutes.intro}</p>
      </div>

      <ul className="project-list">
        {pageContent.liveRoutes.items.map((route) => (
          <li className="project-card" key={route.href}>
            <div className="stack-tight">
              <p className="status-pill">Live</p>
              <h2>
                <a href={route.href} rel="noreferrer" target="_blank">
                  {route.label}
                </a>
              </h2>
            </div>
            <p>{route.summary}</p>
          </li>
        ))}
      </ul>

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
        <h2>{pageContent.recentlyChanged.title}</h2>
      </div>

      <ul className="project-list">
        {pageContent.recentlyChanged.items.map((item) => (
          <li className="project-card" key={item}>
            <p>{item}</p>
          </li>
        ))}
      </ul>

      <div className="stack-tight">
        <h2>{pageContent.nextLikelyWork.title}</h2>
      </div>

      <ul className="project-list">
        {pageContent.nextLikelyWork.items.map((item) => (
          <li className="project-card" key={item}>
            <p>{item}</p>
          </li>
        ))}
      </ul>

      <div className="stack-tight">
        <h2>{pageContent.whatStaysPrivate.title}</h2>
        <p className="lede">{pageContent.whatStaysPrivate.body}</p>
      </div>

      <div className="stack-tight">
        <h2>{pageContent.agentMaintenance.title}</h2>
      </div>

      <ul className="project-list">
        {pageContent.agentMaintenance.items.map((item) => (
          <li className="project-card" key={item}>
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}