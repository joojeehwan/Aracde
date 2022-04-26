import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import 'aos/dist/aos.css';
import Modal from 'react-modal';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
Modal.setAppElement('#root');
