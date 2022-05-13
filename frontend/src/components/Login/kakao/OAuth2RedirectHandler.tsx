import React, { useDebugValue, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../../common/api/jWT-Token';
import UserApi from '../../../common/api/UserApi';

import { useState } from 'react';
import { css } from '@emotion/react';
import PacmanLoader from 'react-spinners/PacmanLoader';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function OAuth2RedirectHandler() {
  const code = new URL(window.location.href).searchParams.get('code');

  const navigate = useNavigate();

  const { getKakaoLoginResult } = UserApi;

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#ffffff');

  // api 통신
  //백으로 code 넘기고 토큰 저장하고, api 통신 연결하고 로그인 이후의 화면으로 보내면 된다. ex, main
  const apiResult = async () => {
    const result = await getKakaoLoginResult(code as string);

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
    <>
      <div>연어</div>
      <div className="sweet-loading">
        <PacmanLoader color={color} loading={loading} css={override} size={150} />
      </div>
    </>
  );
}

export default OAuth2RedirectHandler;
