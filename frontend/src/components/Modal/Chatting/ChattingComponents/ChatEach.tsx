import React from 'react';
import style from '../../../Modal/styles/Chatting.module.scss';
import dayjs from 'dayjs';
import { ChatWrapper } from '../../styles/ChattingStyles';
import Avatar from '@mui/material/Avatar';
import SockJS from 'sockjs-client/dist/sockjs';

function ChatEach({ name, content, time, image }: any) {
  const myname = name;
  const UserName = window.localStorage.getItem("name");

  return (
    <ChatWrapper className={`${myname === UserName && style.self}`}>
      <div className="chat-img" style={{ marginLeft: '-10px', zIndex: 1 }}>
        <Avatar alt="사진" src={image} sx={{ width: 56, height: 56 }} />
      </div>
      <div className="chat-text" style={{ marginLeft: '20px' }}>
        <div className="chat-user">
          <b>{name}</b>
          <span>{time}</span>
        </div>
        <p>{content}</p>
      </div>
    </ChatWrapper>
  );
}

export default ChatEach;
