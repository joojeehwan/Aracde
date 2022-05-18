import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import styles from './style/RoomContents.module.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStore } from './store';
import RoomApi from '../../common/api/Room';
import Play from '../../assets/play.png';
import Link from '../../assets/link.png';
import { ReactComponent as Info } from '../../assets/info.svg';
import { ReactComponent as People } from '../../assets/team.svg';
import Chat from './chat/Chat';
import Catchmind from './Game/Catchmind';
import Charade from './Game/Charade';
import FindPerson from './Game/FindPerson';
import StreamComponent from './stream/StreamComponent';
import UserModel from '../Model/user-model';
import SelectGame from './Game/Modal/SelectGame';
import Wait from './Game/Modal/Wait';
import Guess from './Game/Guess';
import { style } from '@mui/system';
import Invite from '../../components/Modal/Invite/Invite';

const OPENVIDU_SERVER_URL = 'https://k6a203.p.ssafy.io:5443';
const OPENVIDU_SERVER_SECRET = 'arcade';

let localUserInit = new UserModel();
let OV: any = undefined;

const RoomContents = ({ sessionName, userName }: any) => {
  const navigate = useNavigate();
  //   const { setRoomSnapshotResult } = RoomApi;
  //   const { getImgUploadResult } = ImgApi;
  const { setSessionId, mode, setMode, myMic, myVideo, myTurn, setMyTurn } = useStore();
  //   const { loginStatus, setLoginStatus } = useContext(LoginStatusContext);
  //   const { myName } = useContext(NameContext);
  //console.log(loginStatus, myName);

  const myTurnRef = useRef(myTurn);
  myTurnRef.current = myTurn;

  console.log('room content render');
  const [mySessionId, setMySessionId] = useState<string>(sessionName);
  const [myUserName, setMyUserName] = useState<string>(userName);
  const [session, setSession] = useState<any>(undefined);
  const [localUser, setLocalUser] = useState<any>(undefined);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [findsub, setFindsub] = useState<any[]>([]);
  const findsubRef = useRef(findsub);
  findsubRef.current = findsub;
  const [publisher, setPublisher] = useState<any>(undefined);
  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;
  const [targetSubscriber, setTargetSubscriber] = useState<any>({});
  const [nickname, setNickname] = useState<any[]>([]);
  const [correctNickname, setCorrectNickname] = useState<any[]>([]);
  const [correctPeopleName, setCorrectPeopleName] = useState<any>();
  const [participantNum, setParticpantNum] = useState<any>(1);
  const [catchMindData, setCatchMindData] = useState<{ answer: string; id: string; nextId: string; time: number }>();
  const [charadeData, setCharadeData] = useState<{ answer: string; id: string; category: number }>();

  const [firstSpeak, setFirstSpeak] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [wait, setWait] = useState<boolean>(false);

  const [imDetect, setImDetect] = useState<string>('');
  const [imPerson, setImPerson] = useState<string>('');
  const [detectNick, setDetectNick] = useState<string>('');
  const [curStreamId, setCurStreamId] = useState<any>('');

  const participantNumRef = useRef(participantNum);
  participantNumRef.current = participantNum;

  const catchMindDataRef = useRef(catchMindData);
  catchMindDataRef.current = catchMindData;

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const publisherRef = useRef(publisher);
  publisherRef.current = publisher;

  const localUserRef = useRef(localUser);
  localUserRef.current = localUser;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  // console.log(localUserRef.current, sessionRef.current);

  const targetSubscriberRef = useRef(targetSubscriber);
  targetSubscriberRef.current = targetSubscriber;

  const { exitRoom, enterRoom, intoGame } = RoomApi;

  const joinSession = async () => {
    OV = new OpenVidu();
    OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 100, // Frequency of the polling of audio streams in ms (default 100)
        threshold: -50, // Threshold volume in dB (default -50)
      },
    });
    setSession(OV.initSession());
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    const data = {
      gameStatus: 0,
      flag: false,
    };
    sessionRef.current.signal({
      type: 'game',
      data: JSON.stringify(data),
    });
    setOpen(false);
  };
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    const data = {
      gameStatus: 0,
      flag: true,
    };
    sessionRef.current.signal({
      type: 'game',
      data: JSON.stringify(data),
    });
    setOpen(true);
  };

  useEffect(() => {
    const preventGoBack = () => {
      window.history.pushState(null, '', window.location.href);
      console.log('prevent go back!');
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventGoBack);
    window.addEventListener('beforeunload', onbeforeunload);
    window.addEventListener('unload', handleleaveRoom);

    joinSession();
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
      window.removeEventListener('popstate', preventGoBack);
      window.removeEventListener('unload', handleleaveRoom);
      handleleaveRoom();
      leaveSession();
    };
  }, []);

  useEffect(() => {
    console.log(session, sessionRef.current);
    setSessionId(sessionRef.current);
    if (sessionRef.current) {
      console.log(sessionRef.current);
      // 상대방이 들어왔을 때 실행
      console.log('AS?DAS?DASDFKLASDFHNLS:DKFHNBVKLSJ:DVFHBNSHKDJ:FVHBNSAJKDFHBNASDKF');
      sessionRef.current.on('streamCreated', (event: any) => {
        console.log('?AS?DAS?D?ASD?ASFVSJKDLVHNBSDKJVHBNSDKJVHBSDKLJFCHGBADSKLJFHASKJLFDHKLJADSFHSDIUFHSDUIFHGSDLJKF');
        setParticpantNum(participantNumRef.current + 1);
        let subscriber = sessionRef.current.subscribe(event.stream, undefined);
        //console.log(event);
        const newUser = new UserModel();
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setAudioActive(event.stream.audioActive);
        newUser.setVideoActive(event.stream.videoActive);
        newUser.setType('remote');

        const nickname = event.stream.connection.data.split('%')[0];
        //console.log(nickname);
        newUser.setNickname(JSON.parse(nickname).clientData);

        console.log(newUser);
        console.log(subscribersRef.current);
        console.log(subscribers);
        setSubscribers([...subscribersRef.current, newUser]);
      });

      // 상대방이 상태를 변경했을 때 실행 (카메라 / 마이크 등)
      sessionRef.current.on('signal:userChanged', (event: any) => {
        console.log(sessionRef.current);
        subscribersRef.current.forEach((user) => {
          if (user.getConnectionId() === event.from.connectionId) {
            const data = JSON.parse(event.data);
            if (data.isAudioActive !== undefined) {
              user.setAudioActive(data.isAudioActive);
            }
            if (data.isVideoActive !== undefined) {
              user.setVideoActive(data.isVideoActive);
            }
          }
        });
        setSubscribers([...subscribersRef.current]);
      });

      sessionRef.current.on('streamDestroyed', (event: any) => {
        setParticpantNum(participantNumRef.current - 1);
        deleteSubscriber(event.stream);
      });
      sessionRef.current.on('publisherStartSpeaking', (event: any) => {
        console.log('User ' + event.connection.connectionId + ' start speaking');
        subscribersRef.current.map((v) => {
          if (v.getConnectionId() === event.connection.connectionId) {
            v.setSpeaking(true);
          }
        });
        setSubscribers([...subscribersRef.current]);
      });

      sessionRef.current.on('publisherStopSpeaking', (event: any) => {
        console.log('User ' + event.connection.connectionId + ' stop speaking');
        subscribersRef.current.map((v) => {
          if (v.getConnectionId() === event.connection.connectionId) {
            v.setSpeaking(false);
          }
        });
        setSubscribers([...subscribersRef.current]);
      });

      sessionRef.current.on('exception', (exception: any) => {
        console.warn(exception);
      });

      sessionRef.current.on('signal:game', async (response: any) => {
        console.log(response);
        if (response.data.gameStatus === 0) {
          if (localUserRef.current.getStreamManager().stream.streamId !== response.data.streamId) {
            setWait(response.data.flag);
          }
        }
        if (response.data.gameStatus === 3) {
          if (response.data.gameId === 3) {
            subscribersRef.current.map((v) => {
              if (v.isImDetect()) {
                v.setImDetect(false);
              }
            });
            if (localUserRef.current.isImDetect()) localUserRef.current.setImDetect(false);
            else removeVoiceFilter();
          }
          setMode('home');
        }
        if (response.data.gameId === 1 && response.data.gameStatus === 2 && modeRef.current !== 'game1') {
          console.log('?실행', modeRef.current);
          setCatchMindData({
            answer: response.data.answer,
            id: response.data.curStreamId,
            nextId: response.data.nextStreamId,
            time: response.data.time,
          });
          if (window.localStorage.getItem('userSeq')) {
            await intoGame(window.localStorage.getItem('userSeq'), 0);
          }
          setMode('game1');
          return;
        }
        if (
          response.data.gameId === 1 &&
          response.data.gameStatus === 2 &&
          modeRef.current === 'game1' &&
          response.data.restart
        ) {
          setCatchMindData({
            answer: response.data.answer,
            id: response.data.curStreamId,
            nextId: response.data.nextStreamId,
            time: response.data.time,
          });
          if (window.localStorage.getItem('userSeq')) {
            await intoGame(window.localStorage.getItem('userSeq'), 0);
          }
          setMode('game1');
        }
        if (response.data.gameId === 2 && response.data.gameStatus === 2 && modeRef.current !== 'game2') {
          console.log('몸으로 말해요 게임 실행');
          setCharadeData({
            answer: response.data.answer,
            id: localUserRef.current.getStreamManager().stream.streamId,
            category: response.data.category,
          });
          setCurStreamId(response.data.curStreamId);
          if (localUserRef.current.getStreamManager().stream.streamId === response.data.curStreamId) {
            setMyTurn(true);
          }
          localUserInit.setAudioActive(false);
          if (window.localStorage.getItem('userSeq')) {
            await intoGame(window.localStorage.getItem('userSeq'), 1);
          }
          setMode('game2');
        }
        if (response.data.gameId === 3 && response.data.gameStatus === 2 && modeRef.current !== 'game3') {
          console.log('?실행', response.data);

          if (response.data.playYn === 'Y') {
            console.log(response.data);
            let curUsers = [];
            if (localUserRef.current.getStreamManager().stream.streamId === response.data.detectiveStreamId) {
              localUserRef.current.setImDetect(true);
              setImDetect(response.data.detectiveStreamId);
              setDetectNick(localUserRef.current.getNickname());
            } else {
              console.log('난 탐정이 아니다. ', localUserRef.current.getStreamManager());
              handleVoiceFilter();
              subscribersRef.current.map((v) => {
                if (v.getStreamManager().stream.streamId === response.data.detectiveStreamId) {
                  v.setImDetect(true);
                  setDetectNick(v.getNickname());
                }
              });
            }
            curUsers.push(localUserRef.current);
            curUsers.push(...subscribersRef.current);
            curUsers.sort(() => Math.random() - 0.5);
            setFirstSpeak(response.data.curStreamId);
            setImPerson(response.data.suspectStreamId);
            setFindsub(curUsers);
            if (window.localStorage.getItem('userSeq')) {
              await intoGame(window.localStorage.getItem('userSeq'), 2);
            }
            setMode('game3');
          }
        }
      });

      getToken().then((token) => {
        console.log('GETTOKEN', token);
        sessionRef.current
          .connect(token, { clientData: myUserName })
          .then(async () => {
            console.log('???AS?DA?SD?ASD?ASD?ASD?ASD?ASD??????????????? 여기가 왜 실 행 되는 거냐 ');
            let publisherTemp = OV.initPublisher(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: myMic,
              publishVideo: myVideo,
              resolution: '640x480',
              frameRate: 30,
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
              mirror: false,
            });

            // --- 6) Publish your stream ---

            sessionRef.current.publish(publisherTemp);

            localUserInit.setAudioActive(myMic);
            localUserInit.setVideoActive(myVideo);
            localUserInit.setNickname(myUserName);
            localUserInit.setConnectionId(sessionRef.current.connection.connectionId);
            localUserInit.setStreamManager(publisherTemp);

            // Set the main video in the page to display our webcam and store our Publisher
            setPublisher(publisherTemp);
            setLocalUser(localUserInit);
            const result = await enterRoom(sessionName);
            if (result.status === 200) {
              toast.success(<div style={{ width: 'inherit', fontSize: '14px' }}>입장 성공!</div>, {
                position: toast.POSITION.TOP_CENTER,
                role: 'alert',
              });
            } else {
              toast.error(
                <div style={{ width: 'inherit', fontSize: '14px' }}>방이 존재하지 않거나, 인원 초과입니다.</div>,
                {
                  position: toast.POSITION.TOP_CENTER,
                  role: 'alert',
                },
              );
              navigate('/');
            }
          })
          .catch((error: any) => {
            console.log('There was an error connecting to the session:', error.code, error.message);
          });
      });
    }
  }, [session]);

  useEffect(() => {
    console.log(subscribers);
    setTargetSubscriber(subscribers[0]);
  }, [subscribers]);

  const leaveSession = () => {
    console.log('??여기 실행됨?');
    // handleleaveRoom();
    const mySession = sessionRef.current;
    if (mySession) {
      mySession.disconnect();
    }
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId('');
    setMyUserName('');
    setPublisher(undefined);
    setLocalUser(undefined);
  };

  const deleteSubscriber = (stream: any) => {
    console.log(stream);
    console.log(subscribersRef.current);
    console.log(subscribers);
    const userStream = subscribersRef.current.filter((user) => user.getStreamManager().stream === stream)[0];

    console.log(userStream);

    console.log(subscribersRef.current);
    console.log(subscribers);
    let index = subscribersRef.current.indexOf(userStream, 0);
    console.log(index);
    if (index > -1) {
      subscribersRef.current.splice(index, 1);
      console.log(subscribersRef.current);
      console.log(subscribers);
      setSubscribers([...subscribersRef.current]);
    }
    console.log(subscribersRef.current);
  };

  const onbeforeunload = (e: any) => {
    e.preventDefault();
    handleleaveRoom();
    e.returnValue = 'message to user';
    setTimeout(() => {
      setTimeout(() => {
        console.log('여기가 되는건 아니겠죠?!?!?!?!?!?!?!?!?!?!?!??!?!?!?!?!?');
        enterRoom(sessionName);
      }, 500);
    }, 100);
  };

  const handleleaveRoom = async () => {
    console.log('여기 안불리겠지??', sessionName);
    await exitRoom(sessionName);
  };
  const sendSignalUserChanged = (data: any) => {
    //console.log("시그널 보내 시그널 보내");
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    console.log(sessionRef.current);
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    //console.log("캠 상태 변경!!!");
    localUserInit.setVideoActive(!localUserInit.isVideoActive());
    localUserInit.getStreamManager().publishVideo(localUserInit.isVideoActive());

    setLocalUser(localUserInit);
    sendSignalUserChanged({ isVideoActive: localUserInit.isVideoActive() });
  };

  const micStatusChanged = (flag: any) => {
    //console.log("마이크 상태 변경!!!");
    // console.log(flag, );
    if (flag.type !== 'click') {
      localUserInit.setAudioActive(flag);
      localUserInit.getStreamManager().publishAudio(localUserInit.isAudioActive());
      sendSignalUserChanged({ isAudioActive: localUserInit.isAudioActive() });
      setLocalUser(localUserInit);
    } else {
      localUserInit.setAudioActive(!localUserInit.isAudioActive());
      localUserInit.getStreamManager().publishAudio(localUserInit.isAudioActive());
      sendSignalUserChanged({ isAudioActive: localUserInit.isAudioActive() });
      setLocalUser(localUserInit);
    }
  };

  const micMuted = () => {
    localUserInit.setAudioActive(false);
    localUserInit.getStreamManager().publishAudio(localUserInit.isAudioActive());
    sendSignalUserChanged({ isAudioActive: localUserInit.isAudioActive() });
    setLocalUser(localUserInit);
  };

  const handleVoiceFilter = () => {
    const filterList = [0.65, 2.0];
    const type = 'GStreamerFilter';
    const rnum = Math.floor(Math.random() * filterList.length);

    const options = { command: `pitch pitch=${filterList[rnum]}` };
    localUserRef.current
      .getStreamManager()
      .stream.applyFilter(type, options)
      .then((result: any) => {
        console.log(result, '난 탐정이 아니다.');
      });
  };

  const removeVoiceFilter = () => {
    localUserRef.current
      .getStreamManager()
      .stream.removeFilter()
      .then(() => {
        console.log('필터 제거');
      })
      .catch(() => {
        console.log('필터 없어용');
      });
  };

  const getToken = () => {
    return createSession(mySessionId).then((sessionId) => createToken(sessionId));
  };

  const createSession = (sessionId: any) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
          headers: {
            Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('CREATE SESION', response);
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            ////console.log(error);
            console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"',
              )
            ) {
              window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
            }
          }
        });
    });
  };

  const createToken = (sessionId: any) => {
    let jsonBody = {
      role: 'PUBLISHER',
      kurentoOptions: {},
    };
    jsonBody.kurentoOptions = {
      allowedFilters: ['FaceOverlayFilter', 'ChromaFilter', 'GStreamerFilter'],
    };

    return new Promise((resolve, reject) => {
      let data = JSON.stringify(jsonBody);
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions/' + sessionId + '/connection', data, {
          headers: {
            Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('TOKEN', response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  const selectGame = (game: string, ctgy: string) => {
    if(subscribersRef.current.length < 2) {
      toast.error(<div style={{ width: 'inherit', fontSize: '14px' }}>게임은 참여인원이 3명 이상일 때 진행 할 수 있습니다.</div>, {
        position: toast.POSITION.TOP_CENTER,
        role: 'alert',
      });
      return;
    
    }
    
    if (game === '3') {
      const data = {
        gameStatus: 1,
        gameId: 3,
        // category : 5,
      };
      sessionRef.current.signal({
        type: 'game',
        data: JSON.stringify(data),
      });
    } else if (game === '2') {
      const data = {
        gameStatus: 1,
        gameId: 2,
        category: +ctgy,
      };
      sessionRef.current.signal({
        type: 'game',
        data: JSON.stringify(data),
      });
    } else {
      console.log('???????여기 아님?');
      const data = {
        gameStatus: 1,
        gameId: +game,
        category: +ctgy,
      };
      sessionRef.current.signal({
        type: 'game',
        data: JSON.stringify(data),
      });
    }

    // setMode("game1");
  };
  const handleCopy = () => {
    let value = document.getElementById('code')?.innerHTML as string;
    navigator.clipboard.writeText(value).then(() => {
      toast.success(<div style={{ width: 'inherit', fontSize: '14px' }}>복사 완료!</div>, {
        position: toast.POSITION.TOP_CENTER,
        role: 'alert',
      });
    });
  };

  //게임 초대 모달
  const [inviteIsOpen, setInviteIsOpen] = useState<boolean>(false);

  const handleOpenInvite = useCallback(() => {
    setInviteIsOpen(true);
  }, [inviteIsOpen]);

  const handleCloseInvite = useCallback(() => {
    setInviteIsOpen(false);
  }, [inviteIsOpen]);

  useEffect(() => {
    console.log(myTurnRef.current, '진짜ㅋㅋㅋ');
  }, [myTurn]);

  return (
    <div
      style={{
        width: '100vw',
      }}
    >
      <div
        className={
          mode === 'home'
            ? styles['contents-container']
            : mode === 'game1' || mode === 'game3'
            ? `${styles['contents-container']} ${styles.catchmind}`
            : mode === 'game2'
            ? `${styles['contents-container']} ${styles.charade}`
            : styles['contents-container']
        }
      >
        {mode === 'game3' ? (
          <FindPerson
            my={localUserRef.current}
            users={findsub}
            detect={imDetect}
            suspect={imPerson}
            mySession={mySessionId}
            imSpeak={firstSpeak}
            detectNick={detectNick}
            camChange={camStatusChanged}
            micChange={micStatusChanged}
          />
        ) : mode === 'game2' ? (
          <div>
            <Charade
              sessionId={mySessionId}
              sub={subscribersRef.current}
              user={localUserRef.current}
              subscribers={subscribers}
              charadeData={charadeData}
              curStreamId={curStreamId}
              camChange={camStatusChanged}
              micChange={micStatusChanged}
              micMuted={micMuted}
            />
          </div>
        ) : (
          <div
            className={
              mode === 'home'
                ? styles['user-videos-container']
                : mode === 'game1'
                ? `${styles['user-videos-container']} ${styles.catchmind}`
                : mode === 'game2'
                ? `${styles['user-videos-container']} ${styles.charade}`
                : styles['user-videos-container']
            }
          >
            <div
              id="user-video"
              className={
                mode === 'home'
                  ? `${styles['video-container']}`
                  : mode === 'game1'
                  ? `${styles['video-container']} ${styles.catchmind}`
                  : mode === 'game2'
                  ? `${styles['video-container']} ${styles.charade}`
                  : styles['video-container']
              }
            >
              {localUserRef.current !== undefined && localUserRef.current.getStreamManager() !== undefined && (
                <>
                  {mode === 'game2' ? (
                    myTurnRef.current ? null : (
                      <StreamComponent
                        user={localUserRef.current}
                        sessionId={mySessionId}
                        camStatusChanged={camStatusChanged}
                        micStatusChanged={micStatusChanged}
                        subscribers={subscribers}
                        mode={mode}
                        // openKeywordInputModal={openKeywordInputModal}
                      />
                    )
                  ) : (
                    <StreamComponent
                      user={localUserRef.current}
                      sessionId={mySessionId}
                      camStatusChanged={camStatusChanged}
                      micStatusChanged={micStatusChanged}
                      subscribers={subscribers}
                      mode={mode}
                      // openKeywordInputModal={openKeywordInputModal}
                    />
                  )}
                </>
              )}

              {subscribersRef.current.map((sub, i) => {
                return (
                  <StreamComponent
                    key={i}
                    user={sub}
                    targetSubscriber={targetSubscriber}
                    subscribers={subscribers}
                    mode={mode}
                    nickname={nickname}
                    correctNickname={correctNickname}
                    // sirenWingWing={sirenWingWing}
                    correctPeopleName={correctPeopleName}
                    camStatusChanged={camStatusChanged}
                    micStatusChanged={micStatusChanged}
                  />
                );
              })}
            </div>
          </div>
        )}
        {mode === 'game1' ? <Catchmind initData={catchMindDataRef.current} user={localUserRef.current} /> : null}
        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div
            className={
              mode === 'home'
                ? styles.etcbox
                : mode === 'game1' || mode === 'game3'
                ? `${styles.etcbox} ${styles.catchmind}`
                : mode === 'game2'
                ? `${styles.etcbox} ${styles.charade}`
                : styles.etcbox
            }
          >
            {mode === 'home' ? (
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  width: '85%',
                }}
              >
                <div className={styles['chat-container']}>
                  <>
                    <Chat user={localUserRef.current} mode={mode} sub={subscribers} />
                  </>
                </div>
                <div
                  style={{
                    width: '50%',
                    height: '23vh',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                  }}
                >
                  <button
                    className={styles.selectGame}
                    style={{
                      gridRow: '1 / span 2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '4%',
                      cursor: 'pointer',
                    }}
                    onClick={handleOpenModal}
                  >
                    <img className={styles.selectGameImage} src={Play} style={{ width: '30%', height: '30%' }}></img>
                    게임 선택
                  </button>

                  <div
                    className={styles.codeBlock}
                    onClick={handleCopy}
                  >
                    <button
                      className={styles.codePaste}
                    >
                      <img src={Link} style={{ width: '48px'}}></img>
                    </button>
                    <div
                      id="code"
                      className={styles.codeText}
                    >
                      {window.localStorage.getItem('invitecode')}
                    </div>
                  </div>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2%',
                      cursor: 'pointer',
                    }}
                    className={styles.inviteFriend}
                    onClick={handleOpenInvite}
                  >
                    <People
                      className={styles.inviteSVG}
                      style={{
                        width: '20%',
                        height: '45%',
                      }}
                      filter="invert(100%) sepia(100%) saturate(0%) hue-rotate(283deg) brightness(101%) contrast(104%)"
                    />
                    친구 초대
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${styles['chat-container']} ${styles.game}`}>
                <>
                  <Chat user={localUserRef.current} mode={mode} sub={subscribers} />
                </>
              </div>
            )}
          </div>
        )}
      </div>
      {open ? <SelectGame open={open} onClose={handleCloseModal} onSelect={selectGame}></SelectGame> : null}
      {wait ? <Wait open={wait}></Wait> : null}
      {inviteIsOpen ? <Invite open={inviteIsOpen} onClose={handleCloseInvite} /> : null}
    </div>
  );
};

export default RoomContents;
