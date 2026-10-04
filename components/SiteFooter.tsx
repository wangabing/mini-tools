import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>利衡</strong>
          <span>结果仅供经营估算，不构成财税建议。</span>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/platforms">平台对比</Link>
          <Link href="/methodology">计算口径</Link>
          <Link href="/contact">联系</Link>
          <Link href="/privacy">隐私政策</Link>
          <Link href="/terms">使用条款</Link>
        </nav>
      </div>
    </footer>
  );
}
