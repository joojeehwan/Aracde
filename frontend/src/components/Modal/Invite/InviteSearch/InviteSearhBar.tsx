import React, { useState } from 'react';
import style from '../../styles/Invite.module.scss';
import Char from '../../../../assets/character.png';
import magnifyingGlass from '../../../../assets/Modal/magnifyingGlass.png';

interface MyProps {
  searchPeople: (name: string) => void;
}

function InviteSearhBar({ searchPeople }: MyProps) {
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
        <p className={style.title}>친구 초대</p>
      </div>
      <div className={style.searchBar}>
        <img src={magnifyingGlass} />
        <input className={style.input} id="nick" type="text" onChange={handleInput} onKeyDown={handleSearchPeople}></input>
      </div>
    </header>
  );
}

export default InviteSearhBar;
