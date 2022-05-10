import React, { useEffect, useRef, useState } from "react";
import styles from '../style/RoomContents.module.scss';
import StreamComponent from "../stream/StreamComponent";

type MyProps = {
    users : any[],
    detect : string,
    suspect : string,
    mySession : string,
    camChange : () => void,
    micChange : () => void,
}



function FindPerson({users , detect, suspect, mySession, camChange, micChange} : MyProps){

    const [findNick, setFindNick] = useState<string>("");
    const [imDetect, setImDetect] = useState<boolean>(false);



    useEffect(()=>{
        users.map((v) => {
            if(v.isImDetect() && v.getStreamManager().stream.streamId === detect){
                setImDetect(true);
            }
        })
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
    }, [imDetect])

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
                        if(v.isImDetect()){
                            return(
                                    <StreamComponent
                                        key={idx}
                                        user={v}
                                        sessionId={mySession}
                                        camStatusChanged={camChange}
                                        micStatusChanged={micChange}
                                        // subscribers={subscribers}
                                        // imDetect = {imDetect}
                                        mode="game3"
                                    />)
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
                                // sessionId={mySession}
                                // camStatusChanged={camChange}
                                // micStatusChanged={micChange}
                                // imDetect = {imDetect}
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
        </>
    );
}

export default FindPerson;