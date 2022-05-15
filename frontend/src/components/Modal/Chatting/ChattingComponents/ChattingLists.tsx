import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Chatting.module.scss';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { modalStore } from '../../store/modal';
import ChatApi from '../../../../common/api/ChatAPI';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { getToken } from '../../../../common/api/jWT-Token';

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

function ChattingLists({
  name,
  content,
  time,
  roomId,
  client,
  image,
  privateChats,
  setPrivateChats,
  scrollbarRef,
  setIsShow,
  login,
  handleSubscribe,
  unsub,
  handleChatBell,
}: any) {
  const [subList, setSubList] = useState<any>([]);
  const subListRef = useRef(subList);
  subListRef.current = subList;
  const [newTime, setNewTime] = useState(dayjs(time));
  const [isOnline, setIsOnline] = useState(login);
  const { romId, setRoomId, setHistory } = modalStore();
  const [lastMessage, setLastMessage] = useState<string>(content);
  const { enterChatRoom, fetchWithToken } = ChatApi;

  const enterChattingRoom = async () => {
    const result = await enterChatRoom(roomId);
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom();
    }
    setHistory(result.data);
  };

  const savePrivateChats = (data: any) => {
    setPrivateChats(data);
  };

  const onClickSetShow = () => {
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom();
    }
    setIsShow(true);
  };

  const subscribe = () => {
    const list = [];
    list.push(
      client.current.subscribe(`/sub/chat/room/${roomId}`, ({ body }: any) => {
        const data = JSON.parse(body);
        setLastMessage(data.content);
        setNewTime(data.realTime);
        if (scrollbarRef.current) {
          scrollbarRef.current.scrollToBottom();
        }
      }),
    );
    // 정리 // 불변성유지, subList안의 배열 유지하면서, 새롭게 list를 추가
    setSubList([...subListRef.current, list]);
  };

  const subscribeDef = async () => {
    //정리
    // 내가 했던 고민,,?! 다른 걸 클릭하면 그 이전에 가리키고 있는건 사라질텐데
    // 이전에 담긴것을 어떻게 지우나?!
    // subscrption은 하나의 값만 담기게 된다. so subscribeDef를 누름가 동시에 index(부모)에
    // 있는 subscrption은의 값을 지우는 메서드를 실행
    // unsub하고 다시 클릭하면 새로운걸 구독하게 되니깐,,,! 클릭한번으로 구취 구독을 같이 할 수 있게 된다.
    // 클릭(구취 => 구독 => 구독의 정보 저장)
    unsub();

    //정리 렌더링 두번 해결,, 현우박 대단하다,,,
    setPrivateChats(new Map());
    let res;
    res = await client.current.subscribe(`/sub/chat/room/detail/${roomId}`, ({ body }: any) => {
      const payloadData = JSON.parse(body);
      if (privateChats.get(payloadData.chatRoomSeq)) {
        privateChats.get(payloadData.chatRoomSeq).push(payloadData);
        savePrivateChats(new Map(privateChats));
        console.log(payloadData);
        if (scrollbarRef.current) {
          scrollbarRef.current.scrollToBottom();
        }
      } else {
        let lst = [];
        lst.push(payloadData);
        privateChats.set(payloadData.chatRoomSeq, lst);
        savePrivateChats(new Map(privateChats));
        if (scrollbarRef.current) {
          scrollbarRef.current.scrollToBottom();
        }
      }
    });
    handleSubscribe(res);
    handleChatBell(); // 알람이 울리게 된다
  };

  useEffect(() => {
    subscribe();
    return () => {
      subListRef.current.forEach((topic: any, i: number) => {
        topic[i].unsubscribe();
      });
    };
  }, [roomId]);

  return (
    <div
      id="trigger"
      className={styles.onFocus}
      style={{ display: 'flex', cursor: 'pointer', marginBottom: '20px', width: '250px' }}
      onClick={() => {
        subscribeDef();
        enterChattingRoom();
        setRoomId(roomId);
        onClickSetShow();
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
      <div style={{ maxWidth: '90px' }}>
        <div style={{ marginTop: '10px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <span className={styles.lastMessage} style={{ color: '#B6A7A7', marginLeft: '10px', marginTop: '5px' }}>
          {lastMessage}
        </span>
      </div>
      <div>
        <div style={{ position: 'absolute', marginLeft: '-1px' }}>
          {time === null ? null : (
            <div style={{ fontSize: '15px', color: '#B6A7A7' }}>{dayjs(newTime).format('MM월DD일 h:mm A')}</div>
          )}
          {/* <div className={styles.count}>{unreads}</div> */}
        </div>
      </div>
    </div>
  );
}

export default ChattingLists;
