import React, { useEffect, useState } from 'react';
import styles from '../../styles/Chatting.module.scss';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

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

function ChattingLists({ name, content, time, chatChange, roomId, client, setChatMessages }: any) {
  const [isOnline, setIsOnline] = useState(true);

  const subscribe = () => {
    client.current.subscribe(`/sub/chat/detail/${roomId}`, ({ body }: any) => {
      setChatMessages((_chatMessages: any) => [..._chatMessages, JSON.parse(body)]);
    });
  };

  useEffect(() => {
    subscribe();
    return () => {
      client.current.subscribe();
    };
  }, [roomId]);

  return (
    <div
      className={styles.onFocus}
      style={{ display: 'flex', cursor: 'pointer', marginBottom: '20px', width: '250px' }}
      onClick={() => {
        console.log(roomId);
        chatChange(roomId - 1);
      }}
    >
      <div style={{ marginLeft: '-35px' }}>
        {isOnline ? (
          <StyledBadgeOnline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" sx={{ width: 56, height: 56 }} />
          </StyledBadgeOnline>
        ) : (
          <StyledBadgeOffline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" />
          </StyledBadgeOffline>
        )}
      </div>
      <div>
        <div style={{ marginTop: '10px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <div style={{ color: '#B6A7A7', marginLeft: '10px', marginTop: '5px', maxWidth: '170px' }}>{content}</div>
      </div>
      <div>
        <div style={{ position: 'absolute', marginLeft: '-1px' }}>
          <div style={{ fontSize: '11px', color: '#B6A7A7' }}>{time}</div>
          {/* <div className={styles.count}>{unreads}</div> */}
        </div>
      </div>
    </div>
  );
}

export default ChattingLists;
