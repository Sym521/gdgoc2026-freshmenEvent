import styles from './BottomBun.module.css';

/**
 * 下バンズコンポーネント
 * ハンバーガースタックの土台として画面中央に配置される
 */
export function BottomBun() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bun} aria-label="下のバンズ" />
    </div>
  );
}
