import React, { useRef, useCallback, useEffect } from 'react';
import styles from '../../styles/Chatting.module.scss';
import useInput from '../../../../common/hooks/useInput';

interface Props {
  publish: (e: any) => void
  onChangeChat: (e: any) => void
  chat: string
}

function ChatInput({ publish, onChangeChat, chat }: Props) {

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onKeydownChat = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          publish(e);
        }
      }
    },
    [publish],
  );

  return (
    <div className={styles.sendMessage}>
      <form className={styles.form} >
        <textarea style={{ overflow: "hidden" }} ref={textareaRef} onKeyPress={onKeydownChat} className={styles.inputMessage} placeholder="enter the message" onChange={onChangeChat} value={chat} />
        <button type="button" className={styles.sendButton} onClick={publish}>
          전송
        </button>
      </form>
    </div >
  );
}

export default ChatInput;
