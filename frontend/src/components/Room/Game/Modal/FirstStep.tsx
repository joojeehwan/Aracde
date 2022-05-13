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
                  <div>간결하게 소개해주세요</div>
                  
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
                  <div>발언을 준비중 입니다.</div>
                </div>
              )}

            </div>
        </section>
      ) : null}
    </div>
  );
}

export default FirstStep;
