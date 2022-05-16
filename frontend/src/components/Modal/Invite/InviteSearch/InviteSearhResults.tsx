import React, { useCallback, useEffect, useState } from 'react';
import style from '../../styles/Invite.module.scss';
import Char from '../../../../assets/character.png';
import AlarmApi from "../../../../common/api/AlarmApi"

function InviteSearhResults({ name, isInvite, targetUserSeq }: any) {
  const [isClicked, setIsClicked] = useState(false);

  const { sendGameNoti } = AlarmApi

  const onClickinviteFriend = useCallback(async () => {
    const userSeq = window.localStorage.getItem("userSeq")
    const inviteCode = window.localStorage.getItem("invitecode")
    await sendGameNoti(userSeq, inviteCode, targetUserSeq)
    setIsClicked(true);
  }, [isClicked]);

  return (
    <>
      <div style={{ padding: '20px', display: 'flex', marginTop: '-5px' }}>
        <div>
          <img src={Char} style={{ height: '24px', width: '24px' }} />
        </div>
        <div style={{ marginTop: '5px', paddingLeft: '50px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <div style={{ paddingLeft: '18px' }}>
          {isClicked ? (
            <button className={style.buttonClicked}>초대함</button>
          ) : (
            <button onClick={onClickinviteFriend} className={style.button}>
              초대
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default InviteSearhResults;
