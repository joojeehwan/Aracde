import React, { useEffect, useState } from 'react';
import styles from './style/ContentFirst.module.scss';
import {ReactComponent as Users} from '../../assets/users.svg';
import {ReactComponent as Bell} from '../../assets/bell-ring.svg';
import { useNavigate } from 'react-router-dom';

function ContentFirst() {
    return (
        <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <p>Arcade란?</p>
                        <span>처음 만난 사람들과 간단한 게임을 즐길 수 있는 웹 기반 게임 플랫폼 입니다.</span>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.card}>
                        ㅎㅇㅎㅇㅎㅇㅎㅇ
                    </div>
                </div>
            </div>
    );
}

export default ContentFirst;
