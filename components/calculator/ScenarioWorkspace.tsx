"use client";

import { useState, useSyncExternalStore } from "react";
import { calculateProfit } from "@/src/domain/profit/calculate";
import { formatMoney, formatPercent } from "@/src/domain/profit/format";
import {
  clearScenarios, createScenario, getScenarioSnapshot, getServerScenarioSnapshot,
  isScenarioCurrent, MAX_SAVED_SCENARIOS, subscribeScenarios, writeScenarios,
  type SavedScenario, type ScenarioDraft,
} from "@/src/domain/profit/scenarios";
import { getPlatform } from "@/src/data/presets";

interface ScenarioWorkspaceProps {
  draft: ScenarioDraft;
  onRestore: (scenario: SavedScenario) => void;
}

export function ScenarioWorkspace({ draft, onRestore }: ScenarioWorkspaceProps) {
  const { plans, error } = useSyncExternalStore(subscribeScenarios, getScenarioSnapshot, getServerScenarioSnapshot);
  const [name, setName] = useState("日常价");
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [pendingClear, setPendingClear] = useState(false);
  const [open, setOpen] = useState(false);
  const compared = plans.filter((plan) => selected.includes(plan.id));

  function save() {
    const latest = getScenarioSnapshot();
    if (latest.error) { setNotice(latest.error); return; }
    if (latest.plans.length >= MAX_SAVED_SCENARIOS) {
      setNotice("最多保存12个方案，请先删除不需要的方案。");
      setOpen(true);
      return;
    }
    try {
      const plan = createScenario(draft, name);
      const saveError = writeScenarios([...latest.plans, plan]);
      setNotice(saveError ?? `已保存“${plan.name}”，可修改售价后另存一个方案进行比较。`);
      if (!saveError) {
        setOpen(true);
        setSelected((current) => [...current.filter((id) => latest.plans.some((item) => item.id === id)), plan.id].slice(-3));
      }
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "方案未保存，请检查输入。");
    }
  }

  function restore(plan: SavedScenario, copy = false) {
    onRestore(plan);
    setName(`${plan.name}${copy ? " 副本" : " 调整"}`.slice(0, 40));
    setNotice(isScenarioCurrent(plan)
      ? `已载入“${plan.name}”。修改后点击“保存新方案”保留新版本。`
      : `已按当前口径载入“${plan.name}”，请重新核对费用；原方案历史结果仍保留。`);
    document.getElementById("calculator-inputs")?.scrollIntoView({ behavior: "auto", block: "start" });
  }

  function remove(id: string) {
    const latest = getScenarioSnapshot();
    if (latest.error) { setNotice(latest.error); return; }
    const deleteError = writeScenarios(latest.plans.filter((plan) => plan.id !== id));
    setNotice(deleteError ?? "已删除方案。");
    if (!deleteError) { setPendingDelete(null); setSelected((current) => current.filter((item) => item !== id)); }
  }

  return (
    <section className="scenario-workspace" id="saved-plans" aria-labelledby="saved-plans-title">
      <div className="scenario-heading">
        <div>
          <p className="panel-kicker">为下一次调价留一份底稿</p>
          <h2 id="saved-plans-title">保存与对比</h2>
          <p>保存日常价，再调整活动价或达人佣金，比较哪种方案更合适。</p>
        </div>
        <span className="local-badge">仅保存在此浏览器</span>
      </div>
      <form className="scenario-save" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label htmlFor="scenario-name">方案名称
          <input id="scenario-name" value={name} maxLength={40} placeholder="例如：活动价、达人价" onChange={(event) => setName(event.target.value)} required />
        </label>
        <button className="primary-action" type="submit" disabled={draft.isExample || Boolean(error)}>保存新方案</button>
      </form>
      <p className="scenario-privacy">{draft.isExample ? "先填写你的商品，再保存方案。" : "只在点击保存时记录，未保存的修改刷新后会丢失。"} 清理浏览器数据会删除方案，共用设备请在使用后删除。</p>
      {notice ? <p className="scenario-notice" role="status">{notice}</p> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className="saved-plans-details">
        <summary>我的方案（{plans.length} / {MAX_SAVED_SCENARIOS}）<small>最多选择3个对比</small></summary>
        {plans.length === 0 && !error ? <p className="scenario-empty">还没有保存方案。填写商品后，给当前方案起个名字并保存。</p> : null}
        <div className="saved-plan-list">
          {plans.map((plan) => {
            const current = isScenarioCurrent(plan);
            const preview = plan.isExample || !plan.feesConfirmed;
            return (
              <article className="saved-plan" key={plan.id}>
                <label className="saved-plan-select">
                  <input type="checkbox" aria-label={`对比${plan.name}`} checked={selected.includes(plan.id)} disabled={!selected.includes(plan.id) && compared.length >= 3}
                    onChange={(event) => setSelected((items) => event.target.checked ? [...items, plan.id] : items.filter((id) => id !== plan.id))} />
                  <span><strong>{plan.name}</strong><small>{getPlatform(plan.platformId).label} · {plan.input.calculationMode === "quick" ? "快速估算" : "专业核算"}</small></span>
                </label>
                <div className="saved-plan-amount"><strong>{formatMoney(plan.summary.profit, "CNY")}</strong><small>{!current ? "历史结果 · 待重算" : preview ? "估算预览 · 待核对" : "按已确认费用估算"}</small></div>
                <div className="saved-plan-actions">
                  <button type="button" onClick={() => restore(plan)}>载入<span className="sr-only">{plan.name}</span></button>
                  <button type="button" onClick={() => restore(plan, true)}>复制调整<span className="sr-only">{plan.name}</span></button>
                  {pendingDelete === plan.id ? <>
                    <button type="button" className="danger-action" onClick={() => remove(plan.id)}>确认删除<span className="sr-only">{plan.name}</span></button>
                    <button type="button" onClick={() => setPendingDelete(null)}>取消</button>
                  </> : <button type="button" onClick={() => setPendingDelete(plan.id)}>删除<span className="sr-only">{plan.name}</span></button>}
                </div>
              </article>
            );
          })}
        </div>
        {compared.length > 0 ? <section className="scenario-comparison" aria-label="方案对比">
          <h3>方案对比 <small>各方案按自身核算口径与费用假设展示</small></h3>
          <div className="scenario-comparison-grid">
            {compared.map((plan) => {
              const current = isScenarioCurrent(plan);
              const result = current ? calculateProfit(plan.input) : null;
              const qualified = !current || plan.isExample || !plan.feesConfirmed;
              return <article key={plan.id}>
                <h4>{plan.name}</h4>
                <p>{plan.input.calculationMode === "professional" ? "每笔发出订单 · 分摊后收益" : "快速估算 · 订单贡献"}</p>
                <p className={qualified ? "field-error" : ""}>{!current ? "历史口径，载入后重新核对" : qualified ? "费用待核对，以下仅为预览" : "按已确认费用估算"}</p>
                <dl>
                  <div><dt>商品售价</dt><dd>{formatMoney(plan.input.itemPrice, "CNY")}</dd></div>
                  <div><dt>单笔预计收益</dt><dd>{formatMoney(plan.summary.profit, "CNY")}</dd></div>
                  <div><dt>预计收益率</dt><dd>{formatPercent(plan.summary.profitMargin)}</dd></div>
                  <div><dt>广告单笔上限{qualified ? "（预览）" : ""}</dt><dd>{formatMoney(plan.summary.maximumAdvertisingCost, "CNY")}</dd></div>
                  <div><dt>预计月收益（{plan.input.monthlyOrders}单）</dt><dd>{formatMoney(plan.summary.monthlyProfit, "CNY")}</dd></div>
                  {result ? <div><dt>保本售价{qualified ? "（预览）" : ""}</dt><dd>{formatMoney(result.breakEvenItemPrice, "CNY")}</dd></div> : null}
                </dl>
                <details><summary>保存依据</summary><p>{plan.modelVersion} · {plan.presetVersion}</p><p>保存于 {plan.savedAt.slice(0, 10)}</p>{plan.sourceUrl ? <a href={plan.sourceUrl} target="_blank" rel="noreferrer">核对官方来源</a> : <p>通用经营假设，无平台来源</p>}</details>
              </article>;
            })}
          </div>
        </section> : null}
      </details>
      {plans.length > 0 || error ? <div className="scenario-clear">
        {pendingClear ? <><span>将删除此浏览器内的全部方案。</span><button type="button" className="danger-action" onClick={() => {
          const clearError = clearScenarios(); setNotice(clearError ?? "已清空本地方案。");
          if (!clearError) { setPendingClear(false); setSelected([]); }
        }}>确认清空全部方案</button><button type="button" onClick={() => setPendingClear(false)}>取消</button></>
          : <button type="button" onClick={() => setPendingClear(true)}>清空本地方案</button>}
      </div> : null}
    </section>
  );
}
