import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order of the Suspicious Timestamp',
  description: 'A small archival note for readers who inspect chronology a little too closely.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuspiciousTimestampPage() {
  return (
    <section className="stack page-shell">
      <p className="eyebrow">Archival Notice</p>
      <h1>Order of the Suspicious Timestamp</h1>
      <p className="lede">You noticed the archive is not entirely innocent.</p>
      <div className="stack-tight markdown-body">
        <p>This is unusual, and therefore has been recorded.</p>
        <p>Badge awarded: Chronology Auditor, Third Class.</p>
        <p>Please accept the staff&apos;s restrained concern and continue as you were.</p>
      </div>
    </section>
  );
}