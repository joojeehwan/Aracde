import React from 'react';
import style from '../../../Modal/styles/Chatting.module.scss';
import dayjs from 'dayjs';
import { ChatWrapper } from '../../styles/ChattingStyles';
import Avatar from '@mui/material/Avatar';
import SockJS from 'sockjs-client/dist/sockjs';

function ChatEach({ name, content, time }: any) {
  const senderName = name;
  const UserName = '주지환';
  // 저 2개가 다르면 왼쪽에
  // 같으면 오른쪽에 붙어서 chat List에 담으면 될거같다.
  return (
    <ChatWrapper className={`${senderName === UserName && style.self}`}>
      <div className="chat-img" style={{ marginLeft: '-10px', zIndex: 1 }}>
        <Avatar alt="사진" sx={{ width: 56, height: 56 }} />
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
