import React from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../../common/api/jWT-Token';
import LoginApi from '../../../common/api/LoginApi';

const OAuth2RedirectHandler = () => {
  //이렇게 가져오는 걸 햇는데!
  // 콘솔에 안찍혀서!
  const code = new URL(window.location.href).searchParams.get('code');
  const navigate = useNavigate();
  const { getGoogleLoginResult } = LoginApi;

  // api 통신
  //백으로 code 넘기고 토큰 저장하고, api 통신 연결하고 로그인 이후의 화면으로 보내면 된다. ex, main
  const apiResult = async () => {
    const result = await getGoogleLoginResult(code as string);

    //넘기고 나는 토큰 저장,, 끝! 헤헷,,,
    // 프론트는 딱히.. 어렵지가 않앙,,항항,,,
    saveToken(result.data.token);
    navigate('/main');
    return result;
  };
  return <>{code}</>;
};

export default OAuth2RedirectHandler;
