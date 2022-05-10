import React, { useState } from 'react';
import style from '../../../Modal/styles/Chatting.module.scss';
import dayjs from 'dayjs';
import { ChatWrapper } from '../../styles/ChattingStyles';
import Avatar from '@mui/material/Avatar';
import SockJS from 'sockjs-client/dist/sockjs'

function ChatEach({ name, content, time, image, userSeq }: any) {

  const [chatSeq, setChatSeq] = useState<number>(userSeq)
  const [loginUserSeq, setLoginUserSeq] = useState(Number(window.localStorage.getItem("userSeq")))
  const [newTime, setNewTime] = useState(dayjs(time))

  return (
    <ChatWrapper style={{ zIndex: "-100" }} className={`${chatSeq === loginUserSeq && style.self}`}>
      <div className="chat-img" style={{ marginLeft: '-10px', zIndex: 1 }}>
        <Avatar alt="사진" src={image} sx={{ width: 56, height: 56 }} />
      </div>
      <div className="chat-text" style={{ marginLeft: '20px' }}>
        <div className="chat-user">
          <b>{name}</b>
          <span>{dayjs(newTime).format('h:mm A')}</span>
        </div>
        <p>{content}</p>
      </div>
    </ChatWrapper>
  );
}

export default ChatEach;
