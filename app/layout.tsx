import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteUrl } from "@/src/config/site";

const siteUrl = getSiteUrl();
const siteOrigin = new URL(siteUrl).origin;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "电商利润计算器 | 利衡",
    template: "%s | 利衡",
  },
  description:
    "免费核算单笔电商订单的利润、利润率、ROI、保本售价、广告空间和目标售价。支持平台与商品类目参考费率。",
  applicationName: "利衡电商利润计算器",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "利衡",
    title: "电商利润计算器 | 利衡",
    description: "用简单输入，看清一笔订单真正留下的利润。",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "电商利润计算器 | 利衡",
    description: "用简单输入，看清一笔订单真正留下的利润。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7f5",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
