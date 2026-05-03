import { getProjectEntries } from '@/lib/content/projects';

export default async function ProjectsPage() {
  const projects = await getProjectEntries();

  return (
    <section className="stack">
      <p className="eyebrow">Projects</p>
      <h1>Project content foundation</h1>
      <p className="lede">
        Project entries now load from Markdown frontmatter. A later issue will
        turn this data into the full project index and detail UI.
      </p>
      <ul className="project-list">
        {projects.map((project) => (
          <li className="project-card" key={project.slug}>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <p className="project-meta">
              <span>{project.status}</span>
              <span>{project.stack.join(' · ')}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}