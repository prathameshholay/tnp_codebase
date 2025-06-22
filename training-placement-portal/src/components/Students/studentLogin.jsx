import React from "react";
import styles from "./StudentLogin.module.css";
import groupIcon from "../../assets/group-icon.png"; // Ensure correct relative path

const StudentLogin = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <img src={groupIcon} alt="Group Icon" className={styles.userImage} />
        <h2 className={styles.title}>Student Login</h2>

        <input type="email" placeholder="✉️ Email" className={styles.input} />
        <input type="password" placeholder="🔒 Password" className={styles.input} />
        <button className={styles.loginBtn}>Login</button>
      </div>

      <div className={styles.registerWrapper}>
        <a href="/register" className={styles.registerLink}>
          No account? Register here
        </a>
      </div>
    </div>
  );
};

export default StudentLogin;
