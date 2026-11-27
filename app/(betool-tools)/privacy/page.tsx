import type { Metadata } from "next";
import styles from "@/components/betool/betool-tools.module.css";

export const metadata: Metadata = { title: "隐私说明" };

export default function PrivacyPage() {
  return (
    <main className={styles.workbench}>
      <h1 className={styles.panel}>隐私说明</h1>
      <div className={styles.panel}>
        <p>工具输入、上传的文件和生成的结果由浏览器在本机处理。</p>
        <p>打开视频流时，浏览器会连接该地址和播放清单指定的资源。</p>
        <p>计时器设置和游戏统计可能保存在当前浏览器。清除该站点数据即可删除。</p>
      </div>
    </main>
  );
}
