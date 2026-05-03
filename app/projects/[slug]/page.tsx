import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getProjectEntry, getProjectSlugs } from '@/lib/content/projects';

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectEntry(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="stack project-detail">
      <Link className="back-link" href="/projects">
        Back to projects
      </Link>
      <p className="eyebrow">Project</p>
      <div className="stack-tight">
        <p className="status-pill">{project.status}</p>
        <h1>{project.title}</h1>
      </div>
      <p className="lede">{project.summary}</p>
      <dl className="project-facts">
        <div>
          <dt>Stack</dt>
          <dd>{project.stack.join(' · ')}</dd>
        </div>
        <div>
          <dt>Next milestone</dt>
          <dd>{project.next_milestone}</dd>
        </div>
      </dl>
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
      <div className="markdown-body">
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </div>
    </article>
  );
}