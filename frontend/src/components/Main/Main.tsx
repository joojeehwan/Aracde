import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style/Main.module.scss';
import { ReactComponent as Users } from '../../assets/users.svg';
import { ReactComponent as Bell } from '../../assets/bell-ring.svg';
import RoomCreate from './Modal/RoomCreate';
import ContentFirst from './ContentFirst';
import Alarms from '../Modal/Alarms';
import Friends from '../Modal/Friends/Friends';

function Main() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const navigate = useNavigate();

  //지환 코드
  const [alarmsIsOpen, setAlarmsIsOpen] = useState<boolean>(false);
  const [friendsIsOpen, setFriendsIsOpen] = useState<boolean>(false);

  const handleOpenAlarms = useCallback(() => {
    setAlarmsIsOpen(true);
  }, [alarmsIsOpen]);

  const handleCloseAlarms = useCallback(() => {
    setAlarmsIsOpen(false);
  }, [alarmsIsOpen]);

  const handleOpensFriends = useCallback(() => {
    setFriendsIsOpen(true);
  }, []);

  const handleCloseFriends = useCallback(() => {
    setFriendsIsOpen(false);
  }, []);

  const handleOpenCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleCloseCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(false);
  };
  const handleEnterRoom = (e: React.MouseEvent) => {
    // navigate 시켜줘야함 -> 방 입장 설정 페이지
    console.log('눌렸음');
  };

  const handleClickLogout = (e: React.MouseEvent) => {
    // here localstorage clean
    setIsLogin(false);
  };
  // 임시 메서드
  const handleClickLogin = (e: React.MouseEvent) => {
    console.log('here');
    // navigate login page here
    setIsLogin(true);
  };
  const handleClickMyPage = (e: React.MouseEvent) => {
    // navigate mypage here
    console.log('hererererererere');
  };

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      setIsLogin(true);
    }
  }, []);
  return (
    <>
      <div className={styles.main}>
        <div
          className={styles.nav}
          onClick={() => {
            console.log('여기');
          }}
        >
          {isLogin ? (
            <>
              <button onClick={handleClickLogout}>LOGOUT</button>
              <button onClick={handleClickMyPage}>MYPAGE</button>
              <Bell
                className={styles.button}
                onClick={handleOpenAlarms}
                style={{
                  width: 28,
                  height: 28,
                  float: 'right',
                  marginTop: '2%',
                  marginRight: '2%',
                }}
                filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
              />
              <Users
                className={styles.button}
                onClick={handleOpensFriends}
                style={{
                  width: 28,
                  height: 28,
                  float: 'right',
                  marginTop: '2%',
                  marginRight: '2%',
                }}
                filter="invert(100%) sepia(17%) saturate(9%) hue-rotate(133deg) brightness(102%) contrast(103%)"
              />
            </>
          ) : (
            <button onClick={handleClickLogin}>LOGIN</button>
          )}
        </div>
        <div className={styles.glass}>
          <p className={styles.glitch} data-text="Arcade">
            Arcade
          </p>
          <button className={styles.button} onClick={handleOpenCreateRoom}>
            방 만들기
          </button>
          <button className={styles.button} onClick={handleEnterRoom}>
            입장하기
          </button>
          {open ? <RoomCreate open={open} onClose={handleCloseCreateRoom} /> : null}
          {alarmsIsOpen ? <Alarms open={alarmsIsOpen} onClose={handleCloseAlarms} /> : null}
          {friendsIsOpen ? <Friends open={friendsIsOpen} onClose={handleCloseFriends} /> : null}
        </div>
      </div>
      <div className={styles.contentbox}>
        <ContentFirst />
      </div>
    </>
  );
}

export default Main;
