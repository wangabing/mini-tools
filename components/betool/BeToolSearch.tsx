"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useId, useState } from "react";
import { BETOOL_TOOLS } from "@/src/data/betool";
import styles from "./betool.module.css";

export function BeToolSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const router = useRouter();
  const keyword = query.trim().toLowerCase();
  const matches = BETOOL_TOOLS.filter(({ title, description }) =>
    `${title} ${description}`.toLowerCase().includes(keyword),
  );

  useEffect(() => {
    if (open) {
      document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, listId, activeIndex]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        setOpen(true);
        const step = event.key === "ArrowDown" ? 1 : -1;
        if (open && matches.length) {
          setActiveIndex((index) => (index + step + matches.length) % matches.length);
        }
        break;
      }
      case "Enter":
        if (open && matches[activeIndex]) {
          event.preventDefault();
          router.push(matches[activeIndex].href);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        break;
    }
  }

  return (
    <div className={styles.search}>
      <input
        aria-label="搜索工具"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && matches.length ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        role="combobox"
        placeholder="输入关键词搜索，如文本、json、图片等"
        value={query}
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <ChevronDown className={styles.searchChevron} size={15} aria-hidden="true" />

      {open && (
        <div className={styles.suggestions} id={listId} role="listbox" aria-label="匹配工具">
          {matches.length ? matches.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              prefetch={false}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {tool.title} - {tool.description}
            </Link>
          )) : <div className={styles.noResults} role="status">无数据</div>}
        </div>
      )}
    </div>
  );
}
