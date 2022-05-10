import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style/Main.module.scss';
import RoomCreate from './Modal/RoomCreate';
import Content from './Content';
import Arrow from '../../assets/next.png';
import { ReactComponent as Users } from '../../assets/users.svg';
import { ReactComponent as Bell } from '../../assets/bell-ring.svg';
import { ReactComponent as Chatt } from '../../assets/Modal/chat.svg';
import { ReactComponent as BellRed } from '../../assets/Modal/bellLight.svg';
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
  const [isBell, setIsBell] = useState(false)
  //swr & api
  const { fetchWithToken } = ChatAPI;
  const { setOnlie, setOffline } = OnlineApi;
  const { postReadAlarm, getAlarmList } = AlarmApi;
  const { data: chattingList } = useSWR(process.env.REACT_APP_API_ROOT + '/chat', (url) =>
    fetchWithToken(url, getToken() as unknown as string),
  );
  // const { data: chattingList } = useSWR(process.env.REACT_APP_API_ROOT + '/chat', (url) =>
  //   fetchWithToken(url, getToken() as unknown as string),
  // );

  const client = useRef<any>({});

  const handleOpenAlarms = useCallback(async () => {
    // 무조건 무조건이야 알람 흰색 변화
    setIsBell(false)
    //알람 모달을 킨다.
    setAlarmsIsOpen(true);
    // 모든 알람을 읽었다.
    postReadAlarm();

    // 알람 이모티콘 누름과 동시에 알람 리스트 가져옴(이전에 알람 기록들)

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
    // 여기서 로그아웃 api 추가
    disconnect();
    setIsLogin(false);
    deleteToken();
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

  //정리
  const getAndgetAlarmList = async () => {
    const result = await getAlarmList()
    console.log(result.data)
    const checkAlarm: any[] = result.data
    let flaginUnreads: boolean = checkAlarm.some(it => it.confirm === false)

    if (flaginUnreads === true) {
      console.log("빨간불 켜짐")
      setIsBell(true)
    } else {
      console.log("빨간불 꺼짐")
      setIsBell(false)
    }

  }

  const connect = () => {

    const token = getToken();

    setOnlie();
    client.current = new StompJs.Client({
      brokerURL: 'ws://localhost:8080/ws-stomp', // 웹소켓 서버로 직접 접속
      debug: function (str) {
        console.log(str);
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
      // onDisconnect: () => {
      //   console.log("나간다")
      //   client.current.deactivate();
      // }
    });
    client.current.activate();
  };
  const disconnect = async () => {
    // 여기다가
    console.log("이거 맞아?!")
    await setOffline();
    client.current.deactivate();
  };

  if (typeof WebSocket !== 'function') {
    // For SockJS you need to set a factory that creates a new SockJS instance
    // to be used for each (re)connect
    client.current.webSocketFactory = function () {
      // Note that the URL is different from the WebSocket URL
      return new SockJS('http://localhost:8080/ws-stomp');
    };
  }

  const subscribe = () => {
    client.current.subscribe('/sub/' + window.localStorage.getItem('userSeq'), ({ body }: any) => {
      // 여기는 무조건 알림창 빨간색 처리 해야함.
      // 데이터 받는것도 아니고 그냥 빨간색 처리 함! 
      console.log("빨간색")
      setIsBell(true)

    });
  };

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      connect();
      setIsLogin(true);
      getAndgetAlarmList()

      // 렌더링 됐을때 맨 처음 실행. 
      // 단순히 내가 확인하지 않은 알림이 있는지 없는지만 검사.
    }
    return () => {
      disconnect();
    };
  }, []);

  return (
    <>
      <div ref={divRef} className={styles.scroll}>
        <div className={styles.nav}>
          {isLogin ? (
            <>
              <button onClick={handleClickLogout}>LOGOUT</button>
              <button onClick={handleClickMyPage}>MYPAGE</button>
              {isBell === false ?
                (
                  <Bell
                    className={styles.button}
                    onClick={handleOpenAlarms}
                    style={{
                      width: 30,
                      height: 28,
                      float: 'right',
                      marginTop: '2%',
                      marginRight: '2%',
                      position: "relative",
                    }}
                    filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
                  />) :
                (<Bell
                  className={styles.button}
                  onClick={handleOpenAlarms}
                  style={{
                    width: 28,
                    height: 28,
                    float: 'right',
                    marginTop: '2%',
                    marginRight: '2%',
                    position: "relative",
                  }}
                  filter="invert(11%) sepia(100%) saturate(6216%) hue-rotate(280deg) brightness(94%) contrast(116%)"
                />)
              }
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
          <Alarms open={alarmsIsOpen} onClose={handleCloseAlarms} client={client} />
        ) : null}
        {friendsIsOpen ? <Friends open={friendsIsOpen} onClose={handleCloseFriends} /> : null}
        {test ? <Invite open={test} onClose={handleCloseTest} /> : null}
        {chattingIsOpen ? (
          <Chatting open={chattingIsOpen} onClose={handleCloseChatting} client={client} chattingList={chattingList} />
        ) : null}
      </div>
    </>
  );
}

export default Main;
