import React, { useEffect, useRef, useState } from 'react';
import style from './FindInit.module.scss';



type MyProps = {
    open: boolean;
    imDetect : boolean;
    nick : string;
};

function FindInit({ open, imDetect, nick }: MyProps) {
  
  const [time, setTime] = useState<number>(10);
  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(()=>{
    let countDown = setInterval(()=>{
      if(timeRef.current === 0){
        clearInterval(countDown);
      }
      else{
        setTime(timeRef.current-1);
      }
    }, 1000);
    return () => {
      clearInterval(countDown);
    }
  },[])


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
              {imDetect ? (
                <div style={{
                  width : "100%",
                  height : "100%",
                  fontSize : "1.5rem",
                  display : "flex",
                  justifyContent : "center",
                  alignItems : "center",
                  flexDirection : "column",
                }}>
                  <div>범인을 찾아라!👮‍♀️</div>
                  <ol>
                    <li>정답을 맞추는 사람을 제외한 나머지 <br></br>사람은 10초간 자기소개 시간을 갖습니다</li>
                    <li>나머지 사람들은 캠이 모두 꺼진 상태이며, 목소리는 변조된 상태입니다</li>
                    <li>모든 사람의 소개가 종료되면 1분간 자유 토론을 진행합니다</li>
                    <li>정답을 맞추는 사람은 자유토론이 종료된 후 지정된 사람의 캠을 유추해서 클릭하세요!</li>
                  </ol>
                  <div>당신은 {nick}님을 찾아야 합니다!</div>
                  <div style={{
                    marginTop : 25
                  }}>{timeRef.current}후 시작됩니다!</div>
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
                  <div>범인을 찾아라!👮‍♀️</div>
                  <ol>
                    <li>정답을 맞추는 사람을 제외한 나머지 <br></br>사람은 10초간 자기소개 시간을 갖습니다</li>
                    <li>나머지 사람들은 캠이 모두 꺼진 상태이며, 목소리는 변조된 상태입니다</li>
                    <li>모든 사람의 소개가 종료되면 1분간 자유 토론을 진행합니다</li>
                    <li>정답을 맞추는 사람은 자유토론이 종료된 후 지정된 사람의 캠을 유추해서 클릭하세요!</li>
                  </ol>
                  <div>당신은 범인 일까요? 아닐까요?</div>
                  <div style={{
                    marginTop : 25
                  }}>{timeRef.current}후 시작됩니다!</div>
                </div>
              )}

            </div>
        </section>
      ) : null}
    </div>
  );
}

export default FindInit;
