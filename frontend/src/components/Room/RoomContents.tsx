import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import styles from "./style/RoomContents.module.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "./store";
import Play from '../../assets/play.png';
import {ReactComponent as Info} from '../../assets/info.svg';
import {ReactComponent as People} from '../../assets/team.svg';
import Chat from "./chat/Chat";
import Catchmind from "./Game/Catchmin";
import Charade from "./Game/Charade";
import StreamComponent from "./stream/StreamComponent";
import UserModel from "../Model/user-model";
import { display } from "@mui/system";

const OPENVIDU_SERVER_URL = "https://k6a203.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "arcade";

let localUserInit = new UserModel();
let OV : any = undefined;

const RoomContents = ({
  sessionName,
  userName,
} : any) => {
  const navigate = useNavigate();
//   const { setRoomSnapshotResult } = RoomApi;
//   const { getImgUploadResult } = ImgApi;
  const { setSessionId } = useStore();
//   const { loginStatus, setLoginStatus } = useContext(LoginStatusContext);
//   const { myName } = useContext(NameContext);
  //console.log(loginStatus, myName);
  console.log("room content render");
  const [mySessionId, setMySessionId] = useState<string>(sessionName);
  const [myUserName, setMyUserName] = useState<string>(userName);
  const [session, setSession] = useState<any>(undefined);
  const [localUser, setLocalUser] = useState<any>(undefined);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [publisher, setPublisher] = useState<any>(undefined);
  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;
  const [targetSubscriber, setTargetSubscriber] = useState<any>({});
  const [nickname, setNickname] = useState<any[]>([]);
  const [correctNickname, setCorrectNickname] = useState<any[]>([]);
  const [correctPeopleName, setCorrectPeopleName] = useState<any>();
  const [participantNum, setParticpantNum] = useState<any>(1);
  const [mode , setMode] = useState<string>("home");


  const participantNumRef = useRef(participantNum);
  participantNumRef.current = participantNum;



  const sessionRef = useRef(session);
  sessionRef.current = session;

  const publisherRef = useRef(publisher);
  publisherRef.current = publisher;

  const localUserRef = useRef(localUser);
  localUserRef.current = localUser;

  // console.log(localUserRef.current, sessionRef.current);

  const targetSubscriberRef = useRef(targetSubscriber);
  targetSubscriberRef.current = targetSubscriber;

  const joinSession = () => {
    OV = new OpenVidu();
    setSession(OV.initSession());
  };


  useEffect(() => {

    const preventGoBack = () => {
      window.history.pushState(null, "", window.location.href);
      console.log("prevent go back!");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventGoBack);
    window.addEventListener("beforeunload", onbeforeunload);
    // window.addEventListener("unload", handleleaveRoom);

    joinSession();
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      window.removeEventListener("popstate", preventGoBack);
    //   window.removeEventListener("unload", handleleaveRoom);
    //   handleleaveRoom();
      leaveSession();
    };
  }, []);

//   useEffect(() => {
//     const nickname = subscribers.map((data) => {
//       if (targetId === data.getStreamManager().stream.streamId) {
//         return data.nickname;
//       }
//     });
//     console.log(subscribers);
//     console.log(targetId);
//     setTargetNickName(nickname);
//   }, [targetId]);

//   useEffect(() => {
//     console.log(subscribers);
//     const nickname = subscribers.map((data) => {
//       if (sirenTarget === data.getStreamManager().stream.streamId) {
//         return data.nickname;
//       }
//     });
//     setSirenTargetNickName(nickname);
//   }, [sirenTarget]);

