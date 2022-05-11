import React, { useCallback, useEffect, useState } from 'react';
import style from '../../../styles/Invite.module.scss';
import Char from '../../../../../assets/character.png';
import ChatApi from '../../../../../common/api/ChatAPI';

function ChatInviteSearhResults({ name, isInvite, userSeq, onClose }: any) {

  const { createChatRoom } = ChatApi;

  const onClickCreateChatRoom = useCallback(async () => {
    const body = { targetUserSeq: userSeq };
    await createChatRoom(body)
    onClose()
  }, []);

  return (
    <>
      <div style={{ padding: '20px', display: 'flex', marginTop: '-5px' }}>
        <div>
          <img src={Char} style={{ height: '24px', width: '24px' }} />
        </div>
        <div style={{ marginTop: '5px', paddingLeft: '50px', paddingRight: '30px', marginLeft: '10px' }}>{name}</div>
        <div style={{ paddingLeft: '18px' }}>
          {isInvite === false ? (
            <button className={style.buttonClicked}>대화중</button>
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
