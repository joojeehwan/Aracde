import React from 'react';
import create from 'zustand';
import styles from './styles/MyRoom.module.scss';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
const useStore = create((set) => ({
  activeTab: 0, // 탭 번호
  email: '', // 이메일
  name: '', // 이름
  count: 0, // 게임 참여 횟수
  answer: 0, // 정답 맞춘 개수
  setActiveTab: (input: number) => set({activeTab : input}),
  setEmail: (input: string | null) => set({ email: input }),
  setName: (input: string | null) => set({ name: input }),
  setCount: () => set((state) => ({ count: state.count + 1 })),
  setAnswer: () => set((state) => ({ answer: state.answer + 1 })),
}));

const MyRoom = () => {
  const { activeTab, email, name, count, answer,setActiveTab, setEmail, setName, setCount, setAnswer } = useStore();

  // clickHandler = (id) => {
  //   setActiveTab(id);
  // }
  return (
    <div className={styles.wrapper}>
      <ul>
        <li onClick={() => this.clickHandler(0)}>history</li>
        <li onClick={() => this.clickHandler(1)}>내 그림들</li>
      </ul>
      <div className={styles.content}>
        <div className={styles.profileImg}>
          <Avatar src="" alt="profile img" sx={{ width: 150, height: 150 }} />
        </div>
        <div className={styles.profile}>
          <h1>이메일 : {email}</h1>
          <h1>이름 : {name}</h1>
        </div>

        <div className={styles.profileGameInfo}>
          <div>
            <h1>게임 참여 횟수</h1>
            <h1>{count}</h1>
          </div>
          <div>
            <h1>정답 맞춘 개수</h1>
            <h1>{answer}</h1>
          </div>
          <h1>베스트 프렌드 : ? 이건 뭔지 모르겠음</h1>
        </div>
      </div>
    </div>
  );
};
export default MyRoom;
