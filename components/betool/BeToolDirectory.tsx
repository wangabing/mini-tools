"use client";

import {
  ArrowUpToLine, ChevronDown, Coffee, House, LayoutGrid, PanelLeftClose, PanelLeftOpen, Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import brandIcon from "@/app/icon.png";
import { BRAND_NAME, BRAND_SLOGAN } from "@/src/config/brand";
import { BETOOL_CATEGORIES } from "@/src/data/betool";
import { BeToolSearch } from "./BeToolSearch";
import styles from "./betool.module.css";

export function BeToolDirectory({ basePath, children }: { basePath: string; children?: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const assetRoot = `${basePath}/betool/`;

  useEffect(() => {
    const updateScroll = () => setShowBackToTop(window.scrollY > 180);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  function scrollToCategory(id: string) {
    drawer.current?.close();
    setActiveCategory(id);
    const category = document.getElementById(id);
    if (category) category.scrollIntoView({ behavior: "smooth" });
    else router.push(`/#${id}`);
  }

  function scrollHome() {
    drawer.current?.close();
    setActiveCategory(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sidebarContent = (
    <div className={styles.sideContent}>
      <Link className={styles.brand} href="/" onClick={scrollHome}>
        <Image src={brandIcon} alt="" width={46} height={46} priority unoptimized />
        <span className={styles.brandWordmark}><strong>{BRAND_NAME}</strong><small>{BRAND_SLOGAN}</small></span>
      </Link>
      <nav className={styles.navigation} aria-label="工具分类">
        <button
          type="button"
          className={styles.navItem}
          aria-expanded={categoriesExpanded}
          data-active={Boolean(activeCategory)}
          onClick={() => setCategoriesExpanded((expanded) => !expanded)}
        >
          <LayoutGrid size={18} aria-hidden="true" />
          <span>分类</span>
          <ChevronDown className={styles.categoryChevron} size={15} aria-hidden="true" />
        </button>
        {categoriesExpanded && BETOOL_CATEGORIES.map(({ id, name }) => (
          <button
            className={`${styles.navItem} ${styles.categoryItem}`}
            type="button"
            aria-current={activeCategory === id ? "location" : undefined}
            key={id}
            onClick={() => scrollToCategory(id)}
          >
            {name}
          </button>
        ))}
        <Link className={styles.navItem} href="/donate/">
          <Coffee size={18} aria-hidden="true" />
          支持项目
        </Link>
        <Link className={styles.navItem} href="/privacy/">
          <Shield size={18} aria-hidden="true" />
          隐私说明
        </Link>
      </nav>
    </div>
  );

  return (
    <div className={styles.directory} data-sidebar-collapsed={sidebarCollapsed}>
      <aside className={styles.sidebar}>{sidebarContent}</aside>
      <dialog
        ref={drawer}
        className={styles.drawer}
        aria-label="工具分类"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {sidebarContent}
      </dialog>

      <div className={styles.content}>
        <header className={styles.toolbar}>
          <button
            className={`${styles.iconButton} ${styles.desktopToggle}`}
            type="button"
            aria-expanded={!sidebarCollapsed}
            aria-label={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
            title={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
          </button>
          <button
            className={`${styles.iconButton} ${styles.mobileToggle}`}
            type="button"
            aria-label="打开工具分类"
            aria-haspopup="dialog"
            title="打开工具分类"
            onClick={() => drawer.current?.showModal()}
          >
            <PanelLeftOpen size={24} />
          </button>
          <Link href="/" className={styles.mobileBrand} onClick={scrollHome}>
            <Image src={brandIcon} alt="" width={28} height={28} unoptimized />
            <span>{BRAND_NAME}</span>
          </Link>
          <Link
            className={`${styles.iconButton} ${styles.homeButton}`}
            href="/"
            aria-label={`${BRAND_NAME}首页`}
            title="首页"
            onClick={scrollHome}
          >
            <House size={22} />
          </Link>
          <BeToolSearch />
        </header>

        {children ?? <main className={styles.catalog} aria-label={`${BRAND_NAME}目录`}>
          {BETOOL_CATEGORIES.map(({ id, name, tools }) => (
            <section key={id} aria-labelledby={id}>
              <h2 className={styles.categoryTitle} id={id}>{name}</h2>
              <div className={styles.cards}>
                {tools.map((tool) => (
                  <Link className={styles.card} key={tool.href} href={tool.href} prefetch={false}>
                    <div className={styles.cardHeader}>
                      <Image src={assetRoot + tool.icon} alt="" width={40} height={40} unoptimized />
                      <div className={styles.cardHeading}>
                        <h3 title={tool.title}>{tool.title}</h3>
                        <span>{name}</span>
                      </div>
                    </div>
                    <p title={tool.description}>{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </main>}

        <footer className={styles.footer}>
          © {new Date().getFullYear()} <strong>{BRAND_NAME}</strong>
        </footer>
      </div>
      {showBackToTop && (
        <button
          className={styles.backToTop}
          type="button"
          aria-label="回到顶部"
          title="回到顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpToLine size={18} />
        </button>
      )}
    </div>
  );
}
