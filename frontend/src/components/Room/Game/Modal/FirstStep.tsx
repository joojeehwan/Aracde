import React, { useEffect, useRef, useState } from 'react';
import style from './FirstStep.module.scss';



type MyProps = {
    open: boolean;
    now : boolean;
};

function FirstStep({ open, now }: MyProps) {
  
  

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
              {now ? (
                <div style={{
                  width : "100%",
                  height : "100%",
                  fontSize : "1.5rem",
                  display : "flex",
                  justifyContent : "center",
                  alignItems : "center",
                  flexDirection : "column",
                }}>
                  <div>당신 차례 입니다.</div>
                  <div>10초간 자기소개 시작!!🤩</div>
                  
                </div>
              )
              : (
                <div style={{
                  width : "100%",
                  height : "100%",
                  fontSize : "1.5rem",
                  display : "flex",
                  justifyContent : "center",
                  alignItems : "center",
                  flexDirection : "column",
                }}>
                  <div>차례를 넘기는 중...😴</div>
                </div>
              )}

            </div>
        </section>
      ) : null}
    </div>
  );
}

export default FirstStep;
