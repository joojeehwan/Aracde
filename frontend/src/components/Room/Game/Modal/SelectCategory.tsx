import React, { useEffect, useState } from 'react';
import style from './SelectCategory.module.scss';
import { toast } from 'react-toastify';


type MyProps = {
    open: boolean;
    onClose: (e: any) => void;
    onSelect : (c : string) => void;
};

function SelectCategory({ open, onClose, onSelect }: MyProps) {
    const [category, setCategory] = useState<string>("");
    const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
    };
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value);
        setCategory(e.currentTarget.value);
    };

    const sendData = (e : React.MouseEvent) => {
        if(category !== ""){
                onSelect(category);
                onClose(e);
        }
        else{
            toast.error(<div style={{ width: 'inherit', fontSize: '14px' }}>카테고리를 골라주세요</div>, {
                position: toast.POSITION.TOP_CENTER,
                role: 'alert',
            });
        }
    }
    return (
        <div
            className={open ? `${style.openModal} ${style.modal}` : style.modal}
            onClick={onClose}
            onKeyDown={handleStopEvent}
            role="button"
            tabIndex={0}
        >
        {open ? (
            <section
                className={style.modalForm}
                onClick={handleStopEvent}
                onKeyDown={handleStopEvent}
                role="button"
                tabIndex={0}
            >
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
                    <p className={style.title}>카테고리 선택</p>
                </div>
            </header>
            <main>
            <div className={style.gameListBorder}>
                <div className={style.game}>
                    속담
                    <input
                        value="0"
                        type="radio"
                        checked={category === "0"}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.game}>
                    영화
                    <input
                        value="1"
                        name="platform"
                        type="radio"
                        checked={category === "1"}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.game}>
                    게임
                    <input
                        value="2"
                        name="platform"
                        type="radio"
                        checked={category === "2"}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.game}>
                    생물
                    <input
                        value="3"
                        name="platform"
                        type="radio"
                        checked={category === "3"}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.game}>
                    캐릭터
                    <input
                        value="4"
                        name="platform"
                        type="radio"
                        checked={category === "4"}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.game}>
                    노래
                    <input
                        value="5"
                        name="platform"
                        type="radio"
                        checked={category === "5"}
                        onChange={handleChange}
                    />
                </div>
                <div className={style.game}>
                    전체
                    <input
                        value="6"
                        name="platform"
                        type="radio"
                        checked={category === "6"}
                        onChange={handleChange}
                    />
                </div>
                </div>
                
                <div className={style.btnbox}>
                <button className={style.confirm} onClick={sendData}>
                    확인
                </button>
                </div>
            </main>
            </section>
        ) : null}
        </div>
  );
}

export default SelectCategory;
