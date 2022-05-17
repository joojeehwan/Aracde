import React, { useEffect, useState } from 'react';
import style from './RoomCreate.module.scss';
import Char from '../../../assets/character.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {infoStore} from '../../Store/info';
import {useStore} from '../../Room/store';
import RoomApi from '../../../common/api/Room';

type MyProps = {
  open: boolean;
  onClose: (e: any) => void;
};

function RoomCreate({ open, onClose }: MyProps) {
  const [nick, setNickname] = useState<string>('');
  const navigate = useNavigate();

  const {setNick, setInviteCode} = infoStore();
  const {setMyMic, setMyVideo} = useStore();
  const {createRoom} = RoomApi;

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };
  const handleSetNick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNickname(e.currentTarget.value);
  };
  const handleCreateRoom = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (nick.length > 0) {
      const result = await createRoom();
      // 
      if(result.status === 200){
        setNick(nick);
        setInviteCode(result.data.inviteCode);
        setMyMic(true);
        setMyVideo(true);
        window.localStorage.setItem("nickname", nick);
        window.localStorage.setItem("invitecode", result.data.inviteCode);
        navigate('/room');
      }

      // 
      // console.log(nick);
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
