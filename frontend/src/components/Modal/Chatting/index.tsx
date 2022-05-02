import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
//styles
import { StickyHeader, Section } from '../styles/ChattingStyles';
import styles from '../styles/Chatting.module.scss';
//mui
import Avatar from '@mui/material/Avatar';
//components
import ChatEach from './ChattingComponents/ChatEach';
import ChatInput from './ChattingComponents/ChatInput';
import ChattingLists from './ChattingComponents/ChattingLists';
import useInput from '../../../common/hooks/useInput';

//stomp & sockjs
import SockJS from 'sockjs-client/dist/sockjs';
import * as StompJs from '@stomp/stompjs';
import { Stomp } from '@stomp/stompjs';

interface MyProps {
  open: boolean;
  onClose: (e: any) => void;
}

const dummydata = [
  { idx: '1', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '2', name: '배하은', content: '오케잉asfasdfasfsfasffafasdf', time: '오후 5:46' },
  { idx: '3', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '4', name: '배하은', content: '오케잉', time: '오후 5:46' },
  { idx: '5', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '6', name: '배하은', content: '오케잉', time: '오후 5:46' },
  { idx: '7', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '8', name: '배하은', content: '오케잉', time: '오후 5:46' },
  { idx: '9', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '10', name: '배하은', content: '오케잉', time: '오후 5:46' },
  { idx: '11', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '12', name: '배하은', content: '오케잉', time: '오후 5:46' },
  { idx: '13', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  { idx: '14', name: '배하은', content: '오케잉', time: '오후 5:46' },
];

function Chatting({ open, onClose }: MyProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [tab, setTab] = useState('CHATROOM');
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const client = useRef<any>({});

  useEffect(() => {
    connect();
  }, []);

  // const connect = () => {
  //   const sock = new SockJS('http://k6a203.p.ssafy.io:8080/ws-stomp');
  //   client.current = Stomp.over(sock);
  //   console.log(client);
  // };

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://k6a203.p.ssafy.io:8080/ws-stomp', // 웹소켓 서버로 직접 접속
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    console.log(client.current);
    client.current.activate();
  };

  if (typeof WebSocket !== 'function') {
    // For SockJS you need to set a factory that creates a new SockJS instance
    // to be used for each (re)connect
    client.current.webSocketFactory = function () {
      // Note that the URL is different from the WebSocket URL
      return new SockJS('http://k6a203.p.ssafy.io:8080/ws-stomp');
    };
  }

  const publish = () => {
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      destination: '/sub/chat/1',
      body: 'hello world',
      skipContentLengthHeader: true,
    });

    // setMessage('');
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const date = '2022-04-30';
  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      onClick={onClose}
      onKeyDown={handleStopEvent}
      role="button"
      tabIndex={0}
    >
      {open ? (
        <section
          className={styles.modalForm}
          onClick={handleStopEvent}
          onKeyDown={handleStopEvent}
          role="button"
          tabIndex={0}
        >
          <div className={styles.chatBox}>
            <div
              style={{
                display: 'flex',
                padding: '20px',
                marginLeft: '20px',
                marginTop: '-10px',
                flexDirection: 'column',
              }}
              className={styles.chatList}
            >
              <ChattingLists />
            </div>
            {tab === 'CHATROOM' && (
              <div className={styles.chatContent}>
                <header className={styles.chatHeader}>
                  <Avatar alt="사진" sx={{ width: 56, height: 56 }} />
                  <div style={{ marginTop: '20px', marginLeft: '20px' }}>배하은</div>
                </header>
                <div className={styles.chatMessages}>
                  <Scrollbars autoHide>
                    <Section>
                      <StickyHeader>
                        <button>{date} </button>
                      </StickyHeader>
                      {dummydata.map((value) => {
                        return <ChatEach name={value.name} content={value.content} time={value.time} key={value.idx} />;
                      })}
                    </Section>
                  </Scrollbars>
                </div>
                <ChatInput publish={publish} />
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Chatting;
