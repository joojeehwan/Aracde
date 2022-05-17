import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../../common/api/jWT-Token';
import UserApi from '../../../common/api/UserApi';
import PacmanLoader from 'react-spinners/PacmanLoader';
import styles from '../styles/mainLogin.module.scss';

function OAuth2RedirectHandler() {
  const code = new URL(window.location.href).searchParams.get('code');
  const navigate = useNavigate();
  const { getGoogleLoginResult } = UserApi;
  const [color, setColor] = useState('#7C64D5');

  // api 통신
  //백으로 code 넘기고 토큰 저장하고, api 통신 연결하고 로그인 이후의 화면으로 보내면 된다. ex, main
  const apiResult = async () => {
    const result = await getGoogleLoginResult(code as string);
    saveToken(result.data.token);
    window.localStorage.setItem('userSeq', result.data.userSeq);
    window.localStorage.setItem('name', result.data.name);
    navigate('/');
    return result;
  };

  useEffect(() => {
    const result = apiResult();
  }, []);

  return (
    <div className={styles.body}>
      <div
        className="sweet-loading"
        style={{ position: 'absolute', top: '35%', left: '35%', backgroundColor: 'black' }}
      >
        <PacmanLoader size={200} color={color} />
      </div>
    </div>
  );
}

export default OAuth2RedirectHandler;
