import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Now',
  description: 'A current snapshot of Jason Goss projects, priorities, and work in progress.',
};

const activeProjects = [
  {
    href: '/projects/personal-site',
    title: 'Personal Site',
    summary:
      'The portfolio and notes hub itself. Right now the work is tightening the public presentation so it feels stable enough to share without pretending it is finished.',
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
      'Right now the focus is sharpening the public presentation: clearer project pages, better notes, and a stronger explanation of the work without turning the site into a product pitch.',
  },
  {
    title: 'What exists now',
    body:
      'Projects, notes, and the current snapshot are already live in the app. The structure is simple on purpose so adding work stays lightweight instead of turning into site maintenance.',
  },
  {
    title: 'Deployment status',
    body:
      'The site runs in a LAN-first self-hosted setup today. Public routing has been planned, but it is still intentionally off while the content and presentation get stronger.',
  },
  {
    title: 'What is still intentionally private',
    body:
      'Internet-facing deployment, infrastructure details, and other operational mechanics are not the story yet. The goal is to make the work clearer first, then make it public.',
  },
  {
    title: 'Next milestones',
    body:
      'Next up: expand project coverage, keep writing down what is learned, and keep tightening the parts that make the work feel credible from the outside.',
  },
];

export default function NowPage() {
  return (
    <section className="stack page-shell">
      <p className="eyebrow">Now</p>
      <h1>What I’m focused on now</h1>
      <p className="lede">
        A quick snapshot of the work in motion, what feels solid enough to talk about,
        and what is still staying behind the curtain for now.
      </p>

      <div className="stack-tight">
        <h2>What this is</h2>
        <p className="lede">
          This site is the public-facing record of software projects, AI experiments,
          and technical notes that are still being worked on. It is meant to stay useful,
          direct, and honest about what is finished versus what is still taking shape.
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
          The current set is small on purpose: a few projects that are active, documented,
          and still moving.
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
            <Link href="/projects/personal-site">Personal Site</Link>
          </li>
          <li>
            <Link href="/projects/hn-trend-tracker">HN Trend Tracker</Link>
          </li>
          <li>
            <Link href="/projects/repo-rails">repo-rails</Link>
          </li>
          <li>
            <Link href="/writing">Notes</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}