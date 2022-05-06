import React from 'react';
import styles from '../../styles/Chatting.module.scss';
import useInput from '../../../../common/hooks/useInput';

function ChatInput({ publish, onChangeChat }: any) {
  return (
    <div className={styles.sendMessage}>
      <form className={styles.form} >
        <input type="text" className={styles.inputMessage} placeholder="enter the message" onChange={onChangeChat} />
        <button type="button" className={styles.sendButton} onKeyDown={publish}>
          전송
        </button>
      </form>
    </div >
  );
}

export default ChatInput;
