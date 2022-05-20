import React, { useState } from 'react';
import styles from '../../styles/Friends.module.scss';
import magnifyingGlass from '../../../../assets/Modal/magnifyingGlass.png';


type MyProps = {
  searchPeople : (name : string) => void
}

function FriendsSearhBar({searchPeople} : MyProps) {
  const [word, setWord] = useState<string>("");

  const handleChangeWord = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const curWord = e.currentTarget.value;
    setWord(curWord);
  }
  const handleSearchPeople = (e : React.KeyboardEvent) => {
    if(e.key === 'Enter'){
      searchPeople(word);
    }
  }

  return (
    <div className={styles.searchContainer}>
      <img src={magnifyingGlass} alt="돋보기" />
      <input className={styles.Input} onChange={handleChangeWord} onKeyDown={handleSearchPeople}/>
    </div>
  );
}

export default FriendsSearhBar;
