import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style/Main.module.scss';
import RoomCreate from './Modal/RoomCreate';
import Content from './Content';
import Arrow from '../../assets/next.png';
import { ReactComponent as Users } from '../../assets/users.svg';
import { ReactComponent as Bell } from '../../assets/bell-ring.svg';
import ChatIcon from '../../assets/chat.png';
import { useNavigate } from 'react-router-dom';
import Alarms from '../Modal/Alarms/Alarms';
import Friends from '../Modal/Friends/Friends';
import OnlineApi from '../../common/api/OnlineApi';
import ChatAPI from '../../common/api/ChatAPI';
import AlarmApi from '../../common/api/AlarmApi';

import Chatting from '../Modal/Chatting';
import SockJS from 'sockjs-client/dist/sockjs';
import * as StompJs from '@stomp/stompjs';
import { deleteToken } from '../../common/api/jWT-Token';
import { getToken } from '../../common/api/jWT-Token';
import { WindowSharp } from '@mui/icons-material';
import alarmSound from '../../mp3/alram.mp3';

import { useStore } from '../../../src/components/Room/store';
import { infoStore } from '../../../src/components/Store/info';

function Main() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  //지환 코드
  const { setClientt, clientt } = useStore();

  const [alarmsIsOpen, setAlarmsIsOpen] = useState<boolean>(false);
  const [friendsIsOpen, setFriendsIsOpen] = useState<boolean>(false);
  const [chattingIsOpen, setChattingIsOpen] = useState<boolean>(false);
  const [isBell, setIsBell] = useState(false)
  //swr & api
  const { setOffline, setOnline } = OnlineApi;
  const { postReadAlarm, getAlarmList } = AlarmApi;



  const { setInviteCode } = infoStore();
  const client = useRef<any>({});
  const handleOpenAlarms = useCallback(async () => {
    // 무조건 무조건이야 알람 흰색 변화
    setIsBell(false);
    setAlarmsIsOpen(true);
    // 모든 알람을 읽었다.
    postReadAlarm();
  }, [alarmsIsOpen]);

  const handleCloseAlarms = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setAlarmsIsOpen(false);
    },
    [alarmsIsOpen],
  );

  const handleOpensFriends = useCallback(() => {
    setFriendsIsOpen(true);
  }, [friendsIsOpen]);

  const handleCloseFriends = useCallback(() => {
    setFriendsIsOpen(false);
  }, [friendsIsOpen]);

  const handleOpenChatting = useCallback(() => {
    setChattingIsOpen(true);
  }, [chattingIsOpen]);

  const handleCloseChatting = useCallback(() => {
    setChattingIsOpen(false);
  }, [chattingIsOpen]);

  const handleOpenCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleCloseCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(false);
  };
  const handleEnterRoom = (e: React.MouseEvent) => {
    // navigate 시켜줘야함 -> 방 입장 설정 페이지
    setInviteCode("")
    navigate('/entrance');
  };

  const handleClickLogout = (e: React.MouseEvent) => {
    // 여기서 로그아웃 api 추가
    disconnect();
    setOffline();
    setIsLogin(false);
    deleteToken();
  };
  // 임시 메서드
  const handleClickLogin = (e: React.MouseEvent) => {
    // navigate login page here
    navigate(`/login`);
    setIsLogin(true);
  };

  const handleClickMyPage = (e: React.MouseEvent) => {
    // navigate mypage here
    navigate('/myroom');
  };

  //바로 위로 스므스하게 올라감
  const handleClickTop = (e: React.MouseEvent) => {
    if (divRef.current !== null) {
      window.scrollBy({ top: divRef.current.getBoundingClientRect().top, behavior: 'smooth' });
    }
  };

  // 모달 창 열리면 옆에 스크롤바 안보임
  useEffect(() => {
    if (friendsIsOpen === true || alarmsIsOpen === true || open === true || chattingIsOpen === true) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [friendsIsOpen, alarmsIsOpen, open, chattingIsOpen]);

  //정리
  const getAndgetAlarmList = async () => {
    // 단순히 내가 확인하지 않은 알림이 있는지 없는지만 검사.
    const result = await getAlarmList();
    const checkAlarm: any[] = result.data;
    // 객체 오브젝트안에 내가 찾고자 하는 값을 구별해내는 js
    let flaginUnreads: boolean = checkAlarm.some((it) => it.confirm === false);

    if (flaginUnreads === true) {
      setIsBell(true);
    } else {
      setIsBell(false);
    }
  };

  const connect = () => {

    // setOnlie();
    client.current = new StompJs.Client({
      brokerURL: 'wss://k6a203.p.ssafy.io/socket', // 웹소켓 서버로 직접 접속
      debug: function (str) {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    client.current.activate();
  };

  const disconnect = async () => {
    await setOffline();
    // clientRef.current.deactivate();
    client.current.deactivate();
  };

  if (typeof WebSocket !== 'function') {
    // For SockJS you need to set a factory that creates a new SockJS instance
    // to be used for each (re)connect
    client.current.webSocketFactory = function () {
      // Note that the URL is different from the WebSocket URL
      return new SockJS('http://k6a203.p.ssafy.io/ws-stomp');
    };
  }

  const subscribe = async () => {
    await setOnline();
    client.current.subscribe('/sub/' + window.localStorage.getItem('userSeq'), ({ body }: any) => {
      // 데이터 받자마자 빨간색 처리
      setIsBell(true);
      bellSound();
    });
  };
  const bellSound = () => {
    let audio = new Audio(alarmSound)
    audio.play()
  }

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      setOnline();
      connect();
      setClientt(client);
      setIsLogin(true);
      getAndgetAlarmList();
    }
    return () => {
      // back에서 없어지나 test
      // disconnect()
      // window.removeEventListener("unload", disconnect);
    };
  }, []);

  //정리! 온/오프라인을 이렇게 해결?!
  const onbeforeunload = (e: any) => {
    e.preventDefault();
    setOffline()
    e.returnValue = '나가실껀가요?';
    console.log("나가기 전에 실행")
    setTimeout(() => {
      setTimeout(() => {
        console.log("취소 누르면 실행")
        setOnline()
      })
    })
  }

  useEffect(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    }
  }, [])

  return (
    <>
      <div ref={divRef} className={styles.scroll}>
        <div className={styles.nav}>
          {isLogin ? (
            <>
              <button onClick={handleClickLogout}>LOGOUT</button>
              <button onClick={handleClickMyPage}>MYPAGE</button>
              {isBell === false ? (
                <Bell
                  className={styles.button}
                  onClick={handleOpenAlarms}
                  style={{
                    width: 30,
                    height: 28,
                    float: 'right',
                    marginTop: '2%',
                    marginRight: '2%',
                    position: 'relative',
                  }}
                  filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
                />
              ) : (
                <Bell
                  className={isBell ? `${styles.button} ${styles.shake}` : styles.button}
                  onClick={handleOpenAlarms}
                  style={{
                    width: 28,
                    height: 28,
                    float: 'right',
                    marginTop: '2%',
                    marginRight: '2%',
                    position: 'relative',
                  }}
                  filter="invert(11%) sepia(100%) saturate(6216%) hue-rotate(280deg) brightness(94%) contrast(116%)"
                />
              )}
              <Users
                className={styles.button}
                onClick={handleOpensFriends}
                style={{
                  width: 28,
                  height: 28,
                  float: 'right',
                  marginTop: '2%',
                  marginRight: '2%',
                }}
                filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
              />
            </>
          ) : (
            <button onClick={handleClickLogin}>LOGIN</button>
          )}
        </div>
        <div className={styles.glass}>
          <div className={styles.main}>
            <p className={styles.glitch} data-text="Arcade">
              Arcade
            </p>
            <button className={styles.button} onClick={handleOpenCreateRoom}>
              방 만들기
            </button>
            <button className={styles.button} onClick={handleEnterRoom}>
              입장하기
            </button>
            {open ? <RoomCreate open={open} onClose={handleCloseCreateRoom} /> : null}
          </div>
          <div className={styles.contentbox}>
            <Content type={0} />
            <Content type={1} />
            <div className={styles.desc}>
              다같이&nbsp; <p style={{ color: '#FFF800' }}>Arcade</p>의 세계로
              <br />
              <p>빠져볼까요?</p>
            </div>
          </div>
          <div className={styles.dockbar}>
            <div
              className={styles.dock}
              style={{
                width: 'fit-content',
                height: 'fit-content',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button className={styles.btn} onClick={handleClickTop}>
                <img
                  style={{
                    width: 60,
                    height: 60,
                  }}
                  src={Arrow}
                ></img>
              </button>
            </div>
          </div>
        </div>
        {open ? <RoomCreate open={open} onClose={handleCloseCreateRoom} /> : null}
        {alarmsIsOpen ? <Alarms open={alarmsIsOpen} onClose={handleCloseAlarms} client={client} /> : null}
        {friendsIsOpen ? <Friends open={friendsIsOpen} onClose={handleCloseFriends} /> : null}
        {chattingIsOpen ? (
          <Chatting open={chattingIsOpen} onClose={handleCloseChatting} client={client} />
        ) : null}
      </div>
      {
        window.localStorage.getItem("token") ? (
          <button onClick={handleOpenChatting}
            style={{
              margin: "20px",
              position: "fixed",
              right: "0px",
              bottom: "0px",
              backgroundColor: "transparent",
              border: "none"
            }}
          >
            <img
              style={{
                width: 60,
                height: 60,
              }}
              src={ChatIcon}
              alt="chatIcon"
            ></img>
          </button>) : null
      }
    </>
  );
}

export default Main;
