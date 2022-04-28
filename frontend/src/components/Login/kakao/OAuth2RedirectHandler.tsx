import React, { useDebugValue, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../../common/api/jWT-Token';
import LoginApi from '../../../common/api/LoginApi';

function OAuth2RedirectHandler() {
  const code = new URL(window.location.href).searchParams.get('code');

  const navigate = useNavigate();

  const { getKakaoLoginResult } = LoginApi;

  // api 통신
  //백으로 code 넘기고 토큰 저장하고, api 통신 연결하고 로그인 이후의 화면으로 보내면 된다. ex, main
  const apiResult = async () => {
    console.log("??????? 왜??");
    const result = await getKakaoLoginResult(code as string);

    saveToken(result.data.token);
    navigate('/');
    return result;
  };
  useEffect(() => {
    const result = apiResult();
  }, []);
  return <>{code}</>;
}

export default OAuth2RedirectHandler;
