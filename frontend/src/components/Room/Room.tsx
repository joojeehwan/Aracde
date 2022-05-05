import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./style/Room.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "./store";
import { infoStore } from "../Store/info";
import RoomContents from "./RoomContents";
// import LoadingSpinner from "../Modals/LoadingSpinner/LoadingSpinner";
// import RoomApi from "../../api/RoomApi";

// import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
// import { ReactComponent as GameIcon } from "../../assets/icons/game.svg";
// import { ReactComponent as RegistMusicIcon } from "../../assets/icons/library.svg";
// import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
// import { ReactComponent as SongIcon } from "../../assets/icons/microphone.svg";

// import LoginStatusContext from "../../contexts/LoginStatusContext";
// import NameContext from "../../contexts/NameContext";
// import VideoMicContext from "../../contexts/VideoMicContext";
// import RegistMusic from "../Modals/RegistMusic/RegistMusic";
// import GameList from "../Modals/Game/GameList";

// import Youtube from "../../api/Youtube";
// import SessionIdContext from "../../contexts/SessionIdContext";
// import BangZzangContext from "../../contexts/angZzangContext";
// import KaraokeList from "../Modals/Karaoke/KaraokeList";
// import RoomContentsGrid from "./RoomContentsGrid";

// const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);


const Room = () => {
  const {sessionId, setSessionId} = useStore();
  // const {nickname, invitecode, setNick} = infoStore();
//   const { setLoginStatus } = useContext(LoginStatusContext);
//   const { myVMstate } = useContext(VideoMicContext);
  // const { myName } = useContext(NameContext);
  // const [myName, setMyName] = useState<string>(nickname);
  const myName = window.localStorage.getItem("nickname");
  
  const [mode, setMode] = useState("basic");
  const [contentTitle, setContentTitle] = useState("");
  const [onGameList, setOnGameList] = useState(false);
  const [onKaraokeList, setOnKaraokeList] = useState(false);
  const [onRegistMusic, setOnRegistMusic] = useState(false);
  const [gameId, setGameId] = useState("");
  const [singMode, setSingMode] = useState(1);
  const [roomTitle, setRoomTitle] = useState("");
//   const { setbangZzang } = useContext(BangZzangContext);

  // const [roomseq, setRoomseq] = useState<string>(invitecode);
  const roomseq = window.localStorage.getItem("invitecode");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    console.log("???왜 사라짐??");
    if(myName === null){
      navigate('/');
    }
    if(roomseq === null){
      navigate('/');
    }
  }, []);


  return (
    <div className={styles.container}>
      {/* {loading ? <LoadingSpinner></LoadingSpinner> : null} */}
      <div className={styles.nav}>
        <button className={styles.link}>
          EXIT
        </button>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.contents}>
          <div className={styles.title}>
            <h1>{contentTitle}</h1>
          </div>
          <div className={styles["main-contents"]}>
            <RoomContents
              sessionName={roomseq}
              userName={myName}
            />
          </div>
        </div>
      </div>
      {/* <div className={styles.dockBar}>
        <div className={styles.dock}>
          <HomeIcon
            width="50"
            height="50"
            className={styles.icon}
            onClick={handleHomeClick}
          />
          <CameraIcon
            width="50"
            height="50"
            className={styles.icon}
            onClick={handleCameraClick}
          />
          <GameIcon
            width="50"
            height="50"
            fill="#eee"
            className={styles.icon}
            onClick={handleGameList}
          />
          <SongIcon
            width="50"
            height="50"
            fill="#eee"
            onClick={handleKaraokeList}
            className={styles.icon}
          />
          <RegistMusicIcon
            width="50"
            height="50"
            fill="#eee"
            onClick={handleRegistMusic}
            className={styles.icon}
          />
        </div>
      </div> */}

      {/* 카메라 기능 */}
      {/* <CameraIcon onClick={handleCameraClick} /> */}
      {/* <GameList
        open={onGameList}
        onClose={handleModalClose}
        onChange={handleGameModeChange}
      />
      <KaraokeList
        open={onKaraokeList}
        onClose={handleModalClose}
        onChange={handleKaraokeModeChange}
      />
      <RegistMusic
        open={onRegistMusic}
        onClose={handleModalClose}
        onSubmit={handleMusicSearch}
        // onChange={handleModeChange}
      /> */}
    </div>
  );
};

export default Room;