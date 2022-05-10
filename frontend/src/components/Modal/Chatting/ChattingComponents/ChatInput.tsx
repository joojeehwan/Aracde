import React from 'react';
import styles from '../../styles/Chatting.module.scss';
import useInput from '../../../../common/hooks/useInput';


interface Props {
  publish: (e: any) => void
  onChangeChat: (e: any) => void
  chat: string
}

function ChatInput({ publish, onChangeChat, chat }: Props) {

  return (
    <div className={styles.sendMessage}>
      <form className={styles.form} onSubmit={publish} >
        <input type="text" className={styles.inputMessage} placeholder="enter the message" onChange={onChangeChat} value={chat} />
        <button type="button" className={styles.sendButton} onClick={publish}>
          전송
        </button>
      </form>
    </div >
  );
}

export default ChatInput;
