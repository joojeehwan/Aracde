import React, { useEffect, useRef, useState } from 'react';
import style from './Last.module.scss';



type MyProps = {
    open: boolean;
    chance : number | undefined;
    nick : string;
};

function Last({ open, chance, nick}: MyProps) {
  
  

  return (
    <div
      className={open ? `${style.openModal} ${style.modal}` : style.modal}
      role="button"
      tabIndex={0}
    >
      {open ? (
        <section
          className={style.modalForm}
          role="button"
          tabIndex={0}
        >
            <div className={style.configForm}>
              
                <div style={{
                  width : "100%",
                  height : "100%",
                  fontSize : "1.5rem",
                  display : "flex",
                  justifyContent : "center",
                  alignItems : "center",
                  flexDirection : "column",
                }}>
                  <div>{nick}님이 추리하는 시간입니다!</div>
                  <div>가장 유사하다 생각되는 사람의</div>
                  <div>캠을 클릭해서 정답을 제출하세요!</div>
                  <div>한번의 기회당 주어진 시간은 10초 입니다</div>
                  <div>주어진 기회는 총 {chance}번 입니다!</div>
                  
                </div>
              

            </div>
        </section>
      ) : null}
    </div>
  );
}

export default Last;
