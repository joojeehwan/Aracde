import React, { useCallback, useState } from 'react';
import style from '../../../styles/Invite.module.scss';
import { toast } from 'react-toastify';

//components
import ChatInviteSearhBar from '../../ChattingComponents/ChatSearch/ChatInviteSearhBar';
import ChatInviteSearhResults from '../../ChattingComponents/ChatSearch/ChatInviteSearhResults';

//api
import ChatApi from '../../../../../common/api/ChatAPI';

type MyProps = {
  open: boolean;
  onClose: (e: any) => void;
};

function ChatInvite({ open, onClose, handleFlag }: any) {
  const [friend, setFriend] = useState<{ userSeq: number; name: string; canInvite: boolean; image: string }[]>([]);
  const { getChatSearchResult } = ChatApi;

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleSearchPeople = async (name: string) => {
    const result = await getChatSearchResult(name);
    if (result?.status === 200) {
      setFriend([...result.data]);
    }
  };

  return (
    <div
      className={open ? `${style.openModal} ${style.modal}` : style.modal}
      onClick={onClose}
      onKeyDown={handleStopEvent}
      role="button"
      tabIndex={0}
    >
      {open ? (
        <section
          className={style.modalForm}
          onClick={handleStopEvent}
          onKeyDown={handleStopEvent}
          role="button"
          tabIndex={0}
        >
          <ChatInviteSearhBar searchPeople={handleSearchPeople} />
          {friend.map((value) => {
            return (
              <ChatInviteSearhResults
                key={value.name}
                onClose={onClose}
                name={value.name}
                isInvite={value.canInvite}
                image={value.image}
                userSeq={value.userSeq}
                handleFlag={handleFlag}
              />
            );
          })}
          <div className={style.CancelContainer}>
            <button onClick={onClose} className={style.cancel}>
              취소
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ChatInvite;
