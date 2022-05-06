import { debounce } from "@mui/material";

import React, { useCallback, useEffect, useRef, useState } from "react";

import style from '../style/Catchmind.module.scss';

type MyProps = {
    answer : string,

}

function Catchmind() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<{x : number, y : number} | undefined>();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [timeFlag, setTimeFlag] = useState<boolean>(true);
    const [myTurn, setMyturn] = useState<boolean>(false);
    const [time, setTime] = useState<number>(60);
    const [init, setInit] = useState<boolean>(false);


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
    useEffect(()=>{
        if(timeFlag){
            const countDown = setInterval(()=>{
                if(time === 0){
                    // 여기서 정답 그림 제출 시그널 요청
                    clearInterval(countDown);
                    setTimeFlag(false);
                }
                else{
                    setTime(time-1);
                }
            }, 1000);
            return () => clearInterval(countDown);
        }
        else{
            console.log("?????");
        }
    }, [time]);

    useEffect(() => {
        
        setTimeout(()=>{
            setInit(true);
            setMyturn(true);
        }, 10000);
        // if(!canvasRef.current) return;
            
        // const canvas : HTMLCanvasElement = canvasRef.current;
        // const p : HTMLDivElement = document.getElementById("parent") as HTMLDivElement;
        // console.log("??ASDASDASD 제발");
        // canvas.style.width = "100%";
        // canvas.style.height = "100%";
        // canvas.width = p.offsetWidth;
        // canvas.height = p.offsetHeight;
        
        // window.addEventListener('resize', handleResize);
        // return () => {
        //     window.removeEventListener('resize', handleResize);
        // };
    },[]);
    useEffect(()=>{
        if(myTurn){
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
    }, [myTurn]);
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

    }, [myTurn,startDraw, draw, exit]);
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
            }}>
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
                    
                </div>
                
            <canvas ref={canvasRef}
            style={{
                zIndex : 9999,
                // position : "absolute"
            }}
            // width={700} height={700}
            ></canvas>
            </div>
        )}
        </>
    )
}

export default Catchmind