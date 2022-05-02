import React, { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/Friends.module.scss';
import UserApi from '../../../../common/api/UserApi';

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

function FriendsSearchResults({ client, seq, name, email, imgUrl, status }: any) {
  const [isOnline, setIsOnline] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [curStatus, setCurStatus] = useState<number>(status);

  const { getAddFriendRequestResult } = UserApi;

  // const onClickAddFriends = useCallback(() => {
  //   // setIsClicked(true);

  // }, [isClicked]);
  const onClickAddFriends = async (email: string) => {
    const result = await getAddFriendRequestResult(email);
    if (result?.status === 200) {
      console.log(result, client);
      //
      setCurStatus(0);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
        marginTop: 15,
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
          <button className={styles.button} onClick={() => onClickAddFriends(email)}>
            친구 추가
          </button>
        )}
      </div>
    </div>
  );
}

export default FriendsSearchResults;
