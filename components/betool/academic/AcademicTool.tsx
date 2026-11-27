"use client";

import { BETOOL_CATEGORIES } from "@/src/data/betool";
import { chartTools } from "./ChartTools";
import { educationTools } from "./EducationTools";
import { randomTools } from "./RandomTools";
import styles from "./academic.module.css";

const tools = { ...educationTools, ...chartTools, ...randomTools };
const catalog = BETOOL_CATEGORIES.flatMap(({ tools }) => tools);

export function AcademicTool({ slug }: { slug: string }) {
  if (!Object.hasOwn(tools, slug)) return null;
  const Tool = tools[slug as keyof typeof tools];
  const entry = catalog.find(({ href }) => href === `/${slug}/`);

  return <div className={styles.workbench}>
    <div className={styles.panel}><Tool /></div>
    {entry?.description && <section className={styles.panel} aria-label="描述">
      <h2>描述</h2>
      <p>{entry.description}</p>
    </section>}
  </div>;
}
