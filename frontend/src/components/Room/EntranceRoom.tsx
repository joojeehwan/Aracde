import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/navbar/Navbar';
import create from 'zustand';
import styles from './style/EntranceRoom.module.scss';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import RoomApi from '../../common/api/Room';
import { infoStore } from "../../components/Store/info"
import CharacterIcon from "../../assets/movingCharacter.gif"
const CreateRoom = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMic, setMic] = useState(true);
  const [isVideo, setVideo] = useState(true);
  const { invitecode } = infoStore()
  const [nickname, setNickname] = useState<any>(""); // 닉네임
  const [code, setCode] = useState<any>(invitecode); // 초대 코드
  console.log(invitecode)
  const { enterRoom } = RoomApi;

  const handleMic = () => {
    setMic((prev) => !prev);
  };
  const handleVideo = () => {
    if (videoRef && videoRef.current) {
      if (isVideo) {
        videoRef.current.pause();
        videoRef.current.src = '';
      } else {
        videoRef.current.play();
      }
    }
    setVideo((prev) => !prev);
  };
  const handleEnter = async () => {
    const response = await enterRoom(code as string);
    if (response.status === 200) {
      console.log('??????');
      window.localStorage.setItem('nickname', nickname);
      window.localStorage.setItem('invitecode', code);
      navigate('/room');
    }
  };
  const handleCancel = () => {
    navigate(`/`);
  };

  const handleNickname = (e: any) => {
    setNickname(e.target.value);
  };
  const handleCode = (e: any) => {
    setCode(e.target.value);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: isVideo, audio: isMic }).then((stream) => {
      if (videoRef && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <>
      <div className={styles.body}>
        <Navbar />
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <img 
              style={{ 
                width: 50,
                height: 50,
                marginRight: 30,
                }} 
              src={CharacterIcon} alt="움직이는 캐릭터" /> 
            <div>
              방 입장
            </div>
            <img 
            style={{ 
              width: 50,
              height: 50,
              marginLeft: 30
            }}
            src={CharacterIcon} alt="움직이는 캐릭터" />
          </div>
          <div className={styles.content}>
            <div className={styles.preferences}>
              <div className={styles.camera}>
                <video ref={videoRef} autoPlay={isVideo} muted={isMic}></video>
              </div>
              <div className={styles.cameraBtn}>
                {isMic ? (
                  <Button
                    variant="contained"
                    sx={{
                      width: 200,
                      height: 50,
                      m: 2,
                      backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'neodgm',
                      fontSize: '16px',
                    }}
                    onClick={handleMic}
                  >
                    <MicIcon />
                    &nbsp;음소거
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      width: 200,
                      height: 50,
                      m: 2,
                      backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'neodgm',
                      fontSize: '16px',
                    }}
                    onClick={handleMic}
                  >
                    <MicOffIcon />
                    &nbsp;음소거 해제
                  </Button>
                )}

                {isVideo ? (
                  <Button
                    variant="contained"
                    sx={{
                      width: 200,
                      height: 50,
                      backgroundColor: 'white',
                      color: 'black',
                      m: 2,
                      fontFamily: 'neodgm',
                      fontSize: '16px',
                    }}
                    onClick={handleVideo}
                  >
                    <VideocamIcon />
                    &nbsp;비디오 중지
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      width: 200,
                      height: 50,
                      backgroundColor: 'white',
                      color: 'black',
                      m: 2,
                      fontFamily: 'neodgm',
                      fontSize: '16px',
                    }}
                    onClick={handleVideo}
                  >
                    <VideocamOffIcon />
                    &nbsp;비디오 시작
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.controlPanel}>
              <div className={styles.form}>
                <div className={styles.nickname}>
                  <label htmlFor="nickname">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    autoFocus
                    value={nickname}
                    onChange={handleNickname}
                    className={styles.inputArea}
                  ></input>
                </div>

                <div className={styles.code}>
                  <label htmlFor="inviteCode">초대코드</label>
                  <input 
                    type="text" 
                    id="inviteCode" 
                    value={code} 
                    onChange={handleCode} 
                    className={styles.inputArea}
                  ></input>
                </div>
              </div>
              <div className={styles.buttonSet}>
                <button 
                  className={styles.buttonEnter}
                  onClick={handleEnter}>
                  입장!
                </button>
                <button 
                  className={styles.buttonCancle}
                  onClick={handleCancel}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoom;
