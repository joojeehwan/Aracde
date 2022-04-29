import React from 'react';
import styles from '../../styles/Friends.module.scss';
import magnifyingGlass from '../../../../assets/Modal/magnifyingGlass.png';

function FriendsSearhBar() {
  return (
    <div className={styles.searchContainer}>
      <img src={magnifyingGlass} alt="돋보기" />
      <input className={styles.Input} />
    </div>
  );
}

export default FriendsSearhBar;
