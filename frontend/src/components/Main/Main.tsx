import React, { useEffect, useRef, useState } from 'react';
import styles from './style/Main.module.scss';
import RoomCreate from './Modal/RoomCreate';
import Content from './Content';
import Arrow from '../../assets/next.png';
import { ReactComponent as Users } from '../../assets/users.svg';
import { ReactComponent as Bell } from '../../assets/bell-ring.svg';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

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
  const handleClickTop = (e : React.MouseEvent) => {
    if(divRef.current !== null){
      window.scrollBy({top : divRef.current.getBoundingClientRect().top, behavior : 'smooth'});
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      setIsLogin(true);
    }
  }, []);
  return (
    <>
    <div ref={divRef} className={styles.scroll}>
      <div className={styles.nav}>
          {isLogin ? (
            <>
              <button onClick={handleClickLogout}>LOGOUT</button>
              <button onClick={handleClickMyPage}>MYPAGE</button>
              <Bell
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
        <div className={styles.main}>    
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
        </div>
        <div className={styles.contentbox}>
          <Content type={0}/>
          <Content type={1}/>
          <div className={styles.desc}>
            다같이&nbsp; <p style={{color : "#FFF800"}}>Arcade</p>의 세계로
            <br/>
            <p>빠져볼까요?</p>
          </div>
        </div>
        <div style={{
          width : "inherit",
          height : "fit-content",
          display : "flex",
          justifyContent : "center"
        }}>
          <button className={styles.btn} onClick={handleClickTop}>
            <img style={{
              width : 60,
              height : 60
            }} src={Arrow}></img>
          </button>
        </div>
      </div>
      </div>
    </>
  );
}

export default Main;
