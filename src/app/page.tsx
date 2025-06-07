import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { getVideos } from "@/app/firebase/functions";
import { HiPlay } from "react-icons/hi";
import { HiDotsVertical } from "react-icons/hi";

export default async function Home() {
  const videos = (await getVideos()).filter((v) => v.status === "processed");

  return (
    <main className={styles.main}>
      <div className={styles.videoGrid}>
        {videos.map((video, index) => (
          <Link
            href={`/watch?v=${video.filename}`}
            key={video.id}
            className={styles.videoCard}
          >
            <div className={styles.thumbnailContainer}>
              <Image
                src={video.thumbnail || "/thumbnail.jpg"}
                alt={video.title || "Video thumbnail"}
                width={320}
                height={180}
                className={styles.thumbnail}
              />
              <div className={styles.videoDuration}>
                {video.duration || "10:24"}
              </div>
              <div className={styles.playOverlay}>
                <HiPlay size={48} color="white" />
              </div>
            </div>

            <div className={styles.videoInfo}>
              <div className={styles.channelAvatar}>
                <div className={styles.channelAvatarCircle}>
                  {video.channelName ? video.channelName[0].toUpperCase() : "C"}
                </div>
              </div>

              <div className={styles.videoDetails}>
                <h3 className={styles.videoTitle}>
                  {video.title || `Amazing Video ${index + 1}`}
                </h3>
                <div className={styles.videoMeta}>
                  <p className={styles.channelName}>
                    {video.channelName || "Channel Name"}
                  </p>
                  <div className={styles.videoStats}>
                    <span>{video.views || "1.2M"} views</span>
                    <span className={styles.dot}>•</span>
                    <span>{video.uploadTime || "2 days ago"}</span>
                  </div>
                </div>
              </div>

              <button className={styles.menuButton}>
                <HiDotsVertical size={16} />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export const revalidate = 30;
