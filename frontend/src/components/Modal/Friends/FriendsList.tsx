import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

import styles from '../styles/Friends.module.scss';

//mui
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

function FriendsList({ name, imgUrl }: any) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div style={{ display: 'flex', padding: '20px', marginLeft: '20px', marginTop: '-10px' }}>
      <div>
        {isOnline ? (
          <StyledBadgeOnline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" src={imgUrl} />
          </StyledBadgeOnline>
        ) : (
          <StyledBadgeOffline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" src={imgUrl} />
          </StyledBadgeOffline>
        )}
      </div>
      <div style={{ marginTop: '10px', paddingLeft: '50px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
      <div>
        <button className={styles.button}>친구 삭제</button>
      </div>
    </div>
  );
}

export default FriendsList;
