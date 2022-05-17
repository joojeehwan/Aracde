import React, { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/Friends.module.scss';
import UserApi from '../../../../common/api/UserApi';
import AlarmApi from "../../../../common/api/AlarmApi"

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

function FriendsSearchResults({ seq, name, email, imgUrl, status, login }: any) {
  const [isOnline, setIsOnline] = useState(login);
  const [curStatus, setCurStatus] = useState<number>(status);

  const { getAddFriendRequestResult } = UserApi;
  const { sendFreindNoti } = AlarmApi

  const onClickAddFriends = async (seq: any) => {
    const result = await getAddFriendRequestResult(seq);
    if (result?.status === 200) {
      setCurStatus(0);
    }
    await sendFreindNoti(seq);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: "10px",
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
      <div
        style={{
          display: 'block',
          textAlign: 'left',
          width: 180,
        }}
      >
        <div
          style={{
            marginTop: 5,
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 5,
            fontSize: 15,
          }}
        >
          {email}
        </div>
      </div>
      <div>
        {curStatus === 0 ? (
          <button className={styles.buttonYocheong}>요청됨</button>
        ) : (
          <button className={styles.button} onClick={() => onClickAddFriends(seq)}>
            친구 추가
          </button>
        )}
      </div>
    </div>
  );
}

export default FriendsSearchResults;
