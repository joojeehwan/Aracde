import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/Chatting.module.scss';

interface MyProps {
  open: boolean;
  onClose: (e: any) => void;
}

const dummydata = { 'name:': '주지환', content: '' };

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

function Chatting({ open, onClose }: MyProps) {
  const [isOnline, setIsOnline] = useState(true);

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      onClick={onClose}
      onKeyDown={handleStopEvent}
      role="button"
      tabIndex={0}
    >
      {open ? (
        <section
          className={styles.modalForm}
          onClick={handleStopEvent}
          onKeyDown={handleStopEvent}
          role="button"
          tabIndex={0}
        >
          <div style={{ display: 'flex', padding: '20px', marginLeft: '20px', marginTop: '-10px' }}>
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
              <div style={{ marginTop: '10px', paddingRight: '30px', marginLeft: '10px' }}>주지환</div>
              <div style={{ color: '#B6A7A7', marginLeft: '10px', marginTop: '5px', maxWidth: '170px' }}>
                캐치마인드 한판 고?!
              </div>
            </div>
            <div>
              <div style={{ position: 'absolute', marginLeft: '40px' }}>
                <div style={{ fontSize: '11px', color: '#B6A7A7' }}>오후 5:46</div>
                <div className={styles.count}>5</div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Chatting;
