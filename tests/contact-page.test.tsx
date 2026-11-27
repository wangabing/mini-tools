import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage from "@/app/_liheng/contact/page";

describe("contact page", () => {
  it("offers direct email without an online message form", () => {
    render(<ContactPage />);

    expect(screen.getByRole("link", { name: /mrwbz@sina.com/ })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:mrwbz@sina.com"),
    );
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /发送/ })).not.toBeInTheDocument();
    expect(screen.getByText(/不经过本站/)).toBeInTheDocument();
  });
});
