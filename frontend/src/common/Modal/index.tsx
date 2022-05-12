// import { CreateModal, CloseModalButton } from './styles';
import React, { FC, PropsWithChildren, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<PropsWithChildren<Props>> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    // <CreateModal onClick={onCloseModal}>
    //   <div onClick={stopPropagation}>
    //     <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
    //     {children}
    //   </div>
    // </CreateModal>
    <><h1>ㅎㅇㅎㅇ</h1></>
  );
};

export default Modal;
