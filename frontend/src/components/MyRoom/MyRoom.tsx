import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/navbar/Navbar';
import create from 'zustand';
import styles from './style/MyRoom.module.scss';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const useStore = create((set) => ({
  activeTab: 0, // 탭 번호
  email: 'kimms4142@naver.com', // 이메일
  name: '김명섭', // 이름
  count: 0, // 게임 참여 횟수
  answer: 0, // 정답 맞춘 개수
  setActiveTab: (input: number) => set({ activeTab: input }),
  setEmail: (input: string | null) => set({ email: input }),
  setName: (input: string | null) => set({ name: input }),
  setCount: () => set((state) => ({ count: state.count + 1 })),
  setAnswer: () => set((state) => ({ answer: state.answer + 1 })),
}));

const MyRoom = () => {
  const { activeTab, email, name, count, answer, setActiveTab, setEmail, setName, setCount, setAnswer } = useStore();

  const clickHandler = (id: number) => {
    setActiveTab(id);
  };

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
      </div>
    </div>
  );
};
export default MyRoom;
