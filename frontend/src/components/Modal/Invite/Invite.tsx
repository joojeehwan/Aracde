import React, { useCallback, useState } from 'react';
import style from '../styles/Invite.module.scss';
import { toast } from 'react-toastify';

//components
import InviteSearchBar from '../Invite/InviteSearch/InviteSearhBar';
import InviteSearhResults from '../Invite/InviteSearch/InviteSearhResults';

type MyProps = {
  open: boolean;
  onClose: (e: any) => void;
};

const dummydata = [
  { name: '홍승기', isInvite: true },
  { name: '주지환', isInvite: false },
];

function Invite({ open, onClose }: MyProps) {
  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
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
          <InviteSearchBar />
          {dummydata.map((value) => {
            return <InviteSearhResults key={value.name} name={value.name} isInvite={value.isInvite} />;
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

export default Invite;
