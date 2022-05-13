import React, { useState, useCallback } from 'react';
import ReactModal from 'react-modal';
import AlarmApi from "../../../common/api/AlarmApi"

//styles
import style from '../styles/Alarms.module.scss';
import '../styles/styles.css';
import Char from '../../../assets/character.png';
//png
import pos from '../../../assets/Modal/positive.png';
import neg from '../../../assets/Modal/negative.png';

function Alarms({ open, onClose, client, AlarmsList }: any) {

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const { deleteAlarm } = AlarmApi

  const onClickDeleteAlarm = (notiSeq: any) => async () => {
    console.log("뭐야")
    await deleteAlarm(notiSeq)
  }

  console.log(AlarmsList)
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
              {AlarmsList.map((value: any) => {
                const idx = value.notiSeq;
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
                      {value.type === "Friend" ?
                        value.name + "님이 친구 요청을 보냈습니다. " :
                        value.name + "님이 방에 초대하셨습니다."
                      }

                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img style={{ marginRight: '10px' }} src={pos} alt="긍정" />
                      <img src={neg} alt="부정" onClick={onClickDeleteAlarm(value.notiSeq)} />
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
