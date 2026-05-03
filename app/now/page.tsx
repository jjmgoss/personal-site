import Link from 'next/link';

const activeProjects = [
  {
    href: '/projects/personal-site',
    title: 'personal-site',
    summary:
      'The main hub for project documentation, writing, and deployment notes. The current focus is making the site clearer and more useful before public launch.',
  },
  {
    href: '/projects/hn-trend-tracker',
    title: 'HN Trend Tracker',
    summary:
      'A separate project exploring Hacker News trend collection, analysis, and presentation. It remains one of the active projects documented from this site.',
  },
  {
    href: '/projects/repo-rails',
    title: 'repo-rails',
    summary:
      'A tooling project for repo structure, policy, and review workflows that supports repeatable setup across project repositories.',
  },
];

const statusSections = [
  {
    title: 'Current focus',
    body:
      'The current focus is improving the project site itself: clearer navigation, better public-safe project summaries, more writing, and a status snapshot that explains what is finished and what is still intentionally private.',
  },
  {
    title: 'Site status',
    body:
      'The site is already content-driven. Project pages and writing pages are generated from Markdown content, and the app stays static-first so updates remain easy to review and cheap to host.',
  },
  {
    title: 'Deployment status',
    body:
      'The site is running on a LAN-first self-hosted deployment. Local Docker and Synology deployment paths are working, and public routing has been planned but is not enabled yet.',
  },
  {
    title: 'What is not public yet',
    body:
      'Public exposure, tunnel configuration, DNS changes, and other internet-facing deployment steps are intentionally paused. The current priority is to make the site itself more complete before turning it outward.',
  },
  {
    title: 'Next milestones',
    body:
      'The likely next steps are broadening the site content, refining the project catalog, adding more public-safe writing, and continuing UI polish so the site feels complete before public launch.',
  },
];

export default function NowPage() {
  return (
    <section className="stack page-shell">
      <p className="eyebrow">Now</p>
      <h1>Current snapshot</h1>
      <p className="lede">
        This site is a public-safe project snapshot: what is being built, what is already
        working, and what is intentionally still private while the site takes shape.
      </p>

      <div className="stack-tight">
        <h2>What this site is</h2>
        <p className="lede">
          personal-site is the readable front door for ongoing software work. It gathers
          project summaries, implementation notes, and deployment documentation into one
          static-first place that stays reviewable and calm.
        </p>
      </div>

      <div className="project-list">
        {statusSections.map((section) => (
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
        <h2>Active projects</h2>
        <p className="lede">
          The site currently centers on a small set of active projects that are already
          documented here and will keep expanding as the site matures.
        </p>
      </div>

      <ul className="project-list">
        {activeProjects.map((project) => (
          <li className="project-card" key={project.href}>
            <div className="stack-tight">
              <p className="status-pill">Active</p>
              <h2>
                <Link href={project.href}>{project.title}</Link>
              </h2>
            </div>
            <p>{project.summary}</p>
          </li>
        ))}
      </ul>

      <div className="stack-tight">
        <h2>Explore from here</h2>
        <ul className="project-links">
          <li>
            <Link href="/projects">Project catalog</Link>
          </li>
          <li>
            <Link href="/projects/personal-site">personal-site</Link>
          </li>
          <li>
            <Link href="/projects/hn-trend-tracker">HN Trend Tracker</Link>
          </li>
          <li>
            <Link href="/projects/repo-rails">repo-rails</Link>
          </li>
          <li>
            <Link href="/writing">Writing log</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}