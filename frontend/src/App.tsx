import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import loadable from '@loadable/component';
import { ToastContainer } from 'react-toastify';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

const Main = loadable(() => import('./components/Main/Main'));

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1500} style={{ display: 'inline' }} theme="colored" />
    </>
  );
}

export default App;
