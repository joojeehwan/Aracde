import { useState, useEffect, useRef } from "react";
import styles from "../style/OvVideo.module.scss";
import Thinking from '../../../assets/thinking.png';

type MyProps = {
    user : any,
    mutedSound : boolean,
    mode : string,
    end : boolean | null,
    isLast : boolean | null,
    sendAns : ((value : string) => void) | null,
}

function OvVideo({ user, mutedSound, mode, end, isLast, sendAns } : MyProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
  // console.log("video render");


    const handleClickDiv = (streamId : string) => {
        console.log("?? 클릭임");
        console.log("?? 클릭임 ",isLast, sendAns !== null)
        if(isLast && sendAns !== null){
            sendAns(streamId);
        }
    }
  // console.log(user);
    useEffect(() => {
        console.log("PROPS: ", user.streamManager);
        console.log("PROPS: ", user);
        if (user.streamManager && !!videoRef) {
            console.log("PROPS: ", user.streamManager);
            console.log("PROPS: ", user);
            console.log(videoRef.current);
            user.getStreamManager().addVideoElement(videoRef.current);
        }

        if (user && user.streamManager.session && !!videoRef) {
            user.streamManager.session.on("signal:userChanged", (event : any) => {
                const data = JSON.parse(event.data);
                if (data.isScreenShareActive !== undefined) {
                    user.getStreamManager().addVideoElement(videoRef.current);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (user && !!videoRef) {
            user.getStreamManager().addVideoElement(videoRef.current);
        }
    }, [user]);

    return (
        <>
            {mode !== "game3" ? (
                <video
                    autoPlay={true}
                    ref={videoRef}
                    muted={mutedSound}
                    className={styles.video}
                />
            ) 
            : user.isImDetect() ? (
                <video
                    autoPlay={true}
                    ref={videoRef}
                    muted={mutedSound}
                    className={styles.video}
                />
            ) : 
            (
                <>
                    {end ? null : (
                    <div     
                        style={{
                            zIndex : "98",
                            position : "absolute",
                            display : "flex",
                            justifyContent : "center",
                            alignItems : "center",
                            width : "100%",
                            height : "100%",
                            backgroundColor : "black",
                            borderRadius : 15,
                            cursor: "pointer"
                        }}
                        onClick = {() => handleClickDiv(user.getStreamManager().stream.streamId)}
                        >
                        <img className={styles.screat} style={{width : "15vw", height : "15vw"}} src={Thinking}></img>
                    </div>
                    )}
                    <video
                        // style={{
                        //     display : "none"
                        // }}
                        autoPlay={true}
                        ref={videoRef}
                        muted={mutedSound}
                        className={styles.video}
                    />
                </>
            )
            }
            
        </>
  );
}

export default OvVideo;