import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProfitCalculator } from "@/components/calculator/ProfitCalculator";

describe("ProfitCalculator", () => {
  it("updates professional results immediately from the short form", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    const profit = screen.getByTestId("profit-value");
    expect(profit).toHaveTextContent("76.06");

    const itemPrice = screen.getByLabelText("商品售价");
    await user.clear(itemPrice);
    await user.type(itemPrice, "100");

    expect(profit).not.toHaveTextContent("76.06");
    expect(screen.getByText("当前亏损")).toBeInTheDocument();
  });

  it("uses precise contribution language and a fixed domestic currency", () => {
    render(<ProfitCalculator />);

    expect(screen.getByText("订单贡献利润")).toBeInTheDocument();
    expect(screen.getByText("贡献利润率")).toBeInTheDocument();
    expect(screen.getByText("订单成本回报")).toBeInTheDocument();
    expect(screen.getByText("预计月贡献（100 单）")).toBeInTheDocument();
    expect(screen.getByLabelText("币种：人民币 CNY，不换算汇率")).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "币种" })).not.toBeInTheDocument();
  });

  it("shows compact completeness guidance for zero-value assumptions", () => {
    render(<ProfitCalculator />);

    expect(screen.getByText("核算完整度")).toBeInTheDocument();
    expect(screen.getByText("8 / 9 项")).toBeInTheDocument();
    expect(screen.getByText(/建议确认：/).parentElement).toHaveTextContent("税费预留");
    expect(screen.getByText(/0 元可能符合实际/)).toBeInTheDocument();
  });

  it("keeps secondary assumptions behind one advanced disclosure", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    const platformFee = screen.getByLabelText("平台佣金");
    expect(platformFee).not.toBeVisible();

    await user.click(screen.getByText("高级设置"));

    expect(platformFee).toBeVisible();
    expect(screen.getByLabelText("目标利润率")).toBeVisible();
  });

  it("switches to domestic categories and exposes unverified fee guidance", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    await user.selectOptions(screen.getByLabelText("销售平台"), "douyin");
    expect(screen.getByLabelText("商品分类")).toHaveValue("generic");
    expect(screen.getByText("费率状态").parentElement).toHaveTextContent("待核对");
    expect(screen.getByText(/当前 0 费率不代表免佣/)).toBeInTheDocument();
    expect(screen.getByText("费用待核对")).toBeInTheDocument();
    expect(screen.getByText("订单贡献利润（预览）")).toBeInTheDocument();
    expect(screen.getByText(/这还是一份不完整估算/)).toBeInTheDocument();

    const confirmation = screen.getByRole("checkbox", {
      name: /我已按后台或合同核对当前费用/,
    });
    expect(confirmation).not.toBeChecked();
    await user.click(confirmation);
    expect(screen.getByText("当前盈利")).toBeInTheDocument();
    expect(screen.getByText("费率状态").parentElement).toHaveTextContent("已自行核对");

    await user.click(screen.getByText("高级设置"));
    expect(screen.getByTestId("platform-fee")).toHaveValue(0);
    expect(screen.getByText("需登录商家后台")).toBeInTheDocument();
    expect(screen.getByText(/费率因类目、主体、活动或履约方式而异/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("商品分类"), "beauty");
    expect(screen.getByTestId("platform-fee")).toHaveValue(0);
    expect(confirmation).not.toBeChecked();
    expect(screen.getByText("费用待核对")).toBeInTheDocument();
  });

  it("marks a preset fee when the user overrides it", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    await user.selectOptions(screen.getByLabelText("销售平台"), "pinduoduo");
    const confirmation = screen.getByRole("checkbox", {
      name: /我已按后台或合同核对当前费用/,
    });
    await user.click(confirmation);
    expect(confirmation).toBeChecked();
    await user.click(screen.getByText("高级设置"));

    const refundLoss = screen.getByLabelText("退款损失预留");
    await user.clear(refundLoss);
    await user.type(refundLoss, "4");
    expect(confirmation).toBeChecked();

    const platformFee = screen.getByTestId("platform-fee");
    await user.clear(platformFee);
    await user.type(platformFee, "11");

    expect(platformFee).toHaveValue(11);
    expect(screen.getByText("已手动调整")).toBeInTheDocument();
    expect(confirmation).not.toBeChecked();
  });

  it("allows a number to stay blank until editing finishes", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    const productCost = screen.getByLabelText("商品成本");
    await user.clear(productCost);

    expect(productCost).toHaveValue(null);
    await user.tab();
    expect(productCost).toHaveValue(0);
  });

  it("links undecided sellers to the domestic platform guide", () => {
    render(<ProfitCalculator />);

    expect(screen.getByRole("link", { name: "帮我选平台" })).toHaveAttribute(
      "href",
      "/platforms",
    );
    expect(screen.getByLabelText("销售平台")).toHaveTextContent("淘宝");
    expect(screen.getByLabelText("销售平台")).not.toHaveTextContent("Amazon");
  });

  it("keeps professional inputs out of the default quick workflow", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    expect(screen.queryByLabelText("平台补贴收入")).not.toBeInTheDocument();
    await user.click(screen.getByText("高级设置"));

    const quickMode = screen.getByRole("button", { name: "快速估算" });
    const professionalMode = screen.getByRole("button", { name: "专业核算" });
    expect(quickMode).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByLabelText("平台补贴收入")).not.toBeInTheDocument();

    await user.click(professionalMode);
    expect(professionalMode).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("平台补贴收入")).toBeVisible();
    expect(screen.getByLabelText("商品售价")).toHaveValue(199);
    expect(screen.queryByLabelText("退款损失预留")).not.toBeInTheDocument();
  });

  it("shows creator commission only for creator-assisted sales", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    await user.click(screen.getByText("高级设置"));
    await user.click(screen.getByRole("button", { name: "专业核算" }));
    expect(screen.queryByTestId("creator-fee-fields")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("成交渠道"), "creator");
    const profitWithNoCommission = screen.getByTestId("profit-value").textContent;
    expect(screen.getByTestId("creator-fee-fields")).toBeVisible();

    const commissionRate = screen.getByLabelText("佣金率");
    await user.clear(commissionRate);
    await user.type(commissionRate, "20");
    expect(screen.getByTestId("profit-value")).not.toHaveTextContent(profitWithNoCommission ?? "");

    const profitWithCommission = screen.getByTestId("profit-value").textContent;
    await user.selectOptions(screen.getByLabelText("成交渠道"), "organic");
    expect(screen.queryByTestId("creator-fee-fields")).not.toBeInTheDocument();
    expect(screen.getByTestId("profit-value")).not.toHaveTextContent(profitWithCommission ?? "");
  });

  it("uses platform vocabulary without inserting an unverified numeric rate", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    await user.selectOptions(screen.getByLabelText("销售平台"), "douyin");
    await user.click(screen.getByText("高级设置"));
    await user.click(screen.getByRole("button", { name: "专业核算" }));

    expect(screen.getByText("平台技术服务费")).toBeInTheDocument();
    expect(screen.getByTestId("platform-fee")).toHaveValue(0);
    expect(screen.getByText(/2026\.10-professional-v1/)).toBeInTheDocument();
    expect(screen.getByText("需登录商家后台")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("成交渠道"), "creator");
    expect(screen.getByText("达人 / 精选联盟佣金")).toBeInTheDocument();
  });

  it("blocks reverse metrics when monthly costs have no order volume", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    await user.click(screen.getByText("高级设置"));
    await user.click(screen.getByRole("button", { name: "专业核算" }));

    const monthlyCost = screen.getByLabelText("平台 / 软件月费");
    await user.clear(monthlyCost);
    await user.type(monthlyCost, "300");
    const monthlyOrders = screen.getByLabelText("预计月订单");
    await user.clear(monthlyOrders);
    await user.type(monthlyOrders, "0");

    expect(screen.getByRole("alert")).toHaveTextContent("预计月订单必须大于 0");
    expect(screen.getByText("订单量待补充")).toBeInTheDocument();
    expect(screen.getByText("订单贡献利润（未含月费分摊）")).toBeInTheDocument();
    expect(screen.getByText("单笔月费分摊").parentElement).toHaveTextContent("--");
  });
});
