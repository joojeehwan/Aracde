import React, { FC, useMemo, memo } from 'react';
import style from '../../../Modal/styles/Chatting/module.scss';
import dayjs from 'dayjs';
import { ChatWrapper } from '../../styles/chattingStyles';
import Avatar from '@mui/material/Avatar';
import SockJS from 'sockjs-client/dist/sockjs';

function ChatEach() {
  console.dir(SockJS);
  return (
    <ChatWrapper>
      <div className="chat-img" style={{ marginLeft: '-40px' }}>
        <Avatar alt="사진" sx={{ width: 56, height: 56 }} />
      </div>
      <div className="chat-text" style={{ marginLeft: '20px' }}>
        <div className="chat-user">
          <b>주지환</b>
          <span>오후 6시 45분</span>
        </div>
        <p>이거 되냐?!!</p>
      </div>
    </ChatWrapper>
  );
}

export default ChatEach;
