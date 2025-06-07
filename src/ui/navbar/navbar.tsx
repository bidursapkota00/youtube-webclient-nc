"use client";

import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "@/app/firebase/auth";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import Upload from "./upload";
import { HiMenu } from "react-icons/hi";
import { HiSearch, HiMicrophone } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import { HiHome, HiBell } from "react-icons/hi";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Left section - Logo and menu */}
        <div className={styles.leftSection}>
          <button className={styles.menuButton}>
            <HiMenu size={24} />
          </button>

          <Link href="/" className={styles.logoContainer}>
            <Image
              width={90}
              height={20}
              src="/youtube-logo.png"
              alt="YouTube Logo"
              className={styles.logo}
            />
          </Link>
        </div>

        {/* Center section - Search */}
        <div className={styles.centerSection}>
          <form onSubmit={handleSearch} className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <HiSearch size={20} />
              </button>
            </div>
            <button type="button" className={styles.micButton}>
              <HiMicrophone size={20} />
            </button>
          </form>
        </div>

        {/* Right section - Actions and user */}
        <div className={styles.rightSection}>
          <button className={styles.iconButton}>
            <HiBell size={24} />
          </button>

          {user && <Upload />}
          <SignIn user={user} />
        </div>
      </div>
    </nav>
  );
}
