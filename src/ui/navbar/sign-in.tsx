import { Fragment } from "react";
import { signInWithGoogle, signOut } from "@/app/firebase/auth";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";
import { HiLogout } from "react-icons/hi";
import { FaGoogle, FaUser } from "react-icons/fa";

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  return (
    <Fragment>
      {user ? (
        <div className={styles.userMenu}>
          <button
            className={styles.userAvatar}
            title={user.displayName || "User"}
          >
            <div className={styles.avatarFallback}>
              <FaUser />
            </div>
          </button>
          <div className={styles.dropdown}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.displayName || "User"}
              </div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
            <hr className={styles.divider} />
            <button className={styles.signOutButton} onClick={signOut}>
              <HiLogout size={20} />
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.signInButton} onClick={signInWithGoogle}>
          <FaGoogle size={18} />
          Sign in
        </button>
      )}
    </Fragment>
  );
}
