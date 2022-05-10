import React from "react";
import styles from "../style/StreamComponent.module.scss";
import OvVideoComponent from "./OvVideo";
// import YangGameComponent from ".././game/YangGameComponent";

import MicOff from "@mui/icons-material/MicOff";
import Mic from "@mui/icons-material/Mic";
import Videocam from "@mui/icons-material/Videocam";
import VideocamOff from "@mui/icons-material/VideocamOff";
import { useState, useEffect } from "react";
import ToolbarComponent from "../toolbar/ToolbarComponent";
// import { ReactComponent as SirenIcon } from "../../../assets/icons/siren.svg";

function StreamComponent({
  user,
  sessionId,
  camStatusChanged,
  micStatusChanged,
  mode,
  openKeywordInputModal,
  nickname,
  correctNickname,
  sirenWingWing,
} : any) {
  console.log(user);
  const [mutedSound, setMuted] = useState(false);
  const [controlBox, setControl] = useState(false);
  const [bgcolor, setBgcolor] = useState("");
  const [bgothercolor, setBgothercolor] = useState("");
  const [myNickname, setMyNickname] = useState("");
  const [myCorrectNickname, setMyCorrectNickname] = useState("");

  const color = [
    "#adeac9",
    "#ff98ad",
    "#abece7",
    "#ffff7f",
    "#FFC0CB",
    "#FFEB46",
    "#EE82EE",
    "#B2FA5C",
    "#a3c9f0",
    "#e3ae64",
    "#a1e884",
    "#84e8c5",
    "#ceb1e3",
    "#e3b1d2",
    "#e3b1b1",
    "#d4ff8f",
    "#98ff8f",
    "#b6f0db",
    "#b6e3f0",
    "#f288e9",
    "#adeac9",
    "#ff98ad",
    "#abece7",
    "#ffff7f",
    "#FFC0CB",
    "#FFEB46",
    "#EE82EE",
    "#B2FA5C",
    "#a3c9f0",
    "#e3ae64",
    "#a1e884",
    "#84e8c5",
    "#ceb1e3",
    "#e3b1d2",
    "#e3b1b1",
    "#d4ff8f",
    "#98ff8f",
    "#b6f0db",
    "#b6e3f0",
    "#f288e9",
  ];

  console.log("stream render");
  const handleChangeControlBox = (e : any) => {
    setControl(!controlBox);
    e.preventDefault();
  };

  useEffect(() => {
    if (nickname !== "" && nickname !== undefined) {
      for (let i = 0; i < nickname.length; i++) {
        console.log(nickname);
        if (
          user.getStreamManager().stream.streamId === nickname[i].connectionId
        ) {
          setMyNickname(nickname[i].keyword);
        }
      }
      if (nickname.length === 0) {
        setMyNickname("");
      }
    }
  }, [nickname]);

  useEffect(() => {
    if (correctNickname !== "" && correctNickname !== undefined) {
      console.log(correctNickname, "correctNickname");
      for (let i = 0; i < correctNickname.length; i++) {
        if (
          user.getStreamManager().stream.streamId ===
          correctNickname[i].connectionId
        ) {
          setMyCorrectNickname(correctNickname[i].keyword);
        }
      }
      if (correctNickname.length === 0) {
        setMyCorrectNickname("");
      }
    }
  }, [correctNickname]);

  useEffect(() => {
    let bgindex = Math.floor(Math.random() * 39);
    let bgotherindex = Math.floor(Math.random() * 39);
    setBgcolor(color[bgindex]);
    setBgothercolor(color[bgotherindex]);
  }, []);

//   const handleSiren = (target) => {
//     sirenWingWing(target);
//   };
//   const handleSubmitKeyword = (nextmode) => {
//     openKeywordInputModal(nextmode);
//   };

  return (
    <div
      className={
        mode === "snapshot"
          ? `${styles["video-innerContainer"]} ${styles.snapshotMode}`
          : styles["video-innerContainer"]
      }
      style={user.isSpeaking() ? {
        border : "1px solid red"
      } : {}}
    >
      <div className={styles.nickname}>
        <span id={styles.nickname}>{user.getNickname()}</span>
      </div>
      {user !== undefined && user.getStreamManager() !== undefined ? (
        <div
          className={styles.streamComponent}
          
        >
          <OvVideoComponent user={user} mutedSound={mutedSound} />
            <>
              <div
                className={
                  mode === "snapshot"
                    ? `${styles.controlbox} ${styles.snapshotMode}`
                    : styles.controlbox
                }
              >
                {sessionId ? (
                  <ToolbarComponent
                    sessionId={sessionId}
                    user={user}
                    camStatusChanged={camStatusChanged}
                    micStatusChanged={micStatusChanged}
                  ></ToolbarComponent>
                ) : null}
              </div>

              <div id={styles.statusIcons}>
                {sessionId ? null : !user.isVideoActive() ? (
                  <div id={styles.camIcon}>
                    <VideocamOff id={styles.statusCam} color="secondary" />
                  </div>
                ) : null}

                {sessionId ? null : !user.isAudioActive() ? (
                  <div id={styles.micIcon}>
                    <MicOff id={styles.statusMic} color="secondary" />
                  </div>
                ) : null}
              </div>
            </>
        </div>
      ) : null}
    </div>
  );
}
export default StreamComponent;