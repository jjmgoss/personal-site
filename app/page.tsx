import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-layout">
      <section className="stack hero-panel">
        <p className="eyebrow">Static-first project studio</p>
        <h1>Projects, notes, and public documentation gathered into one readable place.</h1>
        <p className="lede">
          This site is a content-first workspace for active experiments, implementation
          notes, deployment writeups, and the repos that support them. It is meant to
          stay useful early, before it becomes elaborate.
        </p>
        <div className="hero-actions">
          <Link className="button-link" href="/projects">
            Browse projects
          </Link>
          <Link className="subtle-link" href="/writing">
            Read the log
          </Link>
        </div>
      </section>

      <section className="home-grid">
        <article className="stack feature-panel">
          <p className="eyebrow">Projects</p>
          <h2>Catalog active work without turning the site into a dashboard.</h2>
          <p>
            Project pages pull from Markdown content so status, stack choices,
            milestones, and repo links stay easy to review in pull requests.
          </p>
          <Link className="subtle-link" href="/projects">
            Open the project catalog
          </Link>
        </article>

        <article className="stack feature-panel">
          <p className="eyebrow">Writing</p>
          <h2>Keep implementation notes close to the code they describe.</h2>
          <p>
            The writing section acts like a public lab notebook for decisions,
            progress, and longer-form technical context.
          </p>
          <Link className="subtle-link" href="/writing">
            Open the writing log
          </Link>
        </article>
      </section>
    </div>
  );
}