import React, { useEffect, useRef, useState } from "react";
import styles from '../style/RoomContents.module.scss';
import StreamComponent from "../stream/StreamComponent";
import FindInit from "./Modal/FindInit";
import FirstStep from "./Modal/FirstStep";

type MyProps = {
    my : any,
    users : any[],
    detect : string,
    suspect : string,
    mySession : string,
    imSpeak : string,
    camChange : () => void,
    micChange : (value : any) => void,
}



function FindPerson({my, users , detect, suspect, mySession, imSpeak,camChange, micChange} : MyProps){

    const [init, setInit] = useState<boolean>(true);
    const [idx, setIdx] = useState<number>();
    const [step1, setStep1] = useState<boolean>(false);
    const [findNick, setFindNick] = useState<string>("");
    const [imDetect, setImDetect] = useState<boolean>(false);
    const [curSpeak, setCurSpeak] = useState<string>("");
    const [now, setNow] = useState<boolean>(false);
    const [imNext, setImNext] = useState<boolean>(false);
    const [speakTime, setSpeakTime] = useState<number | undefined>();
    const [time, setTime] = useState<number>(60);
    
    const speakTimeRef = useRef(speakTime);
    speakTimeRef.current = speakTime;

    const nowRef = useRef(now);
    nowRef.current = now;

    const imNextRef = useRef(imNext);
    imNextRef.current = imNext;

    const curSpeakRef = useRef(curSpeak);
    curSpeakRef.current = curSpeak;

    const idxRef = useRef(idx);
    idxRef.current = idx;

    // const sendSignal = () => {
    //     console.log("여긴 제대로 나오니?", idxRef.current);
    // }

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
            setStep1(true);
            setIdx(1);
            if(my.getStreamManager().stream.streamId === imSpeak){
                setImNext(true);
            }
        }, 10000);
        my.getStreamManager().stream.session.on("signal:game", (response : any) => {
            console.log(response.data, "여긴 게임 안이에용~~~~~~");

            setIdx(response.data.index);
            if(!response.data.finshPR && response.data.gameStatus === 2 && response.data.gameId === 3){
                console.log("여긴 됨?? in finish");
                if(my.getStreamManager().stream.stremId === response.data.curStreamId){
                    console.log("여긴 됨?? in if");
                    setImNext(true);
                }
                setCurSpeak(response.data.curStreamId);
                setIdx(response.data.index);
                setStep1(true);
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
        if(step1){
            setTimeout(()=>{
                setStep1(false);
                setSpeakTime(10);
                console.log("여긴", curSpeakRef.current, my.getStreamManager().stream.streamId);
                if(curSpeakRef.current === my.getStreamManager().stream.streamId){
                    setNow(true);
                    setImNext(false);
                }
            }, 5000)
        }
    }, [step1])
    useEffect(()=>{
        let countDown : any;
        if(speakTime !== undefined){
            setTimeout(()=>{
                console.log("????????? 되는거야??");
                setSpeakTime(undefined);
                console.log(nowRef.current);
                if(nowRef.current){
                    //sendSignal();
                    setNow(false);  
                    
                    if(idx !== undefined && idx <= users.length){
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
    }, [speakTime]);

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
                        console.log(v);
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
                    {users.map((v,i) => {
                        const idx = i;
                        console.log(v.getStreamManager().stream.streamId, detect, "씨발");
                        if(!v.isImDetect()){
                            return (<StreamComponent
                                key={idx}
                                user={v}
                                mode="game3"
                                camStatusChanged={camChange}
                                micStatusChanged={micChange}
                                now={nowRef.current}
                            />)
                        }
                    })}
                    </>
                
                </div>
            </div>
            <div style={{
                position : "absolute",
                display : "flex",
                alignItems : "center",
                justifyContent : "center",
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
                {imDetect ? (
                    <div>
                        {findNick} 님을 찾아주세요
                    </div>
                ) : (
                    <div>
                        범인은 누구일까요?
                    </div>
                )}
            </div>
            {init ? (<FindInit open={init} imDetect = {imDetect} nick = {findNick}></FindInit>) : null}
            {step1 ? (<FirstStep open={step1} now = {imNextRef.current}></FirstStep>) : null}
        </>
    );
}

export default FindPerson;