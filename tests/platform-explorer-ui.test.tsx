import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PlatformExplorer } from "@/components/platforms/PlatformExplorer";

describe("PlatformExplorer", () => {
  it("filters the directory by a seller's operating path", async () => {
    const user = userEvent.setup();
    render(<PlatformExplorer />);

    expect(screen.getByRole("heading", { name: "淘宝" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "美团闪购" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "本地即时零售" }));

    expect(screen.queryByRole("heading", { name: "淘宝" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "美团闪购" })).toBeInTheDocument();
    expect(screen.getByText("3 个匹配平台")).toBeInTheDocument();
  });

  it("limits the shortlist to three platforms and allows removal", async () => {
    const user = userEvent.setup();
    render(<PlatformExplorer />);

    await user.click(screen.getByRole("button", { name: "加入淘宝对比" }));
    await user.click(screen.getByRole("button", { name: "加入天猫对比" }));
    await user.click(screen.getByRole("button", { name: "加入京东开放平台对比" }));

    expect(screen.getByText("已选 3 / 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "加入拼多多对比" })).toBeDisabled();
    expect(screen.getByText(/候选已满/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "从对比移除淘宝" }));

    expect(screen.getByText("已选 2 / 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "加入拼多多对比" })).toBeEnabled();
  });

  it("reveals qualified recent information and an official entrance", async () => {
    const user = userEvent.setup();
    render(<PlatformExplorer />);

    const taobaoRow = screen.getByRole("heading", { name: "淘宝" }).closest("article");
    expect(taobaoRow).not.toBeNull();

    await user.click(within(taobaoRow!).getByText("优劣、选择建议与近期信号"));

    expect(within(taobaoRow!).getByText("近期经营信号")).toBeVisible();
    expect(within(taobaoRow!).getByText("复核于 2026-10-03")).toBeVisible();
    expect(within(taobaoRow!).getByRole("link", { name: /淘宝卖家中心/ })).toHaveAttribute(
      "href",
      "https://seller.taobao.com/",
    );
  });
});
