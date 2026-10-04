import { Calculator } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="利衡首页">
          <span className="brand__mark" aria-hidden="true">
            <Calculator size={17} strokeWidth={2.2} />
          </span>
          <span>利衡</span>
          <small>利润决策工具</small>
        </Link>
        <nav className="site-nav" aria-label="主导航">
          <Link href="/platforms">平台对比</Link>
          <Link href="/methodology">计算口径</Link>
          <Link href="/contact">联系</Link>
          <Link href="/privacy">隐私</Link>
        </nav>
      </div>
    </header>
  );
}
