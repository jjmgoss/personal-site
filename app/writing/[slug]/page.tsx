import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getWritingEntry, getWritingSlugs } from '@/lib/content/writing';

type WritingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WritingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getWritingEntry(slug);

  if (!entry) {
    return {
      title: 'Notes',
    };
  }

  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function WritingDetailPage({ params }: WritingDetailPageProps) {
  const { slug } = await params;
  const entry = await getWritingEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="stack page-shell writing-detail">
      <Link className="back-link" href="/writing">
        Back to notes
      </Link>
      <p className="eyebrow">Notes</p>
      <div className="stack-tight">
        <p className="post-date">{entry.date}</p>
        <h1>{entry.title}</h1>
      </div>
      <p className="lede">{entry.summary}</p>
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
      <div className="markdown-body">
        <ReactMarkdown>{entry.content}</ReactMarkdown>
      </div>
    </article>
  );
}