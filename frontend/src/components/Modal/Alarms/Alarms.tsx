import React, { useState, useCallback, useEffect } from 'react';
import ReactModal from 'react-modal';
import AlarmApi from "../../../common/api/AlarmApi"
import UserApi from "../../../common/api/UserApi"
import { infoStore } from "../../../components/Store/info"
import { useNavigate } from 'react-router-dom';
//styles
import style from '../styles/Alarms.module.scss';
import '../styles/styles.css';
import Char from '../../../assets/character.png';
//png
import pos from '../../../assets/Modal/positive.png';
import neg from '../../../assets/Modal/negative.png';

function Alarms({ open, onClose, client }: any) {

  const { getAlarmList } = AlarmApi;
  const navigate = useNavigate()
  const { setInviteCode } = infoStore()
  const [alramsList, setAlarmsList] = useState<any>([]);
  const [flag, setFlag] = useState(false)
  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const getAndgetAlarmList = async () => {
    const result = await getAlarmList()
    if (result.status === 200) {
      setAlarmsList([...result.data])
    }
    if (flag === true) {
      setFlag(false)
    }
  }

  useEffect(() => {
    getAndgetAlarmList()
  }, [flag])

  const { deleteAlarm } = AlarmApi
  const { patchAcceptFriendRequest, deleteFriend } = UserApi

  // 정리 2번 요청 보낼 줄도 알아야 해! 그게 바로 남자 & 굳이 컴포넌트로 나눌 필요가 있나?!
  // 그냥 value에 있는 type으로 나눠서 하면 되지! 
  const onClickDeleteAlarm = async (notiSeq: any, userSeq: any, type: any) => {
    setFlag(true)
    if (type === "Friend") {
      await deleteAlarm(notiSeq)
      await deleteFriend(userSeq)
    } else {
      await deleteAlarm(notiSeq)
    }
  }

  const onClickAcceptRequest = async (notiSeq: any, userSeq: any, type: any, inviteCode: any) => {
    setFlag(true)
    if (type === "Friend") {
      await deleteAlarm(notiSeq)
      await patchAcceptFriendRequest(userSeq)
    } else {
      setInviteCode(inviteCode)
      await deleteAlarm(notiSeq)
      navigate("/entrance")
    }
  }

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
              {alramsList?.map((value: any) => {
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
                      <img style={{ marginRight: '10px' }} src={pos} alt="긍정" onClick={() => { onClickAcceptRequest(value.notiSeq, value.userSeq, value.type, value.inviteCode) }} />
                      <img src={neg} alt="부정" onClick={() => { onClickDeleteAlarm(value.notiSeq, value.userSeq, value.type) }} />
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
