import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style/Main.module.scss';
import RoomCreate from './Modal/RoomCreate';
import Content from './Content';
import Arrow from '../../assets/next.png';
import { ReactComponent as Users } from '../../assets/users.svg';
import { ReactComponent as Bell } from '../../assets/bell-ring.svg';
import { ReactComponent as Chatt } from '../../assets/Modal/chat.svg';
import { useNavigate } from 'react-router-dom';
import Alarms from '../Modal/Alarms/Alarms';
import Friends from '../Modal/Friends/Friends';
import Invite from '../Modal/Invite/Invite';
import useSWR from 'swr';
import OnlineApi from '../../common/api/OnlineApi';
import ChatAPI from '../../common/api/ChatAPI';
import AlarmApi from '../../common/api/AlarmApi';

import Chatting from '../Modal/Chatting';
import SockJS from 'sockjs-client/dist/sockjs';
import * as StompJs from '@stomp/stompjs';
import { deleteToken } from '../../common/api/jWT-Token';
import { getToken } from '../../common/api/jWT-Token';
import { WindowSharp } from '@mui/icons-material';

function Main() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  //지환 코드
  const [alarmsIsOpen, setAlarmsIsOpen] = useState<boolean>(false);
  const [friendsIsOpen, setFriendsIsOpen] = useState<boolean>(false);
  const [test, setTest] = useState<boolean>(false);
  const [chattingIsOpen, setChattingIsOpen] = useState<boolean>(false);
  const [alramsList, setAlarmsList] = useState<any[]>([]);
  //swr & api
  const { fetchWithToken } = ChatAPI;
  const { setOnlie, setOffline } = OnlineApi;
  const { postReadAlarm, fetchAlarmWithToken } = AlarmApi;
  const { data: chattingList } = useSWR(process.env.REACT_APP_API_ROOT + '/chat', (url) =>
    fetchWithToken(url, getToken() as unknown as string),
  );
  const { data: AlarmsList } = useSWR(process.env.REACT_APP_API_ROOT + '/noti', (url) =>
    fetchAlarmWithToken(url, getToken() as unknown as string),
  );
  const client = useRef<any>({});

  const handleOpenAlarms = useCallback(async () => {
    setAlarmsIsOpen(true);
    postReadAlarm();
    // 무조건 무조건이야 알람 흰색 변화
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

  const handleOpenTest = useCallback(() => {
    setTest(true);
  }, [test]);

  const handleCloseTest = useCallback(() => {
    setTest(false);
  }, [test]);

  const handleOpenChatting = useCallback(() => {
    setChattingIsOpen(true);
  }, [test]);

  const handleCloseChatting = useCallback(() => {
    setChattingIsOpen(false);
  }, [test]);

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
    navigate('/entrance');
    console.log('눌렸음');
  };

  const handleClickLogout = (e: React.MouseEvent) => {
    deleteToken();
    // 여기서 로그아웃 api 추가
    disconnect();
    setIsLogin(false);
  };
  // 임시 메서드
  const handleClickLogin = (e: React.MouseEvent) => {
    console.log('here');
    // navigate login page here
    navigate(`/login`);
    setIsLogin(true);
  };

  const handleClickMyPage = (e: React.MouseEvent) => {
    // navigate mypage here
    navigate('/myroom')
    console.log('hererererererere');
  };

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

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      setIsLogin(true);
    }
  }, []);

  const connect = () => {
    const token = getToken();
    // await online();
    client.current = new StompJs.Client({
      brokerURL: 'wss://k6a203.p.ssafy.io/ws-stomp', // 웹소켓 서버로 직접 접속
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
        setOnlie();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
      // onDisconnect: () => {
      //   console.log("나간다")
      //   client.current.deactivate();
      // }
    });
    client.current.activate();
  };
  const disconnect = () => {
    // 여기다가
    setOffline();
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

  const subscribe = () => {
    client.current.subscribe('/sub/' + window.localStorage.getItem('userSeq'), ({ body }: any) => {
      // 여기는 무조건 알림창 빨간색 처리 해야함.
      // 알림창 누르면 알림 가져오기 api 호출. => 메인 가면 바로 알림 리스트 가져옴
      console.log(body);
      const data: any = JSON.parse(body);
      alramsList.push(data);
      setAlarmsList([...data]);
    });
  };

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      connect();
    }
    // unmount 될때 실행되는게 맞냐?
    return () => {
      disconnect();
    };
  }, []);
  console.log(alramsList);

  return (
    <>
      <div ref={divRef} className={styles.scroll}>
        <div className={styles.nav}>
          {isLogin ? (
            <>
              <button onClick={handleClickLogout}>LOGOUT</button>
              <button onClick={handleClickMyPage}>MYPAGE</button>
              {/* <button onClick={handleOpenTest}>test</button> */}
              <Bell
                className={styles.button}
                onClick={handleOpenAlarms}
                style={{
                  width: 28,
                  height: 28,
                  float: 'right',
                  marginTop: '2%',
                  marginRight: '2%',
                }}
                filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
              />
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
              <Chatt
                className={styles.button}
                onClick={handleOpenChatting}
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
        {alarmsIsOpen ? (
          <Alarms open={alarmsIsOpen} onClose={handleCloseAlarms} client={client} AlarmsList={AlarmsList} />
        ) : null}
        {friendsIsOpen ? <Friends open={friendsIsOpen} onClose={handleCloseFriends} /> : null}
        {test ? <Invite open={test} onClose={handleCloseTest} /> : null}
        {chattingIsOpen ? (
          <Chatting chattingList={chattingList} open={chattingIsOpen} onClose={handleCloseChatting} client={client} />
        ) : null}
      </div>
    </>
  );
}

export default Main;
