import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../../common/api/jWT-Token';
import UserApi from '../../../common/api/UserApi';
import { getToken } from '../../../common/api/jWT-Token';
import * as StompJs from '@stomp/stompjs';
import { useState } from 'react';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function OAuth2RedirectHandler() {
  //이렇게 가져오는 걸 햇는데!
  // 콘솔에 안찍혀서!
  const code = new URL(window.location.href).searchParams.get('code');
  const navigate = useNavigate();
  const { getGoogleLoginResult } = UserApi;
  const client = useRef<any>({});

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#ffffff');

  // api 통신
  //백으로 code 넘기고 토큰 저장하고, api 통신 연결하고 로그인 이후의 화면으로 보내면 된다. ex, main
  const apiResult = async () => {
    const result = await getGoogleLoginResult(code as string);

    //넘기고 나는 토큰 저장,, 끝! 헤헷,,,
    // 프론트는 딱히.. 어렵지가 않앙,,항항,,,
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
    <div className="sweet-loading">
      <button onClick={() => setLoading(!loading)}>Toggle Loader</button>
      <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" />

      <ClipLoader color={color} loading={loading} css={override} size={150} />
    </div>
  );
}

export default OAuth2RedirectHandler;
