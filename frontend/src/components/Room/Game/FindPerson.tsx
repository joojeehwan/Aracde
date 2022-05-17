import React, { useEffect, useRef, useState } from "react";
import styles from '../style/RoomContents.module.scss';
import RoomApi from "../../../common/api/Room";
import StreamComponent from "../stream/StreamComponent";
import FindInit from "./Modal/FindInit";
import FirstStep from "./Modal/FirstStep";
import Meeting from './Modal/Meeting';
import Last from './Modal/Last';
import AlarmIcon from '@mui/icons-material/Alarm';
import {toast} from 'react-toastify';

type MyProps = {
    my : any,
    users : any[],
    detect : string,
    suspect : string,
    mySession : string,
    imSpeak : string,
    detectNick : string,
    camChange : () => void,
    micChange : (value : any) => void,
}

// 정답 answerYN 0 or 1 이면 캠 오픈 되게 해야함

function FindPerson({my, users , detect, suspect, mySession, imSpeak, detectNick,camChange, micChange} : MyProps){

    const [init, setInit] = useState<boolean>(true);
    const [idx, setIdx] = useState<number>();
    const [step, setStep] = useState<boolean>(false);
    const [findNick, setFindNick] = useState<string>("");
    //const [detectNick, setDetectNick] = useState<string>("");
    const [imDetect, setImDetect] = useState<boolean>(false);
    const [curSpeak, setCurSpeak] = useState<string>("");
    const [now, setNow] = useState<boolean>(false);
    const [imNext, setImNext] = useState<boolean>(false);
    const [speakTime, setSpeakTime] = useState<number>(10);
    const [speak, setSpeak] = useState<boolean>(false);
    const [time, setTime] = useState<number>(60);
    const [timeCheck, setTimeCheck] = useState<boolean>(false);
    const [meeting, setMeeting] = useState<boolean>(false);
    const [lastTime, setLastTime] = useState<number>(10);
    const [lastCheck, setLastCheck] = useState<boolean>(false);
    const [last, setLast] = useState<boolean>(false);
    const [ans, setAns] = useState<boolean>(false);
    const [end, setEnd] = useState<boolean>(false);
    const [endDiv, setEndDiv] = useState<boolean>(false);
    const [isAns, setIsAns] = useState<boolean>(false);
    const [chance, setChance] = useState<number>();
    const [exit, setExit] = useState<boolean>(false);

    const {winGame} = RoomApi;


    const nowRef = useRef(now);
    nowRef.current = now;

    const imNextRef = useRef(imNext);
    imNextRef.current = imNext;

    const curSpeakRef = useRef(curSpeak);
    curSpeakRef.current = curSpeak;

    const idxRef = useRef(idx);
    idxRef.current = idx;

    const timeRef = useRef(time);
    timeRef.current = time;

    const speakTimeRef = useRef(speakTime);
    speakTimeRef.current = speakTime;
    
    const lastTimeRef = useRef(lastTime);
    lastTimeRef.current = lastTime;

    const chanceRef = useRef(chance);
    chanceRef.current = chance;

    const endRef = useRef(end);
    endRef.current = end;

    const sendAnswer = (streamId : string) => {
        const data = {
            gameStatus : 2,
            gameId : 3,
            index : -1,
            tryAnswer : streamId
        }
        my.getStreamManager().stream.session.signal({
            data : JSON.stringify(data),
            type : "game"
        });
    }
    const exitGame = () => {
        if(exit){
            const data = {
                gameStatus : 3,
                gameId : 3
            }
            my.getStreamManager().stream.session.signal({
                data : JSON.stringify(data),
                type : "game"
            });
        }
        else{
            toast.error(
                <div style={{
                    display : "flex",
                    justifyContent : "center",
                    flexDirection : "column",
                    alignItems : "center"
                }}>
                <div style={{ width: 'inherit', fontSize: '14px' }}>
                    게임을 시작한 사람만
                </div>
                <div style={{ width: 'inherit', fontSize: '14px' }}>
                    클릭 가능합니다.
                </div>
                </div>, {
                position: toast.POSITION.TOP_CENTER,
                role: 'alert',
            });
        }
    }

    useEffect(()=>{
        
        setCurSpeak(imSpeak);
        users.map((v) => {
            if(v.isImDetect() && v.getStreamManager().stream.streamId === detect){
                setImDetect(true);
            }
        });
        setTimeout(()=>{
            console.log("???여긴", imSpeak);
            setInit(false);
            setStep(true);
            setIdx(1);
            if(my.getStreamManager().stream.streamId === imSpeak){
                setImNext(true);
            }
            if(users.length <= 4){
                setChance(1);
            }
            else{
                setChance(2);
            }
        }, 10000);
        my.getStreamManager().stream.session.on("signal:game", async (response : any) => {
            setIdx(response.data.index);
            if(response.data.answerYN !== undefined){
                console.log("여긴 들어오는 거니?? in answer");
                if(response.data.answerYN === 2){
                    setChance(1);
                    setLastCheck(true);
                    setLastTime(10);
                    setAns(false);
                    setEndDiv(true);
                }
                else if(response.data.answerYN === 1){
                    if(my.getStreamManager().stream.streamId === response.data.startStreamId){
                        setExit(true);
                    }
                    if(my.getStreamManager().stream.streamId !== detect){
                        if(window.localStorage.getItem('userSeq')){
                            await winGame(window.localStorage.getItem('userSeq'), 2);
                        }
                    }
                    setLastCheck(false);
                    setChance(0);
                    setEnd(true);
                    setAns(false);
                    setNow(true);
                    setEndDiv(true);
                }
                else if(response.data.answerYN === 0){
                    if(my.getStreamManager().stream.streamId === response.data.startStreamId){
                        setExit(true);
                    }
                    
                    if(my.getStreamManager().stream.streamId === detect){
                        if(window.localStorage.getItem('userSeq')){
                            await winGame(window.localStorage.getItem('userSeq'), 2);
                        }
                    }
                    setLastCheck(false);
                    setChance(0);
                    setEnd(true);
                    setAns(false);
                    setIsAns(true);
                    setNow(true);
                    setEndDiv(true);
                }
                return;
            }
            else if(!response.data.finishPR && response.data.gameStatus === 2 && response.data.gameId === 3){
                console.log("여긴 됨?? in finish");
                if(my.getStreamManager().stream.streamId === response.data.curStreamId){
                    console.log("여긴 됨?? in if");
                    setImNext(true);
                }
                setCurSpeak(response.data.curStreamId);
                setIdx(response.data.index);
                setStep(true);
            }
            else if(response.data.finishPR && response.data.finishPR === 'Y'){
                console.log("??? 여긴 실행 되니?? 마지막 체크")
                setMeeting(true);
            }
        });
    },[]);

    useEffect(()=>{
        console.log("??? 왜 실행이 안될까용");
        users.map((v) => {
            console.log("???? 여긴 되는거니??", v.getStreamManager().stream.streamId, 0, suspect);
            if(v.getStreamManager().stream.streamId === suspect){
                console.log("hi");
                setFindNick(v.getNickname());
            }
        })
    }, [imDetect]);

    useEffect(()=>{
        if(step){
            setTimeout(()=>{
                console.log("여긴", curSpeakRef.current, my.getStreamManager().stream.streamId);
                if(curSpeakRef.current === my.getStreamManager().stream.streamId){
                    setNow(true);
                    setImNext(false);
                }
                setStep(false);
                setSpeakTime(10);
                setSpeak(true);
            }, 5000)
        }
    }, [step])

    useEffect(()=>{
        if(meeting){
            setTimeout(()=>{
                setMeeting(false);               
                setTime(60);
                setTimeCheck(true);
                setNow(true);
            }, 5000)
        }
    },[meeting])

    useEffect(()=>{
        if(last){
            setTimeout(()=>{
                setLastTime(10);
                setLast(false);
                setLastCheck(true);
                setAns(true);
            }, 5000)
        }
    }, [last])

    useEffect(()=>{
        let countDown : any;
        if(speak){
            countDown = setInterval(()=>{
                if(speakTimeRef.current === 0){
                    clearInterval(countDown);
                }
                else{
                    setSpeakTime(speakTimeRef.current-1);
                }
            }, 1000);

            setTimeout(()=>{
                console.log("????????? 되는거야??");
                setSpeak(false);
                console.log(nowRef.current);
                if(nowRef.current){
                    setNow(false);  
                    
                    if(idx !== undefined){
                        console.log("여긴 길이 검사야");
                        const data = {
                            gameStatus : 2,
                            gameId : 3,
                            index : idx,
                            spokenStreamId : my.getStreamManager().stream.streamId
                        }
                        my.getStreamManager().stream.session.signal({
                            data : JSON.stringify(data),
                            type : "game"
                        });
                    }
                }
                
            }, 10000);
        }
        else{
            clearInterval(countDown);
        }
    }, [speak]);

    useEffect(()=>{
        let countDown : any;
        if(timeCheck){
            countDown = setInterval(()=>{
                if(timeRef.current === 0){
                    clearInterval(countDown);
                }
                else{
                    setTime(timeRef.current-1);
                }
            }, 1000);
            setTimeout(()=>{
                setTimeCheck(false);
                setNow(false);
                setLast(true);
            }, 60000);
        }

        else{
            clearInterval(countDown);
        }
    }, [timeCheck]);

    useEffect(()=>{
        let countDown : any;
        if(lastCheck && chance && chance > 0){
            if(endRef.current){
                clearInterval(countDown);
                clearTimeout();
            }
            else{
                countDown = setInterval(()=>{
                    console.log("여긴 라스트임",lastTimeRef.current);
                    if(lastTimeRef.current === 0 || endRef.current){
                        clearInterval(countDown);
                    }
                    else{
                        setLastTime(lastTimeRef.current-1);
                    }
                }, 1000);
                setTimeout(()=>{
                    if(my.isImDetect() && !endRef.current){
                        const data = {
                            gameStatus : 2,
                            gameId : 3,
                            index : -1,
                            tryAnswer : "",
                        }
                        my.getStreamManager().stream.session.signal({
                            data : JSON.stringify(data),
                            type : "game"
                        });
                    }
                    setLastCheck(false);
                }, 10000)
            }
            
        }
        else{
            clearInterval(countDown);
        }
    }, [lastCheck])

    useEffect(()=>{
        console.log("여긴", speakTimeRef.current);
        if(nowRef.current){
            micChange(nowRef.current);
        }
        else if(!nowRef.current){
            micChange(nowRef.current);
        }
    },[now])

    return(
        <>
            {speak ? (
                <>
                    <AlarmIcon sx={{
                        position : "absolute",
                        color : "white",
                        fontSize : 30, 
                        marginRight : "1vw",
                        top : "8.4vh",
                        right : "29.5vw"
                    }}
                    />
                    <div style={{
                        position : "absolute",
                        display : "flex",
                        justifyContent : "center",
                        alignItems : "center",
                        top : "9vh",
                        right : "28.5vw",
                        color : "white",
                        fontSize : "1.5em",
                    }}>
                        {speakTime} 
                    </div>
                </>
                
            ) : null}
            {timeCheck ? (
                <>
                <AlarmIcon sx={{
                    position : "absolute",
                    color : "white",
                    fontSize : 30, 
                    marginRight : "1vw",
                    top : "8.4vh",
                    right : "29.5vw"
                }}
                />
                <div style={{
                    position : "absolute",
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center",
                    top : "9vh",
                    right : "28.5vw",
                    color : "white",
                    fontSize : "1.5em",
                }}>
                    {time} 
                </div>
            </>
            ): null}
            {lastCheck ? (
                <>
                <AlarmIcon sx={{
                    position : "absolute",
                    color : "white",
                    fontSize : 30, 
                    marginRight : "1vw",
                    top : "8.4vh",
                    right : "29.5vw"
                }}
                />
                <div style={{
                    position : "absolute",
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center",
                    top : "9vh",
                    right : "28.5vw",
                    color : "white",
                    fontSize : "1.5em",
                }}>
                    {lastTime} 
                </div>
            </>
            ) : null}
            <div className={
                `${styles["user-videos-container"]} ${styles.findperson}`
            }>
                <div
                    id="user-video"
                    className={
                        `${styles["video-container"]} ${styles.findperson}`
                    }
                >
                    <>
                    {users.map((v,i) => {
                        const idx = i;
                        if(v.isImDetect() && v.getStreamManager().stream.streamId === detect){
                            return(
                                    <StreamComponent
                                        key={idx}
                                        user={v}
                                        sessionId={mySession}
                                        camStatusChanged={camChange}
                                        micStatusChanged={micChange}
                                        mode="game3"
                                    />)
                        }
                        else if(v.isImDetect()){
                            return(
                                <StreamComponent
                                        key={idx}
                                        user={v}
                                        camStatusChanged={camChange}
                                        micStatusChanged={micChange}
                                        mode="game3"
                                />
                            )
                        }
                    })}
                    {imDetect ? (
                        <>
                        {users.map((v,i) => {
                            const idx = i;
                            if(!v.isImDetect()){
                                return (
                                <StreamComponent
                                    key={idx}
                                    user={v}
                                    mode="game3"
                                    camStatusChanged={camChange}
                                    micStatusChanged={micChange}
                                    now={nowRef.current}
                                    sendAns={sendAnswer}
                                    isLast={lastCheck}
                                    end={end}
                                />)
                            }
                        })}
                        </>
                    ) 
                    : 
                    (
                        <>
                        {users.map((v,i) => {
                            const idx = i;
                            if(!v.isImDetect()){
                                return (<StreamComponent
                                    key={idx}
                                    user={v}
                                    mode="game3"
                                    camStatusChanged={camChange}
                                    micStatusChanged={micChange}
                                    now={nowRef.current}
                                    end={end}
                                />)
                            }
                        })}
                        </>
                    )}
                    
                    </>
                
                </div>
            </div>
            
                {ans ? (
                    <div style={{
                        position : "absolute",
                        display : "flex",
                        alignItems : "center",
                        justifyContent : "center",
                        padding : "0px 20px",
                        width : "50vw",
                        height : "10vh",
                        fontSize : "2rem",
                        textAlign : "center",
                        color : "white",
                        backgroundColor : "#FF7936",
                        left : "13.5vw",
                        top : "85vh",
                        borderRadius : "10px"
                    }}>
                    <div>{detectNick} 님이 추리중 입니다! (기회 : {chance})</div>
                    </div>
                ) 
                : endDiv ? (
                    <>
                        {isAns ? (
                        <div style={{
                            position : "absolute",
                            display : "flex",
                            alignItems : "center",
                            justifyContent : "center",
                            padding : "0px 20px",
                            width : "50vw",
                            height : "10vh",
                            fontSize : "2rem",
                            textAlign : "center",
                            color : "white",
                            backgroundColor : "#F3C522",
                            left : "13.5vw",
                            top : "85vh",
                            borderRadius : "10px"
                        }}>
                            <div> 정답입니다! {findNick}님을 찾았습니다!</div>
                            <button 
                            className={styles.exitGame}
                            style={{
                                fontSize : "1.3rem",
                                border : "none",
                                borderRadius : 10,
                                color : "white",
                            }} onClick={exitGame}>게임 종료</button>
                        </div>) 
                        : chanceRef.current !== undefined && chanceRef.current > 0 ? ((
                        
                        <div style={{
                            position : "absolute",
                            display : "flex",
                            alignItems : "center",
                            justifyContent : "center",
                            padding : "0px 20px",
                            width : "50vw",
                            height : "10vh",
                            fontSize : "2rem",
                            textAlign : "center",
                            color : "white",
                            backgroundColor : "#FF7768",
                            left : "13.5vw",
                            top : "85vh",
                            borderRadius : "10px"
                        }}>
                        <div>땡! 틀렸습니다! 기회 : {chance}</div>
                        </div>)) : (
                        <div style={{
                            position : "absolute",
                            display : "flex",
                            alignItems : "center",
                            justifyContent : "center",
                            padding : "0px 20px",
                            width : "50vw",
                            height : "10vh",
                            fontSize : "2rem",
                            textAlign : "center",
                            color : "white",
                            backgroundColor : "#E03F1B",
                            left : "13.5vw",
                            top : "85vh",
                            borderRadius : "10px"
                        }}>
                        <div>땡! 틀렸습니다. {findNick}님을 못찾았습니다!</div>
                        
                        <button 
                        className={styles.exitGame}
                        style={{
                            fontSize : "1.3rem",
                            border : "none",
                            borderRadius : 10,
                            color : "white",
                        }} onClick={exitGame}>게임 종료</button></div>)}
                    </> 
                )
                : imDetect ? (
                    <div style={{
                        position : "absolute",
                        display : "flex",
                        alignItems : "center",
                        justifyContent : "center",
                        padding : "0px 20px",
                        width : "50vw",
                        height : "10vh",
                        fontSize : "2rem",
                        textAlign : "center",
                        color : "white",
                        backgroundColor : "#0250C5",
                        left : "13.5vw",
                        top : "85vh",
                        borderRadius : "10px"
                    }}>
                    <div>
                        {findNick} 님을 찾아주세요
                    </div>
                    </div>
                ) : (
                    <div style={{
                        position : "absolute",
                        display : "flex",
                        alignItems : "center",
                        justifyContent : "center",
                        padding : "0px 20px",
                        width : "50vw",
                        height : "10vh",
                        fontSize : "2rem",
                        textAlign : "center",
                        color : "white",
                        backgroundColor : "#0250C5",
                        left : "13.5vw",
                        top : "85vh",
                        borderRadius : "10px"
                    }}>
                    <div>
                        누굴 찾아야 할까요?
                    </div>
                    </div>
                )}

            {init ? (<FindInit open={init} imDetect = {imDetect} nick = {findNick}></FindInit>) : null}
            {step ? (<FirstStep open={step} now = {imNextRef.current}></FirstStep>) : null}
            {meeting ? (<Meeting open={meeting}></Meeting>) : null}
            {last ? (<Last open={last} chance={chance} nick={detectNick}></Last>) : null}
        </>
    );
}

export default FindPerson;