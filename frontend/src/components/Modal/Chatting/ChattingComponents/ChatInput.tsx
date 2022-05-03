import React from 'react';
import styles from '../../styles/Chatting.module.scss';

function ChatInput({ publish }: any) {
  return (
    <div className={styles.sendMessage}>
      <form className={styles.form}>
        <input
          type="text"
          className={styles.inputMessage}
          placeholder="enter the message"
          // value={userData.message}
          // onChange={handleMessage}
        />
        <button type="button" className={styles.sendButton} onClick={publish}>
          전송
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
