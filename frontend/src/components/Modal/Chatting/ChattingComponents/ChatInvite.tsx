import React, { useCallback, useState } from 'react';
import style from '../../styles/Invite.module.scss';
import { toast } from 'react-toastify';

//components
import ChatInviteSearhBar from '../ChattingComponents/ChatInviteSearhBar';
import ChatInviteSearhResults from '../ChattingComponents/ChatInviteSearhResults';

//api
import ChatApi from "../../../../common/api/ChatAPI"

type MyProps = {
  open: boolean;
  onClose: (e: any) => void;
};

// const dummydata = [
//   { name: '홍승기', isInvite: true },
//   { name: '주지환', isInvite: false },
// ];

function ChatInvite({ open, onClose }: MyProps) {

  const [friend, setFriend] = useState<
    { userSeq: number; name: string; canInvite: boolean; image: string }[]
  >([]);

  const { getChatSearchResult } = ChatApi

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
            return <ChatInviteSearhResults key={value.name} name={value.name} isInvite={value.canInvite} image={value.image} userSeq={value.userSeq} />;
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
