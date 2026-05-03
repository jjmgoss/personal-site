import Link from 'next/link';
import { getProjectEntries } from '@/lib/content/projects';
import { getWritingEntries } from '@/lib/content/writing';

export default async function HomePage() {
  const [projects, notes] = await Promise.all([getProjectEntries(), getWritingEntries()]);
  const featuredProjects = projects.slice(0, 3);
  const latestNote = notes[0];

  return (
    <div className="home-layout">
      <section className="stack hero-panel hero-panel-compact">
        <p className="eyebrow">Jason Goss</p>
        <h1>How to get the machine to do work for me.</h1>
        <p className="lede">
          I build software, automation, and AI-assisted workflows that turn rough ideas
          into useful tools. This is the portfolio and notebook for the experiments,
          systems, and work-in-progress projects worth sharing.
        </p>
        <div className="hero-actions">
          <Link className="button-link" href="/projects">
            View projects
          </Link>
          <Link className="subtle-link" href="/writing">
            Read notes
          </Link>
        </div>
        <p className="hero-support">
          The through-line is practical: use software systems, agent workflows, and AI
          tools to move more work with less manual drag.
        </p>
      </section>

      <section className="home-grid home-grid-balanced">
        <article className="stack feature-panel">
          <p className="eyebrow">Selected work</p>
          <h2>Projects first, with the rough edges left visible.</h2>
          <p>
            Most of the work here is still in progress. That is the point: the site shows
            what is actually being built, what is still getting sharper, and what seems
            worth continuing.
          </p>
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
          <Link className="subtle-link" href="/projects">
            Browse the full project list
          </Link>
        </article>

        <article className="stack feature-panel">
          <p className="eyebrow">Notes</p>
          <h2>Notes on what holds up, what breaks, and what changes next.</h2>
          <p>
            The notes section is where decisions, experiments, and implementation details
            get written down before they disappear into a commit history.
          </p>
          {latestNote ? (
            <div className="note-spotlight">
              <p className="post-date">Latest note</p>
              <h3>
                <Link href={`/writing/${latestNote.slug}`}>{latestNote.title}</Link>
              </h3>
              <p>{latestNote.summary}</p>
            </div>
          ) : null}
          <Link className="subtle-link" href="/writing">
            Read all notes
          </Link>
          <Link className="subtle-link" href="/now">
            See the current snapshot
          </Link>
        </article>
      </section>
    </div>
  );
}