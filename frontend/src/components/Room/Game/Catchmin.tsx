
import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import RoomApi from "../../../common/api/Room";

import style from '../style/Catchmind.module.scss';

type MyProps = {
    initData : {answer : string, id : string, nextId : string} | undefined,
    user : any
}

function Catchmind({initData, user} : MyProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<{x : number, y : number} | undefined>();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [timeFlag, setTimeFlag] = useState<boolean>(false);
    const [myTurn, setMyturn] = useState<boolean>(false);
    const [nextTurn, setNext] = useState<boolean>(false);
    const [time, setTime] = useState<number>(60);
    const [imgTime, setImgTime] = useState<number>(5);
    const [init, setInit] = useState<boolean>(false);
    const [idx, setIdx] = useState<number>();
    const [last, setLast] = useState<boolean>(false);
    const [lastTime, setLastTime] = useState<number>(300000000);
    const [inputData, setInputData] = useState<string>("");
    const [imgStatus, setImgStatus] = useState<boolean>(false);
    const [allImage, setAllimage] = useState<string[]>([]);
    const [ansFlag, setAnsFlag] = useState<boolean>(false);
    const [end, setEnd] = useState<boolean>(false);
    const [src, setSrc] = useState<string>("");

    const {getUploadImageResult} = RoomApi;


    const nextRef = useRef(nextTurn);
    nextRef.current = nextTurn;

    const imgTimeRef = useRef(imgTime);
    imgTimeRef.current = imgTime;

    const lastTimeRef = useRef(lastTime);
    lastTimeRef.current = lastTime;

    const handleResize = debounce(() => {
        if(!canvasRef.current) return;
        const canvas : HTMLCanvasElement = canvasRef.current;
        const p : HTMLDivElement = document.getElementById("parent") as HTMLDivElement;
        
        const ctx = canvas.getContext('2d');
        const temp = ctx?.getImageData(0,0,canvas.width, canvas.height) as ImageData;
        
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = p.offsetWidth;
        canvas.height = p.offsetHeight;
        console.log(temp);
        ctx?.putImageData(temp, 0, 0);
    }, 500);

    const getPosition = (e : MouseEvent) => {
        if(!canvasRef.current){
            return;
        }
        const canvas : HTMLCanvasElement = canvasRef.current;
        console.log(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop);
        return {
            x : e?.pageX - canvas.offsetLeft,
            y : e?.pageY - canvas.offsetTop
        }
    }
    const drawLine = (original : {x : number, y : number}, newpos : {x : number, y : number}) => {
        if(!canvasRef.current){
            return;
        }
        
        const canvas : HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if(ctx){
            console.log("?여긴 되누??");
            ctx.strokeStyle = "red";
            ctx.lineJoin = 'round';
            ctx.lineWidth = 5;
            
            ctx.beginPath();
            ctx.moveTo(original.x, original.y);
            ctx.lineTo(newpos.x, newpos.y);
            ctx.closePath();

            ctx.stroke();
        }

    }
    const startDraw = useCallback((e : MouseEvent) => {
        const position = getPosition(e);
        console.log("?여긴 start");
        if(position){
            setIsActive(true);
            setMousePos(position);
        }
    },[]);
    const draw = useCallback((e : MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if(isActive){
            console.log("?여기가 안될듯?");
            const newMousePos = getPosition(e);
            if(mousePos && newMousePos){
                drawLine(mousePos, newMousePos);
                setMousePos(newMousePos);
            }   
        }
    },[isActive, mousePos]);
    const exit = useCallback(() => {
        setIsActive(false);
    },[]);

    const handleChangeValue = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setInputData(value);
    }
    const handleKeyDownEnter = (e : React.KeyboardEvent) => {
        if(e.key === 'Enter'){
            sendAnswer();
        }
    }

    const sendSignal = async () => {
        if(!canvasRef.current) return;

        const canvas : HTMLCanvasElement = canvasRef.current;
        const newCanvas : HTMLCanvasElement = canvas.cloneNode(true) as HTMLCanvasElement;
        const ctx = newCanvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0,0,newCanvas.width,newCanvas.height);
        ctx.drawImage(canvas,0,0);

        const image = newCanvas.toDataURL("image/jpeg");
        const blobBin = atob(image.split(",")[1]);
        const array = [];
        for(let i = 0; i < blobBin.length; i++){
            array.push(blobBin.charCodeAt(i));
        }
        const file = new Blob([new Uint8Array(array)], {type : "image/jpeg"});
        const newFile = new File([file], `${user.getStreamManager().stream.streamId}.jpeg`);
        
        const formData = new FormData();
        formData.append("image", newFile);
        console.log(newFile);

        const result = await getUploadImageResult(formData);
        console.log(result.data);
        if(result.data !== null){
            const data = {
                streamId : user.getStreamManager().stream.streamId,
                gameStatus : 2,
                gameId : 1,
                index : idx,
                imageUrl : result.data
            }
            user.getStreamManager().stream.session.signal({
                data : JSON.stringify(data),
                type : "game"
            });
            setMyturn(false);
        }
    }
    const sendAnswer = () => {
        const data = {
            streamId : user.getStreamManager().stream.streamId,
            gameStatus : 2,
            gameId : 1,
            index : idx,
            response : inputData,
            imageUrl : ""
        }
        user.getStreamManager().stream.session.signal({
            data : JSON.stringify(data),
            type : "game"
        });
        setLast(false);
    }

    useEffect(()=>{
        let countDown : any;
        if(last){
            countDown = setInterval(()=>{
                if(lastTimeRef.current === 0){
                    clearInterval(countDown);
                    sendAnswer();
                }
                else{
                    setLastTime(lastTimeRef.current-1);
                }
            }, 1000);
            return () => clearInterval(countDown);
        }
        else{
            clearInterval(countDown);
        }
    }, [last])

    useEffect(()=>{
        let countDown : any;
        if(timeFlag){
            countDown = setInterval(()=>{
                if(time === 0){
                    clearInterval(countDown);
                    // us
                    setTimeFlag(false);
                    sendSignal();
                }
                else{
                    setTime(time-1);
                }
            }, 1000);
            return () => clearInterval(countDown);
        }
        else{
            console.log("?????");
            clearInterval(countDown);
        }
    }, [timeFlag,time]);
    useEffect(()=>{
        let countTime : any;
        if(imgStatus){
            countTime = setInterval(()=>{
                console.log("왜 안될까용??", imgTimeRef.current);
                if(imgTimeRef.current === 0){
                    clearInterval(countTime);
                }
                else{
                    setImgTime(imgTimeRef.current-1);
                }
            },1000)
            setTimeout(()=>{
                setImgStatus(false);
                setTimeFlag(true);
            }, 5000);
        }
        else{
            clearInterval(countTime);
        }
    },[imgStatus])
    
    useEffect(()=>{
        if(myTurn && !imgStatus){
            if(!canvasRef.current) return;
            
            const canvas : HTMLCanvasElement = canvasRef.current;
            const p : HTMLDivElement = document.getElementById("parent") as HTMLDivElement;
            
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.width = p.offsetWidth;
            canvas.height = p.offsetHeight;
            console.log("????왜 안됨요??");    
        }
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [myTurn, imgStatus]);
    useEffect(() => {
        if(!canvasRef.current) return;
        console.log("??SA?DAS?D?ASD?GSDBVISDHNVKLJSDHFUISDFH");
        const canvas : HTMLCanvasElement = canvasRef.current;
        const p : HTMLDivElement = document.getElementById("parent") as HTMLDivElement;
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', exit);
        canvas.addEventListener('mouseleave', exit);


        return () => {
            canvas.removeEventListener('mousedown', startDraw);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', exit);
            canvas.removeEventListener('mouseleave', exit);
        }

    }, [myTurn, imgStatus, startDraw, draw, exit]);
    
    useEffect(() => {
        
        setTimeout(()=>{
            setInit(true);
            setIdx(1);
            if(user.getStreamManager().stream.streamId === initData?.id){
                setMyturn(true);
                setTimeFlag(true);
            }
            if(user.getStreamManager().stream.streamId === initData?.nextId){
                setNext(true);
            }
        }, 10000);
        user.getStreamManager().stream.session.on("signal:game", (response : any) => {
            console.log(response.data, "여긴 게임 안이에요");
            console.log(user.getStreamManager().stream.streamId, user.getStreamManager().stream.streamId === response.data.curStreamId);

            if(response.data.answerYn){
                const imagesrc = response.data.allImages.split('|');
                console.log(imagesrc);
                if(response.data.answerYn === 'Y') {
                    setAnsFlag(true);
                    setEnd(true);
                    setAllimage([...imagesrc]);
                }
                else{
                    setEnd(true);
                    setAllimage([...imagesrc]);
                }
            }
            else{
                if(response.data.orderStatus === 0 || response.data.orderStatus === 1){
                    if(user.getStreamManager().stream.streamId === response.data.curStreamId){
                        console.log(nextRef.current, "씨발");
                        if(nextRef.current){
                            console.log("???왜 안됨 제발 제발");
                            setMyturn(true);
                            // setTimeFlag(true);
                            setImgStatus(true);
                            setSrc(response.data.imageUrl);
                            setNext(false);
                            setIdx(response.data.index);
                        }
                    }
                    if(user.getStreamManager().stream.streamId === response.data.nextStreamId){
                        setNext(true);
                    }
                }
                else if(response.data.orderStatus === 2){
                    if(user.getStreamManager().stream.streamId === response.data.curStreamId){
                        if(nextRef.current){
                            setNext(false);
                            setIdx(response.data.index);
                            setSrc(response.data.imageUrl);
                            setLast(true);
                        }
                    }
                }
            }
        });
    },[]);


    return(
        <>
        {init === false ? (
            <div style={{
                width : "60vw",
                height : "80vh",
                backgroundColor : "white",
                marginTop : "-10vh",
                // overflow : "auto",
                display : "flex",
                flexDirection : "column",
                justifyContent : "center",
                alignItems : "flex-start"
            }}>

                <div>1. 첫 번째 사람은 제시어를 보고 제한시간안에 그림으로 묘사 해주세요</div>
                <div>2. 다음 사람부터 전 사람이 그린 그림을 보고 최대한 유사하게 그림을 그려주세요</div>
                <div>3. 마지막 사람은 최종 결과물을 보고 정답을 맞춰주세요</div>
                <div>4. 게임 진행 순서는 모두 랜덤입니다! 긴장 풀지 마세요!</div>
                
            </div>
        ): (
            <div id="parent" style={{
                width : "60vw",
                height : "80vh",
                backgroundColor : "white",
                marginTop : "-10vh",
                // overflow : "auto",
                borderRadius : "10px"
            }}>
            {last === true ? (
                <div style={{
                    position : "relative"
                }}>
                    <div style={{
                        position : "absolute",
                        fontSize : "2rem",
                        right : 0,
                        marginTop : "2vh",
                        marginRight : "2vw",
                        color : "black"
                    }}>{lastTime}</div>
                    <img style={{
                        width : "60vw",
                        height : "80vh",
                        objectFit : "cover",
                        borderRadius : "10px"
                    }} src={src}></img>
                    <input className={style.answerInputBox}
                    onChange = {handleChangeValue} onKeyDown={handleKeyDownEnter} placeholder="정답을 입력해주세요"></input>
                </div>
            ) : null}
            {myTurn === true? 
                imgStatus === true ? 
                (
                    <div style={{
                        position : "relative"
                    }}>
                        <div style={{
                            position : "absolute",
                            color : "red",
                            fontSize : "2rem",
                            right : 0,
                            marginTop : "3vh",
                            marginRight : "2vw"
                        }}>{imgTime}</div>
                        <img style={{
                            width : "60vw",
                            height : "80vh",
                            objectFit : "cover",
                            borderRadius : "10px"
                        }} src={src}></img>
                    </div>
                ) 
                : (<>
                    <div className={style.container}>
                        <div className={style.answerBox}>
                            제시어
                            <div className={style.answer}>홍승기</div>
                        </div>
                        <div className={style.timer}
                            style={ time < 10 ? {
                                color : "red"
                            } : { color : "black"}}>
                            {time}
                        </div>
                        <button className={style.submit} onClick={sendSignal}>제출</button>
                    </div>
                    
                    <canvas ref={canvasRef}
                    style={{
                        zIndex : 9999,
                        backgroundColor : "white",
                        borderRadius : "10px",
                        // position : "absolute"
                    }}
                    // width={700} height={700}
                    ></canvas></>) 
                : 
                (<> 
                    {nextTurn === true ? (<> 기다려 다음은 너다</>)
                    : end === true ? (
                    <>
                        <div style={{
                            width : "60vw",
                            height : "inherit",
                            display : "grid",
                            gridTemplateColumns : "1fr 1fr 1fr",
                            gridTemplateRows : "1fr 1fr",
                        }}>
                            {allImage.map((v : string, i : number) => {
                                const idx = i;
                                if(idx == allImage.length-1) return;
                                return(
                                        <img key={idx} src ={`${v}`} style={{width : "100%", height : "100%", objectFit : "cover"}}/>
                                )
                            })}
                        </div>
                    </>)
                    : last === true ? null : (<>기다려</>)}
                </>)}
                    
                </div>)}
        </>
    )
}

export default Catchmind