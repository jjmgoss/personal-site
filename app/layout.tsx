import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jason Goss',
    template: '%s | Jason Goss',
  },
  description: 'Software projects, technical notes, and AI-assisted experiments by Jason Goss.',
};

const navigationItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Notes' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <div className="site-frame">
            <header className="site-header">
              <div className="site-brand">
                <p className="site-kicker">Software projects and notes</p>
                <Link className="site-title" href="/">
                  Jason Goss
                </Link>
                <p className="site-subtitle">
                  AI-assisted software experiments, project notes, and work in progress
                  aimed at getting useful work done with less manual effort.
                </p>
              </div>
              <nav aria-label="Primary">
                <ul className="site-nav">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link className="site-nav-link" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </header>
            <main className="site-main">{children}</main>
            <footer className="site-footer">
              <div>
                <p className="site-footer-title">Jason Goss</p>
                <p className="site-footer-copy">
                  Projects, notes, and experiments in software, automation, and agent workflows.
                </p>
              </div>
              <ul className="site-footer-links">
                <li>
                  <Link href="/projects">Projects</Link>
                </li>
                <li>
                  <Link href="/writing">Notes</Link>
                </li>
                <li>
                  <Link href="/now">Now</Link>
                </li>
                <li>
                  <a href="https://github.com/jjmgoss/personal-site" rel="noreferrer" target="_blank">
                    Source
                  </a>
                </li>
              </ul>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}