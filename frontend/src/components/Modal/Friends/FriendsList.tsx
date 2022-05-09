import React, { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

import styles from '../styles/Friends.module.scss';

//api
import UserApi from '../../../common/api/UserApi';

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

function FriendsList({ name, imgUrl, userSeq, setIsDelete }: any) {
  const [isOnline, setIsOnline] = useState(true);

  //api
  const { deleteFriend, getFriendList } = UserApi;
  console.log(userSeq);

  const onClickdeleteFriend = useCallback(async () => {
    setIsDelete(true)
    await deleteFriend(userSeq as unknown as number)
  }, [userSeq]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: '15px',
      }}
    >
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
      <div>{name}</div>
      <div>
        <button className={styles.button} onClick={onClickdeleteFriend}>
          친구 삭제
        </button>
      </div>
    </div>
  );
}

export default FriendsList;
