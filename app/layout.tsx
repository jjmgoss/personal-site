import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'personal-site',
  description: 'A static-first hub for projects, notes, and writing.',
};

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
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
                <p className="site-kicker">Public lab notebook</p>
                <Link className="site-title" href="/">
                  personal-site
                </Link>
                <p className="site-subtitle">
                  Static-first project pages, writing notes, and public documentation
                  for ongoing software work.
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
                <p className="site-footer-title">personal-site</p>
                <p className="site-footer-copy">
                  A calm, static-first studio for project documentation, working notes,
                  and links to related repositories.
                </p>
              </div>
              <ul className="site-footer-links">
                <li>
                  <Link href="/projects">Projects</Link>
                </li>
                <li>
                  <Link href="/writing">Writing</Link>
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