//   useEffect(() => {
//     const nickname = subscribers.map((data) => {
//       if (correctPeopleId === data.getStreamManager().stream.streamId) {
//         return data.nickname;
//       }
//     });
//     setCorrectPeopleName(nickname);
//   }, [correctPeopleId]);
  // useEffect(()=> {
  //   if(modalMode==="yousayForbidden") setModalMode("answerForbidden")
  //   if(modalMode==="someonesayForbidden") setModalMode("answerForbidden")
  // },[modalMode])

  useEffect(() => {
    console.log(session, sessionRef.current);
    setSessionId(sessionRef.current);
    if (sessionRef.current) {
      console.log(sessionRef.current);
      // 상대방이 들어왔을 때 실행
        console.log("AS?DAS?DASDFKLASDFHNLS:DKFHNBVKLSJ:DVFHBNSHKDJ:FVHBNSAJKDFHBNASDKF");
      sessionRef.current.on("streamCreated", (event : any) => {
        console.log("?AS?DAS?D?ASD?ASFVSJKDLVHNBSDKJVHBNSDKJVHBSDKLJFCHGBADSKLJFHASKJLFDHKLJADSFHSDIUFHSDUIFHGSDLJKF");
        setParticpantNum(participantNumRef.current + 1);
        let subscriber = sessionRef.current.subscribe(event.stream, undefined);
        //console.log(event);
        const newUser = new UserModel();
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setAudioActive(event.stream.audioActive);
        newUser.setVideoActive(event.stream.videoActive);
        newUser.setType("remote");

        const nickname = event.stream.connection.data.split("%")[0];
        //console.log(nickname);
        newUser.setNickname(JSON.parse(nickname).clientData);

        console.log(newUser);
        console.log(subscribersRef.current);
        console.log(subscribers);
        setSubscribers([...subscribersRef.current, newUser]);
      });

      // 상대방이 상태를 변경했을 때 실행 (카메라 / 마이크 등)
      sessionRef.current.on("signal:userChanged", (event : any) => {
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

      sessionRef.current.on("streamDestroyed", (event : any) => {
        setParticpantNum(participantNumRef.current - 1);
        deleteSubscriber(event.stream);
      });

      sessionRef.current.on("exception", (exception : any) => {
        console.warn(exception);
      });
      
      sessionRef.current.on("signal:game", (data : any) => {
        console.log(data);
      })

      getToken().then((token) => {
        console.log("GETTOKEN", token);
        sessionRef.current
          .connect(token, { clientData: myUserName })
          .then(async () => {
            let publisherTemp = OV.initPublisher(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: true,
              publishVideo: true,
              resolution: "640x480",
              frameRate: 30,
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false,
            });

            // --- 6) Publish your stream ---

            sessionRef.current.publish(publisherTemp);

            localUserInit.setAudioActive(true);
            localUserInit.setVideoActive(true);
            localUserInit.setNickname(myUserName);
            localUserInit.setConnectionId(
              sessionRef.current.connection.connectionId
            );
            localUserInit.setStreamManager(publisherTemp);

            // Set the main video in the page to display our webcam and store our Publisher
            setPublisher(publisherTemp);
            setLocalUser(localUserInit);
          })
          .catch((error : any) => {
            console.log(
              "There was an error connecting to the session:",
              error.code,
              error.message
            );
          });
      });
    }
  }, [session]);

  useEffect(() => {
    console.log(subscribers);
    setTargetSubscriber(subscribers[0]);
  }, [subscribers]);

  const leaveSession = () => {
    const mySession = sessionRef.current;
    //console.log(mySession);
    if (mySession) {
      //console.log("leave");
      mySession.disconnect();
    }
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("");
    setMyUserName("");
    setPublisher(undefined);
    setLocalUser(undefined);
  };

  const deleteSubscriber = (stream : any) => {
    console.log(stream);
    console.log(subscribersRef.current);
    console.log(subscribers);
    const userStream = subscribersRef.current.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];

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

  const onbeforeunload = (e : any) => {
    //console.log("tlfgodehla");
    e.preventDefault();
    e.returnValue = "나가실껀가요?";
    //console.log("dfsdfsdf");
    // leaveSession();
  };

  const sendSignalUserChanged = (data : any) => {
    //console.log("시그널 보내 시그널 보내");
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    console.log(sessionRef.current);
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    //console.log("캠 상태 변경!!!");
    localUserInit.setVideoActive(!localUserInit.isVideoActive());
    localUserInit
      .getStreamManager()
      .publishVideo(localUserInit.isVideoActive());

    setLocalUser(localUserInit);
    sendSignalUserChanged({ isVideoActive: localUserInit.isVideoActive() });
  };

  const micStatusChanged = () => {
    //console.log("마이크 상태 변경!!!");
    localUserInit.setAudioActive(!localUserInit.isAudioActive());
    localUserInit
      .getStreamManager()
      .publishAudio(localUserInit.isAudioActive());
    sendSignalUserChanged({ isAudioActive: localUserInit.isAudioActive() });
    setLocalUser(localUserInit);
  };

  const sendSignalCameraStart = () => {
    const data = {
      photoStatus: 1,
    };
    const signalOptions = {
      data: JSON.stringify(data),
      type: "photo",
    };
    sessionRef.current.signal(signalOptions);
  };

  const getToken = () => {
    return createSession(mySessionId).then((sessionId) =>
      createToken(sessionId)
    );
  };

  const createSession = (sessionId : any) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            ////console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  };

  const createToken = (sessionId : any) => {
    let jsonBody = {
      role: "PUBLISHER",
      kurentoOptions: {},
    };
    jsonBody.kurentoOptions = {
      allowedFilters: ["FaceOverlayFilter", "ChromaFilter", "GStreamerFilter"],
    };

    return new Promise((resolve, reject) => {
      let data = JSON.stringify(jsonBody);
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };
  const selectGame = () => {

    const data = {
      gameStatus: 1,
      gameId : 1,
    };
    sessionRef.current.signal({
      type: "game",
      data: JSON.stringify(data),
    });
    setMode("game1");
  }
  const handleCopy = () => {
    let value = document.getElementById("code")?.innerHTML as string;
    navigator.clipboard.writeText(value).then(
      () => {
        toast.success(<div style={{ width: 'inherit', fontSize: '14px' }}>복사 완료!</div>, {
          position: toast.POSITION.TOP_CENTER,
          role: 'alert',
        });
      }
    );
  }
  return (
    <div style={{
      width : "100vw"
    }}>
    <div className={
      mode === "home"
      ? styles["contents-container"] 
      : mode === "game1"
      ? `${styles["contents-container"]} ${styles.catchmind}`
      : styles["contents-container"] 
    }>
      <div className={
        mode === "home" 
        ? styles["user-videos-container"]
        : mode === "game1"
        ? `${styles["user-videos-container"]} ${styles.catchmind}`
        : styles["user-videos-container"]
      }>
        <div
          id="user-video"
          className={
            mode === "home"
              ? `${styles["video-container"]}`
              : mode === "game1"
              ? `${styles["video-container"]} ${styles.catchmind}`
              : participantNumRef.current > 4
              ? `${styles["video-container"]} ${styles.twoXthree}`
              : participantNumRef.current > 2
              ? `${styles["video-container"]} ${styles.twoXtwo}`
              : styles["video-container"]
          }
        >
          {localUserRef.current !== undefined &&
            localUserRef.current.getStreamManager() !== undefined && (
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
              />
            );
          })}
        </div>
      </div>
      {mode === "game1" ? (
            <Catchmind/>
        ) : null}
      {mode === "game2" ? (
            <Charade />
        ) : null}
      {localUser !== undefined && localUser.getStreamManager() !== undefined && (
        <div className={
          mode === "home"
          ? styles.etcbox
          : mode === "game1"
          ? `${styles.etcbox} ${styles.catchmind}`
          : styles.etcbox
        }>
          {mode === "home" ? (<div style={{
            display : "flex",
            width : "85%"
          }}>
            <div className={styles["chat-container"]}>
                <>
                  <Chat
                    user={localUserRef.current}
                    mode={mode}
                    sub={subscribers}
                  />
                </>
            </div>
            <div style={{
              width : "50%",
              height : "23.7vh",
              display : "grid",
              gridTemplateColumns : "1fr 1fr",
              gridTemplateRows : "1fr 1fr 1fr",
              // gap : "5% 2%"
              // gridColumn : "1 / span 2",
            }}>
              <div style={{
                  gridColumn : "1 / span 2",
                  marginBottom : "2%",
                  display : "flex",

                }}>
                  <button onClick={handleCopy}>COPY</button>
                
                <div id="code" style={{
                  width : "100%",
                  backgroundColor : "#C4C4C4",
                  borderRadius : "0px 5px 5px 0px",
                  display : "flex",
                  justifyContent : "center",
                  alignItems : "center",
                  fontSize : 32
                }}>
                  {window.localStorage.getItem("invitecode")}
                </div>
              </div>
              
              <button className={styles.selectGame} style={{
                gridRow : "2 / span 3",
                display : "flex",
                alignItems : "center",
                justifyContent : "center",
                marginRight : "4%"
              }} onClick={selectGame}><img src={Play} style={{width : "30%", height : "55%"}}></img>게임 선택</button>
              <button style={{
                display : "flex",
                alignItems : "center",
                justifyContent : "center",
                marginBottom : "2%"
              }} className={styles.infoGame}><Info style={{
                width : "20%",
                height : "45%"
              }} filter="invert(100%) sepia(100%) saturate(0%) hue-rotate(283deg) brightness(101%) contrast(104%)"/>설명서</button>
              <button style={{
                display : "flex",
                alignItems : "center",
                justifyContent : "center",
                marginTop: "2%"
              }} className={styles.inviteFriend}>
                <People style={{
                width : "20%",
                height : "45%",
              }} filter="invert(100%) sepia(100%) saturate(0%) hue-rotate(283deg) brightness(101%) contrast(104%)"/>
                친구 초대</button>
            </div>
        </div>) : (<div className={`${styles["chat-container"]} ${styles.game}`}>
                <>
                  <Chat
                    user={localUserRef.current}
                    mode={mode}
                    sub={subscribers}
                  />
                </>
            </div>)}
          
        </div>
          
      )}
    </div>
    
    </div>
  );
};

export default RoomContents;
