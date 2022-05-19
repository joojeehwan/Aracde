import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from '../style/Chat.module.scss';

import SendIcon from '../../../assets/send.png';

const Chat = (props: any) => {
  const [messageList, setMessageList] = useState<any>([]);
  const [answerList, setAnswerList] = useState<any>([]);
  const [message, setMessage] = useState<any>('');
  const [continueGame, setContinueGame] = useState<any>(false);
  const [checkMode, setCheck] = useState<any>(false);
  const [mode, setMode] = useState<any>('');
  const [idx, setIdx] = useState<any>(0);
  const [currnetInput, setCurrentInput] = useState<any>('');
  const [sub, setSub] = useState<any>([]);
  const chatScroll = useRef<HTMLDivElement>(null);

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };
  const reset = useRef(messageList);
  reset.current = messageList;


  useEffect(() => {
    setSub([...sub, props.sub]);
  }, [props.sub]);
  useEffect(() => {
    
    props.user.getStreamManager().stream.session.on('signal:chat', (event: any) => {
      const data = JSON.parse(event.data);
      let messageListData = messageList;

      messageListData.push({
        connectionId: event.from.connectionId,
        nickname: data.nickname,
        message: data.message,
      });
      setMessageList([...messageListData]);
      scrollToBottom();
    });
  }, []);

  useEffect(() => {}, [messageList]);
  useEffect(() => {
    setMessageList([]);
    setMessage('');
    setContinueGame(false);
    setCheck(true);
    setMode('');
  }, [props.mode]);

  const handlePressKey = (event: any) => {
    if (event.key === 'Enter' && props.mode === 'game4') {
      sendAnswer();
    } else if (event.key === 'Enter' && props.mode != 'game4') {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (props.user && message) {
      let messageData = message.replace(/ +(?= )/g, '');
      if (messageData !== '' && messageData !== ' ') {
        const data = {
          message: messageData,
          nickname: props.user.getNickname(),
          streamId: props.user.getStreamManager().stream.streamId,
        };
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: 'chat',
        });
      }
    }
    setMessage('');
    if (document.getElementById('chatInput') !== null) {
      let value = (document.getElementById('chatInput') as HTMLTextAreaElement).value;
      value = value.replace(/\r\n$/g, '');
      (document.getElementById('chatInput') as HTMLTextAreaElement).value = value;
    }
  };
  const sendAnswer = () => {
    // if (props.user && message) {
    //   let messageData = message.replace(/ +(?= )/g, '');
    //   messageData = messageData.toUpperCase();
    //   if (continueGame) {
    //     if (
    //       messageData === 'Y' ||
    //       messageData === 'O' ||
    //       messageData === '0' ||
    //       messageData === 'OK' ||
    //       messageData === 'YES'
    //     ) {
    //       const data = {
    //         gameStatus: 1,
    //         gameId: 3,
    //         index: 1,
    //       };
    //       props.user.getStreamManager().stream.session.signal({
    //         type: 'game',
    //         data: JSON.stringify(data),
    //       });
    //       setContinueGame(false);
    //     } else if (messageData === 'N' || messageData === 'X' || messageData === 'NO') {
    //       const data = {
    //         gameStatus: 3,
    //         gameId: 3,
    //       };
    //       props.user.getStreamManager().stream.session.signal({
    //         type: 'game',
    //         data: JSON.stringify(data),
    //       });
    //       setContinueGame(false);
    //     } else {
    //       let messageListData = answerList;
    //       messageListData.push({
    //         connectionId: 'SYSTEM',
    //         nickname: 'SYSTEM',
    //         message: '형식에 맞게 다시 입력해주세요 (Y/N)',
    //       });
    //       setMessageList([...messageListData]);
    //       scrollToBottom();
    //     }
    //   } else {
    //     if (messageData !== '' && messageData !== ' ' && !isNaN(messageData * 1)) {
    //       const data = {
    //         gameStatus: 2,
    //         number: messageData * 1,
    //         nickname: props.user.getNickname(),
    //         gameId: 3,
    //         index: idx,
    //         streamId: props.user.getStreamManager().stream.streamId,
    //       };
    //       props.user.getStreamManager().stream.session.signal({
    //         data: JSON.stringify(data),
    //         type: 'game',
    //       });
    //     } else {
    //       let messageListData = answerList;
    //       messageListData.push({
    //         connectionId: 'SYSTEM',
    //         nickname: 'SYSTEM',
    //         message: '숫자만 입력해 주세요!!!',
    //       });
    //       setMessageList([...messageListData]);
    //       scrollToBottom();
    //     }
    //   }
    // }
    setMessage('');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        if (chatScroll.current !== null) {
          chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
        }
      } catch (error) {}
    }, 20);
  };

  const close = () => {
    props.close(undefined);
  };

  return (
    <>
      <div className={props.mode !== 'home' ? `${styles.chatComponent} ${styles.game}` : styles.chatComponent}>
        <div
          className={props.mode !== 'home' ? `${styles['message-wrap']} ${styles.game}` : styles['message-wrap']}
          ref={chatScroll}
        >
          {props.mode === 'game4'
            ? answerList.map((data: any, i: any) => (
                <div
                  key={i}
                  id="remoteUsers"
                  className={
                    data.connectionId !== props.user.getStreamManager().stream.streamId
                      ? styles['message-r']
                      : styles['message-right']
                  }
                >
                  {data.nickname === 'SYSTEM' ? (
                    <div className={styles['msg-detail']}>
                      <div className={styles['msg-system']}>
                        <p className={styles.system}>{data.nickname}</p>
                      </div>
                      <div className={styles['msg-sysmessage']}>
                        <p className={styles.text}>{data.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles['msg-detail']}>
                      <div className={styles['msg-info']}>
                        <p className={styles.nickname}>{data.nickname}</p>
                      </div>
                      <div className={styles['msg-content']}>
                        <p className={styles.text}>{data.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            : messageList.map((data: any, i: any) => (
                <div
                  key={i}
                  id="remoteUsers"
                  //   className={`${styles.message} `}
                  className={
                    data.connectionId !== props.user.getConnectionId()
                      ? styles['message-left']
                      : styles['message-right']
                  }
                >
                  {data.nickname === 'SYSTEM' ? (
                    <div className={styles['msg-detail']}>
                      <div className={styles['msg-system']}>
                        <p className={styles.system}>{data.nickname}</p>
                      </div>
                      <div className={styles['msg-sysmessage']}>
                        <p className={styles.text}>{data.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles['msg-detail']}>
                      <div className={styles['msg-info']}>
                        <p className={styles.nickname}>{data.nickname}</p>
                      </div>
                      <div className={styles['msg-content']}>
                        <p className={styles.text}>{data.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </div>

        {props.mode === 'home' ? (
          <div className={styles.messageInput}>
            <textarea
              className={styles.defaultinput}
              placeholder="메세지를 입력하세요"
              id="chatInput"
              value={message}
              onChange={handleChange}
              onKeyPress={handlePressKey}
              autoComplete="off"
              style={{ fontSize: '17px' }}
            />
            <div className={styles.sendIcon} onClick={sendMessage}>
              <img className={styles.sendButton} src={SendIcon} alt="sendIcon"></img>
            </div>
          </div>
        ) : (
          <div className={`${styles.messageInput} ${styles.game}`}>
            <textarea
              className={`${styles.defaultinput}`}
              placeholder="메세지를 입력하세요"
              id="chatInput"
              value={message}
              onChange={handleChange}
              onKeyPress={handlePressKey}
              autoComplete="off"
            />
            <div className={styles.sendIcon} onClick={sendMessage}>
              <img className={styles.sendButton} src={SendIcon} alt="sendIcon"></img>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
