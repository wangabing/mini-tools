import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/src/config/brand";
import { getSiteUrl } from "@/src/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(new URL(getSiteUrl()).origin),
  title: { default: BRAND_NAME, template: `%s | ${BRAND_NAME}` },
  applicationName: BRAND_NAME,
  description: BRAND_DESCRIPTION,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
