import React, { useCallback, useState } from 'react';
import styles from '../styles/Friends.module.scss';
import FriendsList from './FriendsList';
import FriendsSeachBar from './FriendsAdd/FriendsSearhBar';
import FriendsSearchResults from './FriendsAdd/FriendsSearchResults';

interface MyProps {
  open: boolean;
  onClose: (e: any) => void;
}

const friend = [
  { name: '주지환', imageUrl: 'https://picsum.photos/200' },
  { name: '홍승기', imageUrl: 'https://picsum.photos/200' },
];

function Friends({ open, onClose }: MyProps) {
  const [label, setLabel] = useState([]);
  const [number, setNum] = useState([]);
  const [tab, setTab] = useState(0);

  const handletab = useCallback(
    (value: any) => {
      setTab(value);
    },
    [tab],
  );

  const stopEvent = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const rendertab = (value: any) => {
    if (value >= 0 && value < 5 && friend[value]) {
      return (
        <div className={styles.friendList}>
          {value === 0 ? (
            <div className={styles.friendListContainer}>
              {friend.map((value) => {
                return <FriendsList key={value.name} imgUrl={value.imageUrl} name={value.name} />;
              })}
            </div>
          ) : (
            <div className={styles.friendAddContainer}>
              <FriendsSeachBar />
              {friend.map((value) => {
                return <FriendsSearchResults key={value.name} imgUrl={value.imageUrl} name={value.name} />;
              })}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={`${styles.openModal} ${styles.modal}`} onClick={onClose}>
      <div onClick={stopEvent}>
        <ul className={styles.tabs}>
          <li className={`${tab === 0 ? styles.active : ''}`} onClick={() => handletab(0)}>
            친구 목록
          </li>
          <li className={`${tab === 1 ? styles.active : ''}`} onClick={() => handletab(1)}>
            친구 추가
          </li>
        </ul>
        {rendertab(tab)}
      </div>
    </div>
  );
}

export default Friends;
