import type { Metadata } from "next";
import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import { getSiteUrl } from "@/src/config/site";

const contactEmail = "mrwbz@sina.com";
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "联系利衡",
  description: "通过公开邮箱联系利衡，反馈电商利润计算、平台费用和使用体验问题。",
  alternates: { canonical: `${siteUrl}/contact` },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="contact-page__header">
        <p className="eyebrow">联系利衡</p>
        <h1>有问题，直接发邮件</h1>
        <p>费率看不明白、结果不符合预期，或有功能建议，都可以通过下面的邮箱联系我们。</p>
      </header>

      <div className="contact-workspace">
        <section className="contact-channel" aria-labelledby="contact-channel-title">
          <div className="contact-channel__heading">
            <h2 id="contact-channel-title">直接联系</h2>
            <p>邮件适合补充截图、费用口径或较长的问题说明。</p>
          </div>
          <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("利衡使用反馈")}`}>
            <span className="contact-channel__icon" aria-hidden="true">
              <Mail size={18} />
            </span>
            <span>
              <small>联系邮箱</small>
              <strong>{contactEmail}</strong>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <div className="contact-channel__note">
            <ShieldCheck size={17} aria-hidden="true" />
            <p>请不要发送平台密码、验证码、身份证件或未经遮盖的完整账单。</p>
          </div>
        </section>
      </div>

      <section className="contact-privacy" aria-labelledby="contact-privacy-title">
        <h2 id="contact-privacy-title">本站不会收集邮件内容</h2>
        <p>点击邮箱会打开你设备上的邮件应用，邮件由你主动发送，不经过本站。计算器里的售价、成本、费率和利润结果仍只留在当前浏览器中。</p>
      </section>
    </main>
  );
}
