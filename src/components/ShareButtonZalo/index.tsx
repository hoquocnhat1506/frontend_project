import styles from "./style.module.scss";
const ZaloShareButton = () => {
  const shareUrl = `https://frontend-project-tzgb.onrender.com/home`;

  const handleShare = () => {
    window.open(shareUrl);
  };

  return (
    <div className={styles["share"]}>
      <button onClick={handleShare}>Chia sẽ cho mọi người</button>
    </div>
  );
};

export default ZaloShareButton;
