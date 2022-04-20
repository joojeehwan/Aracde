import { useState } from 'react';
import styles from './style/Main.module.scss';


function Main() {
    return (
        <div className={styles.main}>
            <div className={styles.glass}>
                <p className={styles.title}>Arcade</p>
                <button className={styles.button}>방 만들기</button>
                <button className={styles.button}>입장하기</button>
            </div>
        </div>
    );
}

export default Main;
