import React, { useState } from 'react';
import style from '../style/Invite.module.scss';
import Char from '../../../../assets/character.png';
import magnifyingGlassInvite from '../../../../assets/Modal/magnifyingGlassInvite.png';

function InviteSearhBar() {
  const [input, setInput] = useState<string>('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.currentTarget.value);
  };

  return (
    <header>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 48,
          marginTop: 10,
        }}
      >
        <img
          src={Char}
          style={{
            width: 46,
            height: 46,
          }}
        />
        <p className={style.title}>친구 초대</p>
      </div>
      <div className={style.serachBar}>
        <img src={magnifyingGlassInvite} style={{ height: '43px', marginTop: '-30px', marginBottom: '-10px' }} />
        <input className={style.input} id="nick" type="text" onChange={handleInput}></input>
      </div>
    </header>
  );
}

export default InviteSearhBar;
