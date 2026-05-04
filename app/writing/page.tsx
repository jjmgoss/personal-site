import type { Metadata } from 'next';
import Link from 'next/link';
import { getNotesPageContent } from '@/lib/content/site';
import { getWritingEntries } from '@/lib/content/writing';

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getNotesPageContent();

  return {
    title: pageContent.metadataTitle,
    description: pageContent.metadataDescription,
  };
}

export default async function WritingPage() {
  const [entries, pageContent] = await Promise.all([getWritingEntries(), getNotesPageContent()]);

  return (
    <section className="stack page-shell">
      <p className="eyebrow">{pageContent.eyebrow}</p>
      <h1>{pageContent.headline}</h1>
      <p className="lede">{pageContent.intro}</p>
      <ul className="post-list">
        {entries.map((entry) => (
          <li className="post-card" key={entry.slug}>
            <div className="stack-tight">
              <p className="post-date">By {entry.author} · {entry.date}</p>
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