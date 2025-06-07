"use client";

import { Fragment, useState } from "react";
import { uploadVideo } from "@/app/firebase/functions";
import styles from "./upload.module.css";
import { HiUpload } from "react-icons/hi";
import { HiOutlineRefresh } from "react-icons/hi";

export default function Upload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadVideo(file);
      alert(
        `File uploaded successfully. Response: ${JSON.stringify(response)}`
      );
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Fragment>
      <input
        id="upload"
        className={styles.uploadInput}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label
        htmlFor="upload"
        className={`${styles.uploadButton} ${
          isUploading ? styles.uploading : ""
        }`}
        title="Create"
      >
        {isUploading ? (
          <div className={styles.spinner}>
            <HiOutlineRefresh size={20} className="animate-spin" />
          </div>
        ) : (
          <HiUpload size={24} />
        )}
      </label>
    </Fragment>
  );
}
