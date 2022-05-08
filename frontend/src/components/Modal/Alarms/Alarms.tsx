import React, { useState } from 'react';
import ReactModal from 'react-modal';

//styles
import style from '../styles/Alarms.module.scss';
import '../styles/styles.css';
import Char from '../../../assets/character.png';
//png
import pos from '../../../assets/Modal/positive.png';
import neg from '../../../assets/Modal/negative.png';

const dummydata = [
  { key: '1', message: '박현우바보님이 친구 요청을 보냈습니다.' },
  { key: '2', message: '박현우님이 방에 초대하셨습니다.' },
  { key: '3', message: '박현우님이 방에 초대하셨습니다.' },
  { key: '4', message: '박현우님이 방에 초대하셨습니다.' },
  { key: '5', message: '박현우님이 방에 초대하셨습니다.' },
  { key: '6', message: '박현우님이 방에 초대하셨습니다.' },
  { key: '7', message: '박현우님이 방에 초대하셨습니다.' },
  { key: '8', message: '박현우님이 방에 초대하셨습니다.' },
];


function Alarms({ open, onClose, client }: any) {
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
          <header>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
                marginTop: 10,
              }}
            >
              <img
                src={Char}
                style={{
                  width: 46,
                  height: 46,
                }}
              />
              <p className={style.title}>알림</p>
            </div>
          </header>
          <main>
            <div className={style.configForm}>
              {dummydata.map((value, i) => {
                const idx = i;
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                    key={idx}
                  >
                    <div
                      style={{
                        textAlign: 'left',
                        width: 340,
                        marginRight: 10,
                      }}
                    >
                      {value.message}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img style={{ marginRight: '10px' }} src={pos} alt="긍정" />
                      <img src={neg} alt="부정" />
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
}

export default Alarms;
