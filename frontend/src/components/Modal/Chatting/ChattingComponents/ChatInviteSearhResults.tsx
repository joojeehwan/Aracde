import React, { useCallback, useEffect, useState } from 'react';
import style from '../../styles/Invite.module.scss';
import Char from '../../../../assets/character.png';
import ChatApi from '../../../../common/api/ChatAPI';

function ChatInviteSearhResults({ name, isInvite, userSeq, canInvite }: any) {
  const { createChatRoom } = ChatApi;

  console.log();
  const onClickCreateChatRoom = useCallback(() => {
    console.log(userSeq);
    const body = { targetUserSeq: userSeq };
    const result = createChatRoom(body);
  }, []);

  return (
    <>
      <div style={{ padding: '20px', display: 'flex', marginTop: '-5px' }}>
        <div>
          <img src={Char} style={{ height: '24px', width: '24px' }} />
        </div>
        <div style={{ marginTop: '5px', paddingLeft: '50px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <div style={{ paddingLeft: '18px' }}>
          {canInvite ? (
            <button className={style.buttonClicked}>!?</button>
          ) : (
            <button onClick={onClickCreateChatRoom} className={style.button}>
              대화하기
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatInviteSearhResults;
