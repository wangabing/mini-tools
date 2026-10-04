"use client";

import {
  BadgeCheck,
  Bike,
  Check,
  ChevronDown,
  ExternalLink,
  Factory,
  LayoutList,
  Plus,
  Route,
  Store,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  PLATFORM_GUIDES,
  SELLER_PATHS,
  type PlatformGuide,
  type SellerPath,
} from "@/src/data/platform-guides";

type PathFilter = "all" | SellerPath;

const PATH_ICONS = {
  all: LayoutList,
  "low-barrier": Store,
  content: Video,
  brand: BadgeCheck,
  local: Bike,
  b2b: Factory,
} as const;

export function PlatformExplorer() {
  const [activePath, setActivePath] = useState<PathFilter>("all");
  const [shortlist, setShortlist] = useState<PlatformGuide["id"][]>([]);

  const activePathOption = SELLER_PATHS.find((path) => path.id === activePath) ?? SELLER_PATHS[0];
  const filteredPlatforms = useMemo(
    () => activePath === "all"
      ? PLATFORM_GUIDES
      : PLATFORM_GUIDES.filter((platform) => platform.paths.includes(activePath)),
    [activePath],
  );
  const selectedPlatforms = shortlist.map(
    (id) => PLATFORM_GUIDES.find((platform) => platform.id === id),
  ).filter((platform): platform is PlatformGuide => Boolean(platform));
  const limitReached = shortlist.length >= 3;

  function toggleShortlist(id: PlatformGuide["id"]) {
    setShortlist((current) => {
      if (current.includes(id)) {
        return current.filter((platformId) => platformId !== id);
      }

      return current.length < 3 ? [...current, id] : current;
    });
  }

  return (
    <div className="platform-explorer">
      <section className="path-workspace" aria-labelledby="path-title">
        <div className="explorer-heading">
          <div>
            <p className="panel-kicker">先看经营方式</p>
            <h2 id="path-title">经营路径地图</h2>
          </div>
          <span>{filteredPlatforms.length} 个匹配平台</span>
        </div>

        <div className="path-map">
          <div className="path-map__origin">
            <Route size={19} aria-hidden="true" />
            <span>你的经营起点</span>
          </div>
          <div className="path-map__rail" aria-hidden="true" />
          <div className="path-map__choices" aria-label="按经营路径筛选">
            {SELLER_PATHS.map((path) => {
              const Icon = PATH_ICONS[path.id];

              return (
                <button
                  key={path.id}
                  type="button"
                  aria-pressed={activePath === path.id}
                  onClick={() => setActivePath(path.id)}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{path.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="active-path" aria-live="polite">
          <strong>{activePathOption.shortLabel}</strong>
          <p>{activePathOption.description}</p>
        </div>
      </section>

      <section className="shortlist-workspace" aria-labelledby="shortlist-title" aria-live="polite">
        <header>
          <div>
            <p className="panel-kicker">留下少数候选</p>
            <h2 id="shortlist-title">候选平台对比</h2>
          </div>
          <strong>已选 {shortlist.length} / 3</strong>
        </header>

        {selectedPlatforms.length === 0 ? (
          <div className="shortlist-empty">
            <span>从下方平台中保留最适合当前货源与能力的候选。</span>
            <small>建议同时比较一个主平台和一个低成本验证渠道。</small>
          </div>
        ) : (
          <div className="shortlist-grid">
            {selectedPlatforms.map((platform) => (
              <article key={platform.id}>
                <header>
                  <div>
                    <span>{platform.model}</span>
                    <h3>{platform.name}</h3>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`从对比移除${platform.name}`}
                    title={`移除${platform.name}`}
                    onClick={() => toggleShortlist(platform.id)}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </header>
                <dl>
                  <div><dt>门槛</dt><dd>{platform.barrier}</dd></div>
                  <div><dt>最适合</dt><dd>{platform.bestFor}</dd></div>
                  <div><dt>成本重点</dt><dd>{platform.costModel}</dd></div>
                </dl>
                <p>{platform.selectionAdvice}</p>
              </article>
            ))}
          </div>
        )}
        {limitReached ? <p className="shortlist-limit">候选已满。先移除一个平台，再加入新的候选。</p> : null}
      </section>

      <section className="platform-directory" aria-labelledby="directory-title">
        <header className="directory-heading">
          <div>
            <p className="panel-kicker">逐个平台看差异</p>
            <h2 id="directory-title">平台经营对比</h2>
          </div>
          <p>门槛衡量起步难度，不代表经营难度。费用均需回到商家后台或合同核对。</p>
        </header>

        <div className="platform-list">
          {filteredPlatforms.map((platform) => {
            const isSelected = shortlist.includes(platform.id);

            return (
              <article className="platform-row" key={platform.id} data-platform-id={platform.id}>
                <div className="platform-row__main">
                  <div className="platform-identity">
                    <span className="platform-rank">{String(platform.rank).padStart(2, "0")}</span>
                    <div>
                      <div className="platform-tags">
                        <span>{platform.model}</span>
                        <span>门槛 {platform.barrier}</span>
                      </div>
                      <h3>{platform.name}</h3>
                      <p>{platform.positioning}</p>
                    </div>
                  </div>

                  <dl className="platform-facts">
                    <div>
                      <dt>适合</dt>
                      <dd>{platform.bestFor}</dd>
                    </div>
                    <div>
                      <dt>不太适合</dt>
                      <dd>{platform.notIdealFor}</dd>
                    </div>
                    <div>
                      <dt>成本结构</dt>
                      <dd>{platform.costModel}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    className={isSelected ? "shortlist-button shortlist-button--selected" : "shortlist-button"}
                    aria-pressed={isSelected}
                    aria-label={isSelected ? `取消${platform.name}候选` : `加入${platform.name}对比`}
                    disabled={!isSelected && limitReached}
                    onClick={() => toggleShortlist(platform.id)}
                  >
                    {isSelected ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                    <span>{isSelected ? "已加入" : "加入对比"}</span>
                  </button>
                </div>

                <details className="platform-detail">
                  <summary>
                    <span>优劣、选择建议与近期信号</span>
                    <ChevronDown size={17} aria-hidden="true" />
                  </summary>
                  <div className="platform-detail__body">
                    <section>
                      <h4>主要优势</h4>
                      <ul>{platform.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
                    </section>
                    <section>
                      <h4>现实取舍</h4>
                      <ul>{platform.tradeoffs.map((item) => <li key={item}>{item}</li>)}</ul>
                    </section>
                    <section>
                      <h4>选择建议</h4>
                      <p>{platform.selectionAdvice}</p>
                    </section>
                    <section className="platform-signal">
                      <h4>近期经营信号</h4>
                      <p>{platform.recentSignal}</p>
                      <small>复核于 {platform.reviewedAt}</small>
                    </section>
                    <section className="platform-benefit">
                      <h4>活动与权益入口</h4>
                      <p>{platform.benefitNote}</p>
                      <a href={platform.officialUrl} target="_blank" rel="noreferrer">
                        {platform.officialLabel}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </section>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </section>

      <section className="selection-guidance" aria-labelledby="selection-guidance-title">
        <header>
          <p className="panel-kicker">开店前核对</p>
          <h2 id="selection-guidance-title">新手选择顺序</h2>
        </header>
        <ol>
          <li><span>1</span><div><strong>先看现有能力</strong><p>货源、内容、品牌资质、本地门店或企业销售能力，至少有一项明确优势。</p></div></li>
          <li><span>2</span><div><strong>再算完整成本</strong><p>平台费之外，把推广、达人、配送、活动让利、退款和固定费用摊销一起算。</p></div></li>
          <li><span>3</span><div><strong>最后小规模验证</strong><p>先保留 2–3 个候选，用真实后台费率和小批量订单验证，再决定主阵地。</p></div></li>
        </ol>
        <p className="time-sensitive-note">
          平台准入、费用、活动和权益会持续变化。本文提供经营选择框架，不保证任何优惠；最终以官方商家后台、审核结果和合同为准。
        </p>
      </section>
    </div>
  );
}
