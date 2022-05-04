import React, { useState } from 'react';
import style from '../../styles/Invite.module.scss';
import Char from '../../../../assets/character.png';
import magnifyingGlassInvite from '../../../../assets/Modal/magnifyingGlassInvite.png';


interface MyProps {
  searchPeople: (name: string) => void;
};

function ChatInviteSearhBar({ searchPeople }: MyProps) {
  const [input, setInput] = useState<string>('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.currentTarget.value);
  };

  const handleSearchPeople = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPeople(input);
    }
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
        <p className={style.title}>대화 상대 초대</p>
      </div>
      <div className={style.serachBar}>
        <img src={magnifyingGlassInvite} style={{ height: '43px', marginTop: '-30px', marginBottom: '-10px' }} />
        <input className={style.input} id="nick" type="text" onChange={handleInput} onKeyDown={handleSearchPeople}></input>
      </div>
    </header>
  );
}

export default ChatInviteSearhBar;
