import React, { useState } from 'react';
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

function ChattingLists() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
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
        <div style={{ marginTop: '10px', paddingRight: '30px', marginLeft: '10px' }}>배하은</div>
        <div style={{ color: '#B6A7A7', marginLeft: '10px', marginTop: '5px', maxWidth: '170px' }}>
          캐치마인드 한판 고?!
        </div>
      </div>
      <div>
        <div style={{ position: 'absolute', marginLeft: '-1px' }}>
          <div style={{ fontSize: '11px', color: '#B6A7A7' }}>오후 5:46</div>
          <div className={styles.count}>5</div>
        </div>
      </div>
    </div>
  );
}

export default ChattingLists;
