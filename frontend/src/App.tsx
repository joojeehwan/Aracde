import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import loadable from '@loadable/component';
import { ToastContainer } from 'react-toastify';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

const Main = loadable(() => import('./components/Main/Main'));
const MyRoom = loadable(() => import('./components/MyRoom/MyRoom'));
function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/myroom' element={<MyRoom />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1500} style={{ width: '100%', display: 'inline' }} theme="colored" />
    </>
  );
}

export default App;
