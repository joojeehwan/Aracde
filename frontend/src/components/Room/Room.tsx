import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import styles from "./style/Room.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "./store";
import { infoStore } from "../Store/info";
import RoomContents from "./RoomContents";
//chat
import { ReactComponent as Chatt } from '../../assets/Modal/chat.svg';
import Chatting from "../Modal/Chatting";
import useSWR from 'swr';
import { getToken } from '../../../src/common/api/jWT-Token';
import ChatAPI from '../../common/api/ChatAPI';

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
  const { sessionId, setSessionId, clientt } = useStore();
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

  //chat
  const [chattingIsOpen, setChattingIsOpen] = useState<boolean>(false);
  const { fetchWithToken } = ChatAPI

  const handleOpenChatting = useCallback(() => {
    setChattingIsOpen(true);
  }, [chattingIsOpen]);

  const handleCloseChatting = useCallback(() => {
    setChattingIsOpen(false);
  }, [chattingIsOpen]);

  useEffect(() => {
    console.log("???왜 사라짐??");
    if (myName === null) {
      navigate('/');
    }
    if (roomseq === null) {
      navigate('/');
    }
  }, []);

  console.log(clientt)

  return (
    <div className={styles.container}>
      {/* {loading ? <LoadingSpinner></LoadingSpinner> : null} */}
      <div className={styles.nav}>
        {
          window.localStorage.getItem("token") &&
          <Chatt
            className={styles.link}
            onClick={handleOpenChatting}
            style={{
              margin: "20px",
              width: 60,
              height: 60,
              position: "fixed",
              right: "0px",
              // bottom: "0px"
            }}
            filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
          />
        }
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
      {chattingIsOpen ? (
        <Chatting open={chattingIsOpen} onClose={handleCloseChatting} client={clientt} />
      ) : null}
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