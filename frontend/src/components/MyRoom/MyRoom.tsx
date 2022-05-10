import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/navbar/Navbar';
import styles from './style/MyRoom.module.scss';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import UserApi from '../../common/api/UserApi';
import GameDoughnutChart from './chart/GameDoughnutChart';
import WinDoughnutChart from './chart/WinDoughnutChart';
import MyPicture from "./MyPicture";

const MyRoom = () => {
  const { getProfile } = UserApi;

  const [activeTab, setActiveTab] = useState<any>(0);
  const [email, setEmail] = useState<any>('');
  const [name, setName] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [gameCode, setGameCode] = useState<any>(''); // 참여한 게임 코드
  const [totalGameCnt, setTotalGameCnt] = useState<number>(0); // 게임 총 참여 횟수
  const [gameCnts, setGameCnts] = useState<number[]>([]);
  const [totalVicCnt, setTotalVicCnt] = useState<number>(0); // 맞춘 총 정답 개수
  const [vicCnts, setVicCnts] = useState<number[]>([]);
  const [pictures, setPictures] = useState<String[]>([]);

  const clickHandler = (id: number) => {
    setActiveTab(id);
  };

  const getProfileInfo = async () => {
    const response = await getProfile();
    if (response.status === 200) {
      setEmail(response.data.email);
      setName(response.data.name);
      setImage(response.data.image);
      setTotalGameCnt(response.data.totalGameCnt);
      setTotalVicCnt(response.data.totalVicCnt);
      const pictures = response.data.pictureResDtos;
      const gameRes = response.data.gameResDtos;
      gameRes.forEach((x:any) => {
        const game = x["gameCnt"]
        const vic = x["vicCnt"]
        setGameCnts((current) => [game, ...current]);
        setVicCnts((current) => [vic, ...current]);
      });
      pictures.forEach((x:any) => {
        const picture = x.pictureUrl
        setPictures((current) => [picture, ...current]);
      });
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
          <div className={styles.profileContent}>
            <div className={styles.profileImg}>
              <Avatar src={image} alt="profile img" sx={{ width: 150, height: 150 }} />
            </div>
            <div className={styles.profile}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>이메일: </th>
                    <td>{email}</td>
                  </tr>
                  <tr>
                    <th>이 름: </th>
                    <td>{name}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          { activeTab === 0 ? (
            <div className={styles.profileGameInfo}>
              <div className={styles.count}>
                <h2>총 게임 참여 횟수: {totalGameCnt}</h2>
                {totalGameCnt !== 0 ? (
                  <GameDoughnutChart 
                    gameCnt={gameCnts}
                    totalGame={totalGameCnt}
                    />): (
                  <h4>아직 참여한 게임이 없어요</h4>
                  )}
              </div>
              <div className={styles.answer}>
                <h2>정답 맞춘 개수: {totalVicCnt}</h2>
                {totalVicCnt !== 0 ? (
                  <WinDoughnutChart
                    vicCnt={vicCnts}
                    totalVic={totalVicCnt} 
                    />): (
                  <h4>아직 승리한 이력이 없어요</h4>
                  )}
              </div>
            </div>
            ) : (
              <MyPicture pictures={pictures} />
            )}
        </div>
      </div>
    </div>
  );
};
export default MyRoom;
