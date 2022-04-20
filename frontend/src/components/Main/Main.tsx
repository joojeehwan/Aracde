import React, { useState } from 'react';
import styles from './style/Main.module.scss';
import RoomCreate from './Modal/RoomCreate';

function Main() {
    const [open, setOpen] = useState<boolean>(false);
    
    const handleOpenCreateRoom = (e : React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        setOpen(true);       
    }
    const handleCloseCreateRoom = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOpen(false);
    }
    return (
        <div className={styles.main}>
            <div className={styles.glass}>
                <p className={styles.glitch} data-text="Arcade">Arcade</p>
                <button className={styles.button} onClick={handleOpenCreateRoom}>방 만들기</button>
                <button className={styles.button}>입장하기</button>
                {open ? (<RoomCreate open={open} onClose={handleCloseCreateRoom}/>) : null}
            </div>
        </div>
    );
}

export default Main;
