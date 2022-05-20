import React, { useEffect, useState } from 'react';
import style from './Wait.module.scss';
import Char from '../../../assets/character.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


type MyProps = {
    open: boolean;
};

function Wait({ open }: MyProps) {
  
  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div
      className={open ? `${style.openModal} ${style.modal}` : style.modal}
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
              <div style={{fontSize : "1.5rem", marginTop : 0}}>게임 선택 진행중..⏳</div>
              <div>다른 유저가 게임을 선택하고 있습니다.</div>
              <div>기다려 주세요</div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
}

export default Wait;
