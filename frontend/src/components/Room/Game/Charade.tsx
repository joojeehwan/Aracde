import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../style/Charade.module.scss';
import StreamComponent from '../stream/StreamComponent';
import AlarmIcon from '@mui/icons-material/Alarm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Charade = (props: any) => {
  const [answer, setAnswer] = useState<any>('');
  const [streamId, setStreamId] = useState<any>('');
  const [index, setIndex] = useState<any>(1);

  const [time, setTime] = useState<any>(60);
  const [timeFlag, setTimeFlag] = useState<any>(false);
  const [message, setMessage] = useState<any>('');

  const [userData, setUserData] = useState<any>([{ streamId: '', nickname: '', score: 0 }]);
  const [presenter, setPresenter] = useState<any>('');

  const [idx, setIdx] = useState<any>(0);
  const [answerStreamId, setAnswerStreamId] = useState<any>('');

  const [gameFlag, setGameFlag] = useState<any>(false);

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  const setScore = () => {
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].streamId === answerStreamId) {
        userData[i].score++;
        setAnswerStreamId('');
      }
    }
  };

  const getScore = () => {
    const result = [];
    for (let i = 0; i < userData.length; i++) {
      result.push(
        <span key={i} className={styles.span}>
          {userData[i].nickname + ' : ' + userData[i].score + '개 '}
        </span>,
      );
    }
    return result;
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage(e.target.value);
      sendGameData(e.target.value);
    }
  };

  const sendGameData = (msg: string) => {
    const gameData = {
      gameStatus: 2,
      gameId: 2,
      index: index,
      timeout: time <= 0 ? 'Y' : 'N',
      keyword: msg,
    };

    props.user.getStreamManager().stream.session.signal({
      data: JSON.stringify(gameData),
      type: 'game',
    });
  };
  const sendMessage = (msg: string) => {
    if (props.user && msg) {
      let messageData = msg.replace(/ +(?= )/g, '');
      if (messageData !== '' && messageData !== ' ') {
        const chatData = {
          message: messageData,
          nickname: props.user.getNickname(),
          streamId: props.user.getStreamManager().stream.streamId,
        };
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(chatData),
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

  const exitGame = async () => {
    const data = {
      gameStatus: 3,
      gameId: 2,
    };
    await props.user.getStreamManager().stream.session.signal({
      type: 'game',
      data: JSON.stringify(data),
    });
  };

  const sendCountdown = () => {
    const data = {
      gameStatus: 2,
      gameId: 2,
      index: index,
      timeout: 'Y',
    };
    props.user.getStreamManager().stream.session.signal({
      type: 'game',
      data: JSON.stringify(data),
    });
  };

  useEffect(() => {
    toast("5초 후 몸으로 말해요 게임을 시작하겠습니다.");
    setTimeout(() => {
      setGameFlag(true);
      setTimeFlag(true);
    }, 5000);
    return () => {
      clearTimeout();
    };
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timeFlag) {
        if (parseInt(time) === 0) {
          clearInterval(countdown);
          sendCountdown();
          setTimeFlag(false);
        } else {
          setTime(parseInt(time) - 1);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [time, timeFlag]);

  useEffect(() => {
    setPresenter(props.charadeData.id);
    setAnswer(props.charadeData.answer);
    setStreamId(props.user.getStreamManager().stream.streamId);

    let array = [];
    array.push({
      streamId: props.user.getStreamManager().stream.streamId,
      nickname: props.user.nickname,
      score: 0,
    });
    for (let i = 0; i < props.sub.length; i++) {
      array.push({
        streamId: props.sub[i].getStreamManager().stream.streamId,
        nickname: props.sub[i].nickname,
        score: 0,
      });
    }

    setUserData(array);
    for (let i = 0; i < props.sub.length; i++) {
      if (streamId === props.sub[i].getStreamManager().stream.streamId) {
        setIdx(i);
      }
    }
  }, []);

  useEffect(() => {
    props.user.getStreamManager().stream.session.on('signal:game', (response: any) => {
      if (response.data.gameId === 2) {
        if (response.data.gameStatus === 3) {
          console.log('게임 종료');
          exitGame();
          return;
        }
        // 문제를 맞췄을 때
        if (response.data.gameStatus === 2 && response.data.answerYN === 'Y') {
          sendMessage('정답입니다');
          setIndex(response.data.index);
          setAnswer(response.data.answer);
          setPresenter(response.data.curStreamId);
          setAnswerStreamId(response.data.answerStreamId);
          setTime(60);
          return;
        }
        // 문제를 맞춰서 게임이 끝난 경우
        if (response.data.gameStatus === 2 && response.data.answerYN === 'Y' && !response.data.curStreamId) {
          sendMessage('게임이 끝났습니다.');
          setAnswerStreamId(response.data.answerStreamId);
          setTime(60);
          setGameFlag(false);
          setTimeFlag(false);
          return;
        }
        // 문제를 틀렸을 때
        if (response.data.gameStatus === 2 && response.data.answerYN === 'N') {
          console.log('틀렸어');
          return;
        }

        // 시간이 지났을 때
        if (response.data.gameStatus === 2 && response.data.timeout === 'Y') {
          console.log('시간 초과');
          setIndex(response.data.index);
          setAnswer(response.data.answer);
          setPresenter(response.data.curStreamId);
          setTime(60);
          return;
        }

        // 시간이 지났는데 게임이 끝난 경우
        if (response.data.gameStatus === 2 && response.data.timeout === 'Y' && !response.data.curStreamId) {
          console.log('게임 끝났어');
          setTime(60);
          setGameFlag(false);
          setTimeFlag(false);
          return;
        }
      }
    });
  }, []);

  useEffect(() => {
    setScore();
  });
  return (
    <>
      <div className={styles.body}>
        <div className={styles.wrapper}>
          <span className={styles.alarm}>
            <AlarmIcon /> {time}
          </span>
          <div className={styles.video}>
            {streamId === presenter ? (
              <StreamComponent sessionId={props.sessionId} user={props.user} subscribers={props.subscribers} />
            ) : (
              <StreamComponent
                sessionId={props.sessionId}
                user={props.sub[idx]}
                targetSubscriber={props.targetSubscriber}
                subscribers={props.subscribers}
              />
            )}
          </div>
        </div>

        <div className={styles.inputWrapper}>
          {streamId === presenter ? (
            <input type="text" value={`제시어 : ` + answer} className={styles.answer} disabled />
          ) : (
            <input
              type="text"
              className={styles.input}
              value={message}
              onChange={handleChange}
              placeholder="정답을 입력해 주세요 !"
              onKeyPress={onKeyPress}
            />
          )}
        </div>

        <div className={styles.scoreWrapper}>
          <div className={styles.score}>
            <h1>정답 맞춘 개수</h1>
            {getScore()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Charade;
