import React, { useEffect, useState } from 'react';
import style from './Distanc.module.css';

type MyProps = {
    open: boolean;
    onClose: (e: any) => void;
};
// 차량(false), 도보(true) 인지 결정해서 상위 컴포넌트에 type을 전달해주는 모달
function Distance({ open, onClose }: MyProps) {

    const handleStopEvent = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div
        className={open ? `${style.openModal} ${style.modal}` : style.modal}
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        tabIndex={0}
        >
        {open ? (
            <section className={style.modalForm} onClick={handleStopEvent} onKeyDown={onClose} role="button" tabIndex={0}>
            <header>
                <h3 className={style.title}>범위 설정🚞</h3>
            </header>
            <main>
                <div className={style.configForm}>
                </div>
            </main>
            </section>
        ) : null}
        </div>
    );
}

export default Distance;
