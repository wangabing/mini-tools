import type { Metadata } from "next";
import { BRAND_NAME } from "@/src/config/brand";
import styles from "@/components/betool/betool-tools.module.css";

export const metadata: Metadata = { title: "支持项目" };

export default function SupportPage() {
  return (
    <main className={styles.workbench}>
      <h1 className={styles.panel}>支持 {BRAND_NAME}</h1>
      <p className={styles.panel}>支持渠道暂未开通。欢迎把常用工具分享给有需要的人。</p>
    </main>
  );
}
