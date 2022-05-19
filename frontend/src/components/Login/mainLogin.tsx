import React, { useEffect } from 'react';
import Navbar from '../../common/navbar/Navbar';
import styles from '../Login/styles/mainLogin.module.scss';

//png
import GoogleLogin from '../../assets/loginButton/GoogleLoginButton.png';
import KakaoLogin from '../../assets/loginButton/KakaoLoginButton.png';

//url
import { KAKAO_AUTH_URL } from './kakao/OAuth';
import { GOOGLE_AUTH_URL } from './google/OAuth';

function mainLogin() {
  
  return (
    <>
      <div className={styles.main}>
        <div className={styles.glass}>
          <Navbar />
          <div className={styles.squareContainer}>
            <div className={styles.square}>
              <p className={styles.content}>로그인</p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <a href={GOOGLE_AUTH_URL}>
                  <img className={styles.loginButton} src={GoogleLogin} alt="구글 로그인" />
                </a>
                <a href={KAKAO_AUTH_URL}>
                  <img className={styles.loginButton} src={KakaoLogin} alt="카카오 로그인" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default mainLogin;
