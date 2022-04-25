import React, { useState } from 'react';
import style from '../style/Invite.module.scss';
import Char from '../../../../assets/character.png';
import { toast } from 'react-toastify';

type MyProps = {
  open: boolean;
  onClose: (e: any) => void;
};

function RoomCreate({ open, onClose }: MyProps) {
  const [nick, setNick] = useState<string>('');
  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };
  const handleSetNick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNick(e.currentTarget.value);
  };
  const handleCreateRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    if (nick.length > 0) {
      // api 통신 들어가는 부분
      // 방 코드 받아와서 session 만들어 줘야 함
      // room 컴포넌트에다 내 닉넴, 방 코드 보내줘야함 navigate?
      console.log(nick);
    } else {
      toast.error(<div style={{ width: 'inherit', fontSize: '14px' }}>닉네임을 입력해주세요.</div>, {
        position: toast.POSITION.TOP_CENTER,
        role: 'alert',
      });
    }
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
              <p className={style.title}>방 만들기</p>
            </div>
          </header>
          <main>
            <div className={style.configForm}>
              <label htmlFor="nick">닉네임</label>
              <input className={style.nickname} id="nick" type="text" onChange={handleSetNick}></input>
            </div>
            <div className={style.btnbox}>
              <button className={style.confirm} onClick={handleCreateRoom}>
                방 생성
              </button>
              <button className={style.cancel} onClick={onClose}>
                취소
              </button>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
}

export default RoomCreate;
