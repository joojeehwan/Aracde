import { ControlPointSharp } from '@mui/icons-material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../style/Charade.module.scss';
import StreamComponent from '../stream/StreamComponent';
import AlarmIcon from '@mui/icons-material/Alarm';

const Charade = (props: any) => {
  const [nickname, setNickname] = useState<any>('');
  const [answer, setAnswer] = useState<any>('');
  const [streamId, setStreamId] = useState<any>('');
  const [index, setIndex] = useState<any>(1);

  const [timeout, setTimeout] = useState<any>(60);

  const [sub, setSub] = useState<any>([]);
  const [grade, setGrade] = useState<any>(0);

  const [message, setMessage] = useState<any>('');

  const [entryOrder, setEntryOrder] = useState<any>([]);
  const [presenter, setPresenter] = useState<any>('');
  const [correctAnswer, setCorrectAnswer] = useState<any>('');

  const rendering = () => {
    const result = [];
    for (let i = 0; i < sub.length; i++) {
      result.push(<span key={i}>{sub[i] + ' '}</span>);
    }
    return result;
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage(e.target.value);
    }
  };

  const sendMessage = (msg: string) => {
    console.log('정답 : ' + props.charadeData.answer);
    if (props.user && msg) {
      let messageData = msg.replace(/ +(?= )/g, '');
      if (messageData !== '' && messageData !== ' ') {
        const chatData = {
          message: messageData,
          nickname: props.user.getNickname(),
          streamId: props.user.getStreamManager().stream.streamId,
        };
        const gameData = {
          gameStatus: 2,
          gameId: 2,
          index: index,
          timeout: timeout <= 0 ? 'Y' : 'N',
          keyword: answer,
        };
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(chatData),
          type: 'chat',
        });
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(gameData),
          type: 'game',
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

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(timeout) > 0) {
        setTimeout(parseInt(timeout) - 1);
      }
      if (parseInt(timeout) === 0) {
        const data = {
          gameStatus: 2,
          gameId: 2,
          index: index,
          timeout: 'Y'
        };
        props.user.getStreamManager().stream.session.signal({
          type: 'game',
          data: JSON.stringify(data),
        });
        clearInterval(countdown);
      }

    }, 1000);
    return () => clearInterval(countdown);
  })

  useEffect(() => {
    console.log(props.user)
    setPresenter(props.charadeData.id);
    setAnswer(props.charadeData.answer);
    setNickname(props.user.getNickname());
    setStreamId(props.user.getStreamManager().stream.streamId);
  }, [presenter]);

  useEffect(() => {
    console.log(props.sub, '실행');
    setSub([...sub, props.sub]);
  }, [props.sub]);

  useEffect(() => {
    props.user.getStreamManager().stream.session.on('signal:game', (response: any) => {
      console.log('여기밑에가 api 받는 데이터입니다.');
      console.log(response);
      if (response.data.gameId === 2) {
        if (response.data.gameStatus === 3) {
          console.log('종료야');
          exitGame();
        }
        // 문제를 맞췄을 때
        if (response.data.gameStatus === 2 && response.data.answerYN === 'Y') {
          console.log('맞췄어');
          sendMessage('정답입니다.');
          setIndex(response.data.index);
          setAnswer(response.data.answer);
          setPresenter(response.data.curStreamId);
          if (streamId === response.data.answerStreamId) {
          }
        }
        // 문제를 맞춰서 게임이 끝난 경우
        if (response.data.gameStatus === 2 && response.data.answerYN === 'Y' && !response.data.curStreamId) {
          console.log("게임 끝났어");
          if (streamId === response.data.answerStreamId) {
          }
        }
        // 문제를 틀렸을 때
        if (response.data.gameStatus === 2 && response.data.answerYN === 'N') {
          console.log('틀렸어');
        }

        // 시간이 지났을 때
        if (response.data.gameStatus === 2 && response.data.timeout === 'Y') {
          console.log('시간 끝났어');
          setIndex(response.data.index);
          setAnswer(response.data.answer);
          setPresenter(response.data.curStreamId);
        }

        // 시간이 지났는데 게임이 끝난 경우
        if (response.data.gameStatus === 2 && response.data.timeout === 'Y' && !response.data.curStreamId) {
          console.log("게임 끝났어");
        }
      }
    });
  });

  return (
    <>
      <div className={styles.body}>
        <div>
          <span className={styles.alarm}>
            <AlarmIcon /> {timeout}
          </span>
          <div className={styles.video}>
            <StreamComponent sessionId={props.sessionId} user={props.user} subscribers={props.subscribers} />
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
              placeholder="정답을 맞춰보세요 !"
              onKeyPress={onKeyPress}
            />
          )}
        </div>
        <div>
          <h1>정답 맞춘 개수</h1>
          <p>
            {/* {rendering()} */}
            <span>
              {nickname} : {grade} 개
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Charade;
