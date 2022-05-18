import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import styles from './style/Room.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from './store';
import { infoStore } from '../Store/info';
import RoomContents from './RoomContents';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client/dist/sockjs';
import * as StompJs from '@stomp/stompjs';
//chat
import ChatIcon from '../../assets/chat.png';
import Chatting from '../Modal/Chatting';
import useSWR from 'swr';
import { getToken } from '../../../src/common/api/jWT-Token';
import ChatAPI from '../../common/api/ChatAPI';
import RoomApi from '../../common/api/Room';
import OnlineApi from '../../common/api/OnlineApi';

const Room = () => {
  const { sessionId, setSessionId, mode } = useStore();
  const client = useRef<any>({});

  const myName = window.localStorage.getItem('nickname');

  const [contentTitle, setContentTitle] = useState('');

  const roomseq = window.localStorage.getItem('invitecode');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setOffline, setOnline } = OnlineApi;
  //chat
  const [chattingIsOpen, setChattingIsOpen] = useState<boolean>(false);
  const { fetchWithToken } = ChatAPI;

  const { exitRoom } = RoomApi;

  const handleExitRoom = async () => {
    if (mode !== 'home') {
      toast.error(<div style={{ width: 'inherit', fontSize: '14px' }}>게임중에는 방에서 나갈 수 없습니다.</div>, {
        position: toast.POSITION.TOP_CENTER,
        role: 'alert',
      });
    } else {
      //const result = await exitRoom(roomseq);
      //if(result?.status === 200){
      navigate('/');
      //toast.success(<div style={{ width: 'inherit', fontSize: '14px' }}>성공적으로 퇴장했습니다!</div>, {
      //position: toast.POSITION.TOP_CENTER,
      //role: 'alert',
      //});
      //}
    }
  };

  const handleOpenChatting = useCallback(() => {
    setChattingIsOpen(true);
  }, [chattingIsOpen]);

  const handleCloseChatting = useCallback(() => {
    setChattingIsOpen(false);
  }, [chattingIsOpen]);

  useEffect(() => {
    console.log('???왜 사라짐??');
    if (myName === null) {
      navigate('/');
    }
    if (roomseq === null) {
      navigate('/');
    }
    setOnline();
    connect();
  }, []);

  const connect = () => {
    // setOnlie();
    client.current = new StompJs.Client({
      brokerURL: 'wss://k6a203.p.ssafy.io/socket', // 웹소켓 서버로 직접 접속
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
    });
  };

  const onbeforeunload = (e: any) => {
    e.preventDefault();
    setOffline();
    e.returnValue = '나가실껀가요?';
    console.log('나가기 전에 실행');
    setTimeout(() => {
      setTimeout(() => {
        console.log('취소 누르면 실행');
        setOnline();
      });
    });
  };

  useEffect(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);


  return (
    <div className={styles.container}>
      {/* {loading ? <LoadingSpinner></LoadingSpinner> : null} */}
      <div className={styles.nav}>
        {window.localStorage.getItem('token') ? (
          <div>
            <button
              onClick={handleOpenChatting}
              className={styles.link}
              style={{
                margin: '20px',
                position: 'fixed',
                right: '0px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
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
            </button>
          </div>
        ) : null}
        <button className={styles.link} onClick={handleExitRoom}>
          EXIT
        </button>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.contents}>
          <div className={styles.title}>
            <h1>{contentTitle}</h1>
          </div>
          <div className={styles['main-contents']}>
            <RoomContents sessionName={roomseq} userName={myName} />
          </div>
        </div>
      </div>
      {chattingIsOpen ? <Chatting open={chattingIsOpen} onClose={handleCloseChatting} client={client} /> : null}
    </div>
  );
};

export default Room;
