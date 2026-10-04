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

    await user.click(screen.getByText("高级设置"));
    expect(screen.getByTestId("platform-fee")).toHaveValue(0);
    expect(screen.getByText("需登录商家后台")).toBeInTheDocument();
    expect(screen.getByText(/费率因类目、主体、活动或履约方式而异/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("商品分类"), "beauty");
    expect(screen.getByTestId("platform-fee")).toHaveValue(0);
  });

  it("marks a preset fee when the user overrides it", async () => {
    const user = userEvent.setup();
    render(<ProfitCalculator />);

    await user.selectOptions(screen.getByLabelText("销售平台"), "pinduoduo");
    await user.click(screen.getByText("高级设置"));

    const platformFee = screen.getByTestId("platform-fee");
    await user.clear(platformFee);
    await user.type(platformFee, "11");

    expect(platformFee).toHaveValue(11);
    expect(screen.getByText("已手动调整")).toBeInTheDocument();
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
});
