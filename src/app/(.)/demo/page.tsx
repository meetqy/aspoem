import styles from "./page.module.css";

export default function Page() {
  return (
    <div className="relative">
      <div style={{ height: 2000 }}></div>
      <div className={styles.gContainer}>
        <svg
          className={styles.line}
          width="400"
          height="160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={styles.path}
            d="M 464 40 C 1000 1000, -464 1000, 464 1960"
            stroke="black"
            fill="transparent"
          />
        </svg>
        <div className={styles.fly}></div>

        <div className={`${styles.point} ${styles.point1}`}></div>
        <div className={`${styles.author1} ${styles.author}`}>李白</div>
        <div className={`${styles.intro1} ${styles.intro}`}>
          <p>701年5月19日 — 762年11月30日</p>
          <p>
            字<span className="text-info">太白</span>，号
            <span className="text-info">青莲居士</span>
            ，中国唐朝诗人。
          </p>
        </div>
        <div className={`${styles.content} ${styles.content1}`}>
          李白，唐代杰出诗人，他的诗歌表现独特的艺术风格，情感奔放，诗句流畅优美，作品经久传世。他被誉为中国浪漫主义诗歌的巅峰，深深影响了后世的创作。杜甫称赞他的才华非凡，赞美他的诗歌天下无敌。
        </div>
      </div>
    </div>
  );
}
