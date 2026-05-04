import Link from 'next/link';
import { getProjectEntries } from '@/lib/content/projects';
import { getHomeContent } from '@/lib/content/site';
import { getWritingEntries } from '@/lib/content/writing';

export default async function HomePage() {
  const [projects, notes, homeContent] = await Promise.all([
    getProjectEntries(),
    getWritingEntries(),
    getHomeContent(),
  ]);
  const featuredProjects = projects.slice(0, 3);
  const latestNote = notes[0];

  return (
    <div className="home-layout">
      <section className="stack hero-panel hero-panel-compact">
        <h1>{homeContent.headline}</h1>
        <p className="lede">{homeContent.intro}</p>
        <div className="hero-actions">
          <Link className="button-link" href={homeContent.primaryCta.href}>
            {homeContent.primaryCta.label}
          </Link>
          <Link className="subtle-link" href={homeContent.secondaryCta.href}>
            {homeContent.secondaryCta.label}
          </Link>
        </div>
        <p className="hero-support">{homeContent.support}</p>
      </section>

      <section className="home-grid home-grid-balanced">
        <article className="stack feature-panel">
          <p className="eyebrow">{homeContent.projectsSection.eyebrow}</p>
          <h2>{homeContent.projectsSection.title}</h2>
          <p>{homeContent.projectsSection.body}</p>
          <ul className="preview-list">
            {featuredProjects.map((project) => (
              <li className="preview-item" key={project.slug}>
                <div className="preview-item-heading">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  <span>{project.status}</span>
                </div>
                <p>{project.summary}</p>
              </li>
            ))}
          </ul>
          <Link className="subtle-link" href={homeContent.projectsSection.link.href}>
            {homeContent.projectsSection.link.label}
          </Link>
        </article>

        <article className="stack feature-panel">
          <p className="eyebrow">{homeContent.notesSection.eyebrow}</p>
          <h2>{homeContent.notesSection.title}</h2>
          <p>{homeContent.notesSection.body}</p>
          {latestNote ? (
            <div className="note-spotlight">
              <p className="post-date">{homeContent.notesSection.latestNoteLabel}</p>
              <h3>
                <Link href={`/writing/${latestNote.slug}`}>{latestNote.title}</Link>
              </h3>
              <p>{latestNote.summary}</p>
            </div>
          ) : null}
          <Link className="subtle-link" href={homeContent.notesSection.notesLink.href}>
            {homeContent.notesSection.notesLink.label}
          </Link>
          <Link className="subtle-link" href={homeContent.notesSection.snapshotLink.href}>
            {homeContent.notesSection.snapshotLink.label}
          </Link>
        </article>
      </section>
    </div>
  );
}