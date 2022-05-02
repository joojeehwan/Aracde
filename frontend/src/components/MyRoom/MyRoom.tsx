import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/navbar/Navbar';
import styles from './style/MyRoom.module.scss';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const MyRoom = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [answer, setAnswer] = useState(0);

  // const clickHandler = (id: number) => {
  //   setActiveTab(id);
  // };

  return (
    <div className={styles.body}>
      <Navbar />
      {/* <div className={styles.wrapper}>
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
            <Avatar src="" alt="profile img" sx={{ width: 150, height: 150 }} />
          </div>
          <div className={styles.profile}>
            <table className={styles.table}>
              <tr>
                <th>이메일</th>
                <td>{email}</td>
              </tr>
              <tr>
                <th>이 름</th>
                <td>{name}</td>
              </tr>
            </table>
          </div>

          <div className={styles.profileGameInfo}>
            <div className={styles.count}>
              <h1>게임 참여 횟수</h1>
              <h1>{count} 번</h1>
            </div>
            <div className={styles.answer}>
              <h1>정답 맞춘 개수</h1>
              <h1>{answer} 개</h1>
            </div>

            <div className={styles.mvp}>
              <h1>Best Friend : ? 이건 뭔지 모르겠음</h1>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default MyRoom;
