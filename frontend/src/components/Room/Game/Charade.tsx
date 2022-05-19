import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../style/Charade.module.scss';
import StreamComponent from '../stream/StreamComponent';
import AlarmIcon from '@mui/icons-material/Alarm';
import { useStore } from '../store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QrCodeScannerOutlined, SettingsCellOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { listStyleType } from 'html2canvas/dist/types/css/property-descriptors/list-style-type';

const Charade = (props: any) => {
  const navigate = useNavigate();
  const { myTurn, setMyTurn } = useStore();
  const [answer, setAnswer] = useState<any>('');
  const [streamId, setStreamId] = useState<any>('');
  const [preId, setPreId] = useState<any>('');
  const [index, setIndex] = useState<any>(1);
  const [category, setCategory] = useState<any>('');
  const categoryAll = ['속담', '영화', '게임', '생물', '직업', '운동', '전체'];

  const [time, setTime] = useState<any>(60);
  const [timeFlag, setTimeFlag] = useState<any>(false);
  const [message, setMessage] = useState<any>('');

  const [userData, setUserData] = useState<any>([{ streamId: '', nickname: '', score: 0 }]);
  const [presenter, setPresenter] = useState<any>('');

  const [idx, setIdx] = useState<any>(0);
  const [answerStreamId, setAnswerStreamId] = useState<any>('');

  const [gameFlag, setGameFlag] = useState<any>(true);

  const [host, setHost] = useState<any>('');

  const [endFlag, setEndFlag] = useState<any>(false);
  const [answerFlag, setAnswerFlag] = useState<any>(false);

  const streamIdRef = useRef(streamId);
  streamIdRef.current = streamId;

  const idxRef = useRef(idx);
  idxRef.current = idx;

  const presenterRef = useRef(presenter);
  presenterRef.current = presenter;

  const preIdRef = useRef(preId);
  preIdRef.current = preId;

  const myTurnRef = useRef(myTurn);
  myTurnRef.current = myTurn;

  const hostRef = useRef(host);
  hostRef.current = hostRef;

  const messageRef = useRef(message);
  messageRef.current = message;

  const endFlagRef = useRef(endFlag);
  endFlagRef.current = endFlag;

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

  const getHint = (msg: string) => {
    const result = [];
    const hint = msg.replace(/ /g, '');
    if (hint.length > 0) {
      for (let i = 0; i < hint.length; i++) {
        result.push(<img src="hint.png" alt="hintIcon" className={styles.hint} />);
      }
    }
    return result;
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage(e.target.value, props.user.getNickname());
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

  const sendMessage = (msg: string, nickname: string) => {
    if (props.user && msg) {
      let messageData = msg.replace(/ +(?= )/g, '');
      if (messageData !== '' && messageData !== ' ') {
        const chatData = {
          message: messageData,
          nickname: nickname,
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
    if (streamIdRef.current === host) {
      await props.user.getStreamManager().stream.session.signal({
        type: 'game',
        data: JSON.stringify(data),
      });
    } else {
      toast.error(
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 'inherit', fontSize: '14px' }}>게임을 시작한 사람만</div>
          <div style={{ width: 'inherit', fontSize: '14px' }}>클릭 가능합니다.</div>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          role: 'alert',
        },
      );
    }
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
    toast('5초 후 몸으로 말해요 게임을 시작하겠습니다.', {
      position: toast.POSITION.TOP_CENTER,
      role: 'alert',
    });
    setTimeout(() => {
      setGameFlag(false);
      setTimeFlag(true);
    }, 5000);
    return () => {
      clearTimeout();
    };
  }, []);

  useEffect(() => {
    if (answerFlag) {
      toast('3초 후 다음 제시어가 출제됩니다.', {
        position: toast.POSITION.TOP_CENTER,
        role: 'alert',
      });
      setTimeout(() => {
        setAnswerFlag(false);
        setTimeFlag(true);
        setTime(60);
      }, 5000);
    }
    return () => {
      clearTimeout();
    };
  }, [answerFlag]);

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
    setStreamId(props.charadeData.id);
    setAnswer(props.charadeData.answer);
    setCategory(props.charadeData.category);

    if (props.curStreamId === props.user.getStreamManager().stream.streamId) {
      setPresenter(props.user.getStreamManager().stream.streamId);
    } else {
      setPresenter('undefined');
      setPreId(props.curStreamId);
    }
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
  }, []);
  useEffect(() => {
    if (presenterRef.current === 'undefined') {
      for (let i = 0; i < props.sub.length; i++) {
        if (preIdRef.current === props.sub[i].getStreamManager().stream.streamId) {
          setIdx(i);
        }
      }
    }
  }, [presenter]);

  useEffect(() => {
    props.user.getStreamManager().stream.session.on('signal:game', (response: any) => {
      if (response.data.gameId === 2) {
        // 게임 종료
        if (response.data.gameStatus === 3) {
          console.log('몸으로 말해요 게임 종료');
          return;
        }
        // 게임 도중
        else if (response.data.gameStatus === 2) {
          // 시간이 지나갔을 때
          if (response.data.timeout === 'Y') {
            if (response.data.finishYN === 'N') {
              if (myTurnRef.current) {
                setMyTurn(false);
              }
              if (props.user.getStreamManager().stream.streamId !== response.data.curStreamId) {
                props.sub.map((v: any, i: number) => {
                  const nexidx = i;
                  if (v.getStreamManager().stream.streamId === response.data.curStreamId) {
                    setIdx(nexidx);
                    setPresenter('');
                    //  setPresenter("undefined");
                    //  setPreId(v.getStreamManager().stream.streamId);
                  }
                });
              } else {
                setMyTurn(true);
                setPresenter(response.data.curStreamId);
              }
              setIndex(response.data.index);
              setAnswer(response.data.answer);
              setAnswerFlag(true);
              setTimeFlag(false);
              return;
            }
            // 모든 게임이 끝났을 때
            else if (response.data.finishYN === 'Y') {
              setTime(60);
              setTimeFlag(false);
              setEndFlag(true);
              setHost(response.data.startSteamId);
              return;
            }
          }
          // 시간이 지나가지 않았을 때
          else if (response.data.timeout === 'N') {
            // 문제를 맞췄을 때
            if (response.data.answerYN === 'Y' && response.data.finishYN === 'N') {
              if (streamIdRef.current === response.data.answerStreamId) {
                sendMessage(
                  `${props.user.getNickname()}님 ${response.data.keyword} 정답입니다`,
                  props.user.getNickname(),
                );
              }

              setIndex(response.data.index);
              if (myTurnRef.current) {
                setMyTurn(false);
              }
              if (props.user.getStreamManager().stream.streamId !== response.data.curStreamId) {
                props.sub.map((v: any, i: number) => {
                  const nexidx = i;
                  if (v.getStreamManager().stream.streamId === response.data.curStreamId) {
                    setIdx(nexidx);
                    setPresenter('');
                    //  setPreId(v.getStreamManager().stream.streamId);
                  }
                });
              } else {
                setMyTurn(true);
                setPresenter(response.data.curStreamId);
              }
              //setPresenter(response.data.curStreamId);
              setAnswer(response.data.answer);
              setAnswerStreamId(response.data.answerStreamId);
              setAnswerFlag(true);
              setTimeFlag(false);
              setTime(60);
              return;
            }
            // 문제를 맞췄는데 모든 게임이 끝났을 때
            else if (response.data.answerYN === 'Y' && response.data.finishYN === 'Y') {
              if (streamIdRef.current === response.data.answerStreamId) {
                sendMessage(
                  `${props.user.getNickname()}님 ${response.data.keyword} 정답입니다`,
                  props.user.getNickname(),
                );
                sendMessage('게임이 끝났습니다.', props.user.getNickname());
              }
              setAnswerStreamId(response.data.answerStreamId);
              setTimeFlag(false);
              setEndFlag(true);
              setHost(response.data.startSteamId);
              return;
            }
            // 문제를 틀렸을 때
            else if (response.data.answerYN === 'N') {
              return;
            }
          }
        }
      }
    });
  }, []);

  useEffect(() => {}, [myTurn]);

  useEffect(() => {
    setScore();
  });
  return (
    <>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div className={`${styles['user-videos-container']} ${styles.charade}`}>
          <div id="user-video" className={`${styles['video-container']} ${styles.charade}`}>
            {myTurnRef.current ? (
              <>
                {props.sub.map((v: any, i: number) => {
                  const curidx = i;
                  return (
                    <StreamComponent
                      key={curidx}
                      user={v}
                      subscribers={props.sub}
                      nickname={v.getNickname()}
                      camStatusChanged={props.camChange}
                      micStatusChanged={props.micChange}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <StreamComponent
                  user={props.user}
                  sessionId={props.sessionId}
                  subscribers={props.sub}
                  camStatusChanged={props.camChange}
                  micStatusChanged={props.micChange}
                />
                {props.sub.map((v: any, i: number) => {
                  const curidx = i;
                  if (idxRef.current !== curidx) {
                    return (
                      <StreamComponent
                        key={curidx}
                        user={v}
                        subscribers={props.sub}
                        //  mode={mode}
                        nickname={v.getNickname()}
                        camStatusChanged={props.camChange}
                        micStatusChanged={props.micChange}
                      />
                    );
                  }
                })}
              </>
            )}
          </div>
        </div>
        {gameFlag ? (
          <div className={styles.description}>
            <h1 style={{ color: 'white', margin: '4vh auto' }}>몸으로 말해요 🤔</h1>
            <ol className={styles.desc}>
              <li>첫 번째 사람은 제시어를 보고 제한시간안에 몸으로 묘사 해주세요</li>
              <li>다른 사람들은 몸으로 묘사한 제시어를 유추하여 정답을 맞춰주세요</li>
              <li>정답을 맞추거나 제한시간이 끝나면 다음 사람으로 넘어갑니다</li>
              <li>게임 진행 순서는 모두 랜덤입니다! 긴장 풀지 마세요!</li>
            </ol>
          </div>
        ) : (
          <div className={styles.body}>
            <div className={styles.wrapper}>
              <div className={styles.hintWrapper}>{getHint(`${answer}`)}</div>
              <input
                style={{
                  height: 40,
                }}
                type="text"
                value={`카테고리 : ${categoryAll[category]} `}
                className={styles.category}
                disabled
              ></input>
              <div className={styles.video}>
                <span className={styles.round}>
                  Round {index} / {userData.length}
                </span>
                <span className={styles.alarm}>
                  <AlarmIcon fontSize="large" /> {time}
                </span>

                {endFlagRef.current ? (
                  <div className={styles.exit}>
                    <button onClick={exitGame} className={styles.button}>
                      대기실로
                    </button>
                  </div>
                ) : null}

                {streamIdRef.current === presenterRef.current ? (
                  <StreamComponent
                    sessionId={props.sessionId}
                    user={props.user}
                    subscribers={props.subscribers}
                    camStatusChanged={props.camChange}
                    micMuted={props.micMuted}
                  />
                ) : (
                  <StreamComponent
                    // sessionId={props.sessionId}
                    user={props.sub[idxRef.current]}
                    subscribers={props.subscribers}
                    camStatusChanged={props.camChange}
                    micMuted={props.micMuted}
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
                <h3>{getScore()}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Charade;
