import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/navbar/Navbar';
import styles from './style/MyRoom.module.scss';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Room from '../../common/api/Room';
const MyRoom = () => {
  const { getProfile } = Room;

  const [activeTab, setActiveTab] = useState<any>(0);
  const [email, setEmail] = useState<any>('');
  const [name, setName] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [gameResDtos, setGameResDtos] = useState<any>([]); // 참여한 모든 게임 정보
  const [gameCode, setGameCode] = useState<any>(''); // 참여한 게임 코드
  const [gameCnt, setGameCnt] = useState<any>(0); // 게임 참여 횟수
  const [vicCnt, setVicCnt] = useState<any>(0); // 맞춘 정답 개수

  const clickHandler = (id: number) => {
    setActiveTab(id);
  };

  const getProfileInfo = async () => {
    const response = await getProfile();
    if (response.status === 200) {
      setEmail(response.email);
      setName(response.name);
      setImage(response.image);
      setGameResDtos(response.gameResDtos);
      setGameCnt(response.totalGameCnt);
      setVicCnt(response.totalVicCnt);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.tab}>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: 150,
            }}
            onClick={() => {
              clickHandler(0);
            }}
          >
            History
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: 150,
            }}
            onClick={() => {
              clickHandler(1);
            }}
          >
            My Picture
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.profileImg}>
            <Avatar src={image} alt="profile img" sx={{ width: 150, height: 150 }} />
          </div>
          <div className={styles.profile}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th>이메일</th>
                  <td>{email}</td>
                </tr>
                <tr>
                  <th>이 름</th>
                  <td>{name}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.profileGameInfo}>
            <div className={styles.count}>
              <h1>게임 참여 횟수</h1>
              <h1>{gameCnt} 번</h1>
            </div>
            <div className={styles.answer}>
              <h1>정답 맞춘 개수</h1>
              <h1>{vicCnt} 개</h1>
            </div>

            <div className={styles.mvp}>
              <h1>Best Friend : ? 이건 뭔지 모르겠음</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyRoom;
