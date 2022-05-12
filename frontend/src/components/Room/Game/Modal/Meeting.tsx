import React, { useEffect, useRef, useState } from 'react';
import style from './Meeting.module.scss';



type MyProps = {
    open: boolean;
};

function Meeting({ open }: MyProps) {
  
  

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
                  <div>지금부터 자유토론 시간입니다!</div>
                  <div>1분간 자유롭게 토론하세요!</div>
                  
                </div>
              

            </div>
        </section>
      ) : null}
    </div>
  );
}

export default Meeting;
