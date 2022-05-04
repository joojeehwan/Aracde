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
import Room from '../../common/api/Room';

const CreateRoom = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMic, setMic] = useState(true);
  const [isVideo, setVideo] = useState(true);

  const [nickname, setNickname] = useState(''); // 닉네임
  const [code, setCode] = useState(''); // 초대 코드

  const { enterRoom } = Room;

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
    if (response.data.statusCode === 200) {
      navigate(`/ready`);
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
          <h1 className={styles.header}>
            <img src="../src/assets/character.png" alt="" /> 방 입장
          </h1>
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
            <div>
              <div className={styles.form}>
                <div className={styles.nickname}>
                  <label htmlFor="nickname">닉네임</label>
                  <input
                    type="text"
                    id="nickname"
                    autoFocus
                    value={nickname}
                    onChange={handleNickname}
                    className={styles.gray}
                  ></input>
                </div>

                <div className={styles.code}>
                  <label htmlFor="inviteCode">초대코드</label>
                  <input type="text" id="inviteCode" value={code} onChange={handleCode} className={styles.gray}></input>
                </div>
              </div>

              <div className={styles.button}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    width: 250,
                    height: 80,
                    fontSize: '32px',
                    m: 2,
                    p: 1,
                    fontFamily: 'neodgm',
                  }}
                  onClick={handleEnter}
                >
                  입장!
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    width: 250,
                    height: 80,
                    fontSize: '32px',
                    m: 2,
                    p: 1,
                    fontFamily: 'neodgm',
                  }}
                  onClick={handleCancel}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoom;
