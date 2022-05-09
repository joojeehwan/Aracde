import React, { useEffect, useState } from 'react';
import styles from '../../styles/Chatting.module.scss';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { modalStore } from "../../store/modal"
import ChatApi from "../../../../common/api/ChatAPI"
import dayjs from 'dayjs';

const StyledBadgeOnline = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
const StyledBadgeOffline = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#f8f8f8',
    color: '#f8f8f8',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

let subscription: any = 0;
function ChattingLists({ name, content, time, chatChange, roomId, client, setChatMessages, image, privateChats, setPrivateChats, scrollbarRef, setIsShow, chat }: any) {
  const [isOnline, setIsOnline] = useState(true);
  const { romId, setRoomId, setHistory } = modalStore()
  const [lastMessage, setLastMessage] = useState<string>(content)
  // const [lastTime, setLastTime] = useState<string>(time)
  const { enterChatRoom } = ChatApi

  const enterChattingRoom = async () => {
    const result = await enterChatRoom(roomId)
    scrollbarRef.current.scrollToBottom()
    setHistory(result)
  }

  const onClickSetShow = () => {
    setIsShow(true)
  }

  let subList: any[] = [];
  // 리스트 분리하자

  const subscribe = () => {
    subList.push(client.current.subscribe(`/sub/chat/room/${roomId}`, ({ body }: any) => {
      const data = JSON.parse(body)
      setLastMessage(data.content)
      // setLastTime(data.time);
      scrollbarRef.current.scrollToBottom()
    }));
  };

  const subscribeDef = () => {
    subscription = client.current.subscribe(`/sub/chat/room/detail/${roomId}`, ({ body }: any) => {
      const payloadData = JSON.parse(body)
      if (privateChats.get(payloadData.chatRoomSeq)) {
        privateChats.get(payloadData.chatRoomSeq).push(payloadData)
        setPrivateChats(new Map(privateChats))
        scrollbarRef.current.scrollToBottom()
      } else {
        let lst = []
        lst.push(payloadData)
        privateChats.set(payloadData.chatRoomSeq, lst)
        setPrivateChats(new Map(privateChats))
        scrollbarRef.current.scrollToBottom()
      }
    });

  };

  const unsubscribe = () => {
    if (subscription !== 0) {
      subscription.unsubscribe();
    }
  };

  useEffect(() => {
    subscribe();
    console.log("이거 되냐?!")
    window.document.getElementById("trigger")?.click()
    return () => {
      subList.forEach(topic => topic.unsubscribe());
      // client.current.unsubscribe();
    };
  }, [roomId]);



  const newTime = dayjs(time)

  return (
    <div
      id="trigger"
      className={styles.onFocus}
      style={{ display: 'flex', cursor: 'pointer', marginBottom: '20px', width: '250px' }}
      onClick={() => {
        console.log("이거 찍힌거지?!")
        unsubscribe()
        subscribeDef()
        enterChattingRoom()
        setRoomId(roomId)
        scrollbarRef.current.scrollToBottom()
        onClickSetShow()
      }}
    >
      <div style={{ marginLeft: '-35px' }}>
        {isOnline ? (
          <StyledBadgeOnline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" src={image} sx={{ width: 56, height: 56 }} />
          </StyledBadgeOnline>
        ) : (
          <StyledBadgeOffline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" src={image} sx={{ width: 56, height: 56 }} />
          </StyledBadgeOffline>
        )}
      </div>
      <div>
        <div style={{ marginTop: '10px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <div style={{ color: '#B6A7A7', marginLeft: '10px', marginTop: '5px', maxWidth: '170px' }}>{lastMessage}</div>
      </div>
      <div>
        <div style={{ position: 'absolute', marginLeft: '-1px' }}>
          <div style={{ fontSize: '15px', color: '#B6A7A7' }}>{dayjs(newTime).format('MM월DD일 h:mm A')}</div>
          {/* <div className={styles.count}>{unreads}</div> */}
        </div>
      </div>
    </div>
  );
}

export default ChattingLists;
