import React, { useCallback, useState } from 'react';
import style from '../styles/Invite.module.scss';
import { toast } from 'react-toastify';
import UserApi from "../../../common/api/UserApi"
//components
import InviteSearchBar from '../Invite/InviteSearch/InviteSearhBar';
import InviteSearhResults from '../Invite/InviteSearch/InviteSearhResults';

type MyProps = {
  open: boolean;
  onClose: (e: any) => void;
};

function Invite({ open, onClose }: MyProps) {

  const [friend, setFriend] = useState<{ userSeq: number; name: string; canInvite: boolean; image: string, login: boolean; email: string }[]>([]);

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const { getSearchUserResultForGame } = UserApi;

  const handleSearchPeople = async (name: string) => {
    const result = await getSearchUserResultForGame(name);
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
          <InviteSearchBar searchPeople={handleSearchPeople} />
          <div className={style.InviteAddContainer}>
            {friend.map((value, i) => {
              const idx = i
              return <InviteSearhResults key={idx} name={value.name} isInvite={value.canInvite} targetUserSeq={value.userSeq} login={value.login} image={value.image} email={value.email} />;
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Invite;
