import type { Metadata } from 'next';
import Link from 'next/link';
import { getWritingEntries } from '@/lib/content/writing';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Technical notes and build writeups from ongoing software and AI projects.',
};

export default async function WritingPage() {
  const entries = await getWritingEntries();

  return (
    <section className="stack page-shell">
      <p className="eyebrow">Notes</p>
      <h1>Notes from the build process</h1>
      <p className="lede">
        Short technical notes, project updates, and writeups on what is working, what is
        changing, and what is worth keeping from the experiments.
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