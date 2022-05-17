import React, { useCallback, useEffect, useState } from 'react';
import style from '../../styles/Invite.module.scss';
import Char from '../../../../assets/character.png';
import AlarmApi from "../../../../common/api/AlarmApi"
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/Friends.module.scss';

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

function InviteSearhResults({ name, isInvite, targetUserSeq, login, image, email }: any) {
  const [isClicked, setIsClicked] = useState(false);
  const [isOnline, setIsOnlie] = useState(login)
  const { sendGameNoti } = AlarmApi

  const onClickinviteFriend = useCallback(async () => {
    const userSeq = window.localStorage.getItem("userSeq")
    const inviteCode = window.localStorage.getItem("invitecode")
    await sendGameNoti(userSeq, inviteCode, targetUserSeq)
    setIsClicked(true);
  }, [isClicked]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
        marginTop: 15,
      }}>
      <div>
        {isOnline ? (
          <StyledBadgeOnline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" src={image} />
          </StyledBadgeOnline>
        ) : (
          <StyledBadgeOffline
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt="사진" src={image} />
          </StyledBadgeOffline>
        )}
      </div>
      <div
        style={{
          display: 'block',
          textAlign: 'left',
          width: 180,
        }}>

        <div
          style={{
            marginTop: 5,
            marginLeft: "7px"
          }}
        >{name}
        </div>
        <div
          style={{
            marginTop: 5,
            fontSize: 15,
            marginLeft: "7px"
          }}
        >
          {email}
        </div>
      </div>
      <div style={{ paddingLeft: '18px' }}>
        {isClicked ? (
          <button className={style.buttonClicked}>초대함</button>
        ) : (
          <button onClick={onClickinviteFriend} className={style.button}>
            초대
          </button>
        )}
      </div>
    </div >
  );

}

export default InviteSearhResults;
