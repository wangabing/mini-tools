import type { ReactNode } from "react";

interface ContentPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}

export function ContentPage({ eyebrow, title, summary, children }: ContentPageProps) {
  return (
    <main className="content-page">
      <header className="content-page__header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{summary}</p>
      </header>
      <article className="content-page__body">{children}</article>
    </main>
  );
}
