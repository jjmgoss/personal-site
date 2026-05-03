import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/content/site';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.metadataDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <div className="site-frame">
            <header className="site-header">
              <div className="site-brand">
                <p className="site-kicker">{siteConfig.headerKicker}</p>
                <Link className="site-title" href="/">
                  {siteConfig.title}
                </Link>
                <p className="site-subtitle">{siteConfig.headerSubtitle}</p>
              </div>
              <nav aria-label="Primary">
                <ul className="site-nav">
                  {siteConfig.primaryNav.map((item) => (
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
                <p className="site-footer-title">{siteConfig.footerTitle}</p>
                <p className="site-footer-copy">{siteConfig.footerSummary}</p>
              </div>
              <ul className="site-footer-links">
                {siteConfig.footerLinks.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith('/') ? (
                      <Link href={item.href}>{item.label}</Link>
                    ) : (
                      <a href={item.href} rel="noreferrer" target="_blank">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}