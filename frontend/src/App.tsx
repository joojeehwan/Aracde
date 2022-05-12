import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import loadable from '@loadable/component';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import OnlineApi from '../src/common/api/OnlineApi';

const Main = loadable(() => import('./components/Main/Main'));
const Login = loadable(() => import('./components/Login/mainLogin'));
const KakaoRedirectHandler = loadable(() => import('./components/Login/kakao/OAuth2RedirectHandler'));
const NaverRedirectHandler = loadable(() => import('./components/Login/naver/OAuth2RedirectHandler'));
const GoogleRedirectHandler = loadable(() => import('./components/Login/google/OAuth2RedirectHandler'));
const MyRoom = loadable(() => import('./components/MyRoom/MyRoom'));
const EntranceRoom = loadable(() => import('./components/Room/EntranceRoom'));
const Room = loadable(() => import('./components/Room/Room'));

function App() {

  const { setOffline } = OnlineApi;
  const offline = async () => {
    await setOffline()
    // 새로고침이나 창을 닫을 때 실행

  }
  useEffect(() => {
    window.addEventListener("unload", offline)
    return () => {
      window.removeEventListener("unload", offline);
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myroom" element={<MyRoom />} />
          <Route path="/entrance" element={<EntranceRoom />} />
          <Route path="/oauth/callback/kakao" element={<KakaoRedirectHandler />} />
          <Route path="/oauth/callback/naver" element={<NaverRedirectHandler />} />
          <Route path="/oauth/callback/google" element={<GoogleRedirectHandler />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1500} style={{ display: 'inline' }} theme="colored" />
    </>
  );
}

export default App;

