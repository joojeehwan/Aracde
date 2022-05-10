import React, { useEffect, useState } from 'react';
import style from './AnsInfo.module.scss';
import Char from '../../../assets/character.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


type MyProps = {
    open: boolean;
    onClose: (e: any) => void;
    nick : string;
    ans : string;
    input : string;
    ansYn : boolean;
};

function AnsInfo({ open, onClose, nick, ans, input,ansYn }: MyProps) {
  
  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div
      className={open ? `${style.openModal} ${style.modal}` : style.modal}
      onClick={onClose}
      onKeyDown={handleStopEvent}
      role="button"
      tabIndex={0}
    >
      {open ? (
        <section
          className={style.modalForm}
          onClick={handleStopEvent}
          onKeyDown={handleStopEvent}
          role="button"
          tabIndex={0}
        >
          <main>
            <div className={style.configForm}>
              {ansYn ? (
              <div>
                <div>{nick}님이 정답을 맞추셨습니다!</div>
                <div style={{textAlign : "center"}}>정답 : {ans}</div>
              </div>) : (
                  <div>
                  <div>{nick}님 틀렸습니다!</div>
                  <div style={{textAlign : "center"}}>정답 : {ans}</div>
                  <div style={{textAlign : "center"}}>입력 : {input}</div>
                </div>
              )}
            </div>
            <div className={style.btnbox}>
              <button className={style.confirm} onClick={onClose}>
                확인
              </button>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
}

export default AnsInfo;
