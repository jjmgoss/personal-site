import Link from 'next/link';
import { getWritingEntries } from '@/lib/content/writing';

export default async function WritingPage() {
  const entries = await getWritingEntries();

  return (
    <section className="stack">
      <p className="eyebrow">Writing</p>
      <h1>Implementation notes and project log</h1>
      <p className="lede">
        Writing posts are generated from Markdown files so implementation notes,
        project updates, and longer-form writeups stay reviewable and static-first.
      </p>
      <ul className="post-list">
        {entries.map((entry) => (
          <li className="post-card" key={entry.slug}>
            <div className="stack-tight">
              <p className="post-date">{entry.date}</p>
              <h2>
                <Link href={`/writing/${entry.slug}`}>{entry.title}</Link>
              </h2>
            </div>
            <p>{entry.summary}</p>
            <ul className="tag-list">
              {entry.tags.map((tag) => (
                <li className="tag-pill" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
            {entry.related_projects.length > 0 ? (
              <p className="post-meta">
                Related projects:{' '}
                {entry.related_projects.map((projectSlug, index) => (
                  <span key={projectSlug}>
                    {index > 0 ? ', ' : ''}
                    <Link href={`/projects/${projectSlug}`}>{projectSlug}</Link>
                  </span>
                ))}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}