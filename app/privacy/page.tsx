import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { getSiteUrl } from "@/src/config/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "隐私政策",
  description: "利衡如何保护你填写的经营数据，以及网站托管可能产生的基础访问记录。",
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="隐私保护"
      title="你填写的经营数字，只用来完成本次计算"
      summary="使用计算器不需要登录。售价、成本和利润结果不会上传或云端分析；只有你主动点击保存时，方案才会保存在当前浏览器。"
    >
      <section>
        <h2>计算内容留在当前设备</h2>
        <p>售价、成本、费率和利润结果只在你的浏览器内完成计算，不会发送给利衡或第三方。未点击保存的修改刷新或关闭页面后无法找回。</p>
      </section>

      <section>
        <h2>保存的方案只留在当前设备</h2>
        <p>点击“保存新方案”后，方案会写入当前浏览器的本地存储，方便下次恢复和对比。本站无法读取、同步或恢复这些内容；清理浏览器数据、使用无痕窗口或更换设备可能使方案消失。你可以在计算器的“保存与对比”中清空全部方案。</p>
      </section>

      <section>
        <h2>不会拿你的账做分析</h2>
        <p>我们不会读取你的计算内容，也不会根据你填写的经营数字建立画像、推荐广告或生成行业报告。未经你主动确认，不会改变这一处理方式。</p>
      </section>

      <section>
        <h2>通过邮箱联系</h2>
        <p>联系页只公开邮箱地址，不包含在线留言表单。点击邮箱会打开你设备上的邮件应用，邮件内容不经过本站，也不会自动附带计算器中的售价、成本、费率、平台选择或利润结果。</p>
        <p>请不要在邮件中发送平台密码、验证码、身份证件或未经遮盖的完整账单。</p>
      </section>

      <section>
        <h2>基础访问记录</h2>
        <p>为了保障网页正常打开和处理异常，网站托管方可能记录访问时间、访问页面、浏览器类型和必要的网络连接信息。这些基础记录不包含你在计算器中填写的售价、成本、费率或计算结果。</p>
      </section>

      <section>
        <h2>更新日期</h2>
        <p>本说明更新于 2026 年 10 月 3 日。任何影响你经营信息的变化，都会先清楚说明，并在需要时征得你的同意。</p>
      </section>
    </ContentPage>
  );
}
