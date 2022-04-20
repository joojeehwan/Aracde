import React from 'react';
import Navbar from '../../common/navbar/Navbar';
import styles from '../Login/styles/mainLogin.module.scss';
const mainLogin = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.glass}>
          <Navbar />
          <div className={styles.squareContainer}>
            <div className={styles.square}>
              <p>로그인</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default mainLogin;
