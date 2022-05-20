import React, { useEffect, useState } from 'react';
import style from './SelectGame.module.scss';
import { toast } from 'react-toastify';


type MyProps = {
    open: boolean;
    onClose: (e: any) => void;
    onSelect : (g : string, c : string) => void;
};

function SelectGame({ open, onClose, onSelect }: MyProps) {
    const [game, setGame] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
    };
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setGame(e.currentTarget.value);
    };
    const handleChangeCategory = (e : React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.currentTarget.value);
    }
    const sendData = (e : React.MouseEvent) => {
        if(game !== ""){
            if(game === '1' || game === '2'){
                if(category !== ""){
                    onSelect(game, category);
                    onClose(e);
                }
                else{
                    toast.error(<div style={{ width: 'inherit', fontSize: '14px' }}>카테고리를 골라주세요</div>, {
                        position: toast.POSITION.TOP_CENTER,
                        role: 'alert',
                    });
                }
            }
            else{
                onSelect(game, "");
                onClose(e);
            }
        }
        else{
            toast.error(<div style={{ width: 'inherit', fontSize: '14px' }}>게임을 선택해주세요</div>, {
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
                    <p className={style.title}>게임 선택</p>
                </div>
            </header>
            <main>
            <div className={style.gameListBorder}>
                <div className={style.game}>
                    캐치 마인드
                    <input
                        value="1"
                        type="radio"
                        checked={game === "1"}
                        onChange={handleChange}
                    />
                </div>
                {game === "1" ? (
                <select style={{marginTop : "-10px", marginBottom : "10px", textAlign : "center", height : "20px"}} onChange={handleChangeCategory}>
                    <option value="">카테고리 선택</option>
                    <option value="0">속담</option>
                    <option value="1">영화</option>
                    <option value="2">게임</option>
                    <option value="3">생물</option>
                    <option value="4">직업</option>
                    <option value="5">운동</option>
                    <option value="6">전체</option>
                </select>
                ) : null}
                <div className={style.game}>
                    몸으로 말해요
                    <input
                        value="2"
                        name="platform"
                        type="radio"
                        checked={game === "2"}
                        onChange={handleChange}
                    />
                </div>
                {game === "2" ? (
                <select style={{marginTop : "-10px", marginBottom : "10px", textAlign : "center", height : "20px"}} onChange={handleChangeCategory}>
                    <option value="">카테고리 선택</option>
                    <option value="0">속담</option>
                    <option value="1">영화</option>
                    <option value="2">게임</option>
                    <option value="3">생물</option>
                    <option value="4">직업</option>
                    <option value="5">운동</option>
                    <option value="6">전체</option>
                </select>
                ) : null}
                <div className={style.game}>
                    너의 목소리가 들려
                    <input
                        value="3"
                        name="platform"
                        type="radio"
                        checked={game === "3"}
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

export default SelectGame;
