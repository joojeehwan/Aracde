import React, { useCallback, useState } from 'react';
import style from '../style/Invite.module.scss';
import Char from '../../../../assets/character.png';

function InviteSearhResults({ name, isInvite }: any) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <div style={{ padding: '20px', display: 'flex' }}>
        <div>
          <img src={Char} style={{ height: '24px', width: '24px' }} />
        </div>
        <div style={{ marginTop: '5px', paddingLeft: '50px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <button className={style.button}>초대</button>
      </div>
    </>
  );
}

export default InviteSearhResults;
