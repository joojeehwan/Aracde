import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import useSWR from 'swr';
import dayjs from 'dayjs';
//styles
import { StickyHeader, Section, Button, Input, Label } from '../styles/ChattingStyles';
import styles from '../styles/Chatting.module.scss';
import plus from '../../../assets/Modal/Plus.png';

//mui
import Avatar from '@mui/material/Avatar';

//components
import ChatEach from './ChattingComponents/ChatEach';
import ChatInput from './ChattingComponents/ChatInput';
import ChattingLists from './ChattingComponents/ChattingLists';
import useInput from '../../../common/hooks/useInput';
import ChatInvite from '../Chatting/ChattingComponents/ChatSearch/ChatInvite';
import { getToken } from '../../../common/api/jWT-Token';
import makeSection from './utils/makeSection';

//api & store
import ChatAPI from '../../../common/api/ChatAPI';
import { modalStore } from '../../../components/Modal/store/modal';

interface IDM {
  // DM 채팅
  chatRoomSeq: number;
  sender: number; // 보낸 사람 아이디 userSeq
  name: string;
  messageSeq: number;
  modifiedDate: null;
  createdDate: null;
  profile: string;
  content: string;
  time: string;
}
//정리// 콘솔 찍어보고 맞는 함수 타입 설정,,!
interface subObject {
  id: string;
  unsubscribe: () => void;
}

function Chatting({ open, onClose, client, handleChatBell }: any) {
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const [chatList, setChatList] = useState<any>([]);
  const [privateChats, setPrivateChats] = useState<any>(new Map());
  const [chatInvite, setChatInvite] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [subscribeDetail, setSubscribeDetail] = useState<subObject>();
  const [flag, setFlag] = useState(false);

  const handleFlag = () => {
    setFlag(true);
  };

  // 정리 useRef 객체를 이용하는 결정적인 이유,,?! 외부라이브러리의 객체를 사용 => ref를 통해 관리하는게 좋음
  // 컴포넌트의 전 생명주기를 통해 유지되는 값이라는 의미이며,
  // 순수한 자바스크립트 객체를 생성 및 유지시켜주기 때문에
  // 동시성을 유지하기 위함!
  const { getChatList } = ChatAPI;

  const subscribeRef = useRef(subscribeDetail);
  subscribeRef.current = subscribeDetail;

  //정리 set함수를 props보낼때 함수에 싸서 보내는구먼,,!
  const handleSubscribeDetail = (data: any) => {
    setSubscribeDetail(data);
  };
  //api
  const handleOpenChatInvite = useCallback(() => {
    setChatInvite(true);
  }, [chatInvite]);

  const handleCloseChatInvite = useCallback(() => {
    setChatInvite(false);
  }, [chatInvite]);

  //zustand
  const { romId, histoty } = modalStore();

  const publish = (evt: any) => {
    if (!client.current.connected) {
      return;
    }

    evt.preventDefault();
    const SendMessageReq = {
      chatRoomSeq: romId,
      content: chat,
    };
    client.current.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(SendMessageReq),
      headers: { Authorization: getToken() },
      skipContentLengthHeader: true,
    });

    setChat(' ');
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom();
    }
  };

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const getAndgetChatList = async () => {
    const result = await getChatList();
    if (result?.status === 200) {
      setChatList([...result.data]);
    }
    if (flag === true) {
      setFlag(false);
    }
  };

  useEffect(() => {
    getAndgetChatList();
  }, [flag]);

  const unsub = () => {
    if (!subscribeRef.current) return;
    const value = subscribeRef.current;
    value.unsubscribe();
  };

  //정리 리스트 안의 객체에서 특정값 있는지 여부 확인
  //ver1
  function islst(element: any) {
    if (element.chatRoomSeq === romId) {
      return true;
    }
  }
  let ChatHeader = chatList?.find(islst);
  //ver2
  const test = chatList?.filter((value: any) => value.chatRoomSeq === romId);

  useEffect(() => {
    return () => {
      // 채팅창 닫아도 sub/detail 모두 구취 해야 함
      unsub();
      setIsShow(false);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollbarRef.current?.scrollToBottom();
    }, 1);
  }, [subscribeRef.current]);

  // const chatSections = makeSection(history ? ([] as IDM[]).concat(history) : [])
  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      onClick={onClose}
      onKeyDown={handleStopEvent}
      role="button"
      tabIndex={0}
    >
      {open ? (
        <section
          className={styles.modalForm}
          onClick={handleStopEvent}
          onKeyDown={handleStopEvent}
          role="button"
          tabIndex={0}
        >
          <div className={styles.chatBox}>
            <div
              style={{
                display: 'flex',
                padding: '20px',
                marginLeft: '20px',
                marginTop: '-10px',
                flexDirection: 'column',
              }}
              className={styles.chatList}
            >
              <div style={{ height: '600px', width: '400px' }}>
                {chatList?.length > 0 ? (
                  chatList?.map((section: any) => {
                    return (
                      <ChattingLists
                        handleChatBell={handleChatBell}
                        setIsShow={setIsShow}
                        chat={chat}
                        scrollbarRef={scrollbarRef}
                        setPrivateChats={setPrivateChats}
                        privateChats={privateChats}
                        client={client}
                        login={section.login}
                        key={section.chatRoomSeq}
                        roomId={section.chatRoomSeq}
                        name={section.name}
                        image={section.image}
                        content={section.lastMessage}
                        time={section.lastTime}
                        handleSubscribe={handleSubscribeDetail}
                        unsub={unsub}
                      />
                    );
                  })
                ) : (
                  <div
                    style={{ width: '250px', textAlign: 'end', position: 'relative', top: '50%', marginLeft: '10px' }}
                  >
                    대화방이 없습니다.
                  </div>
                )}
              </div>
              <div>
                <img className={isShow ? styles.plusOn : styles.plusOff} src={plus} onClick={handleOpenChatInvite} />
              </div>
            </div>
            {isShow ? (
              <div className={styles.chatContent}>
                <header className={styles.chatHeader}>
                  <Avatar alt="사진" src={ChatHeader?.image} sx={{ width: 56, height: 56 }} />
                  <div style={{ marginTop: '20px', marginLeft: '20px' }}>{ChatHeader?.name}</div>
                </header>
                <div className={styles.chatMessages}>
                  <Scrollbars autoHide ref={scrollbarRef}>
                    {/* {Object.entries(chatSections).map(([date, chats], i: number) => {
                      const key = i
                      return (
                        <Section key={key}>
                          <StickyHeader>
                            <button>{date}</button>
                          </StickyHeader>
                          {ChatHeader !== undefined ? chats?.map((value: any) => {
                            return <ChatEach key={Math.random().toString(36).substr(2, 5) + value.time} name={value.name} time={value.time} content={value.content} userSeq={value.sender} image={value.profile} />
                          }) : null}
                        </Section>
                      )
                    })} */}
                    {histoty?.map((value: any) => {
                      return (
                        <ChatEach
                          key={Math.random().toString(36).substr(2, 5) + value.time}
                          name={value.name}
                          time={value.time}
                          content={value.content}
                          userSeq={value.sender}
                          image={value.profile}
                        />
                      );
                    })}
                    {privateChats.get(romId)?.map((value: any) => {
                      return (
                        <ChatEach
                          key={value.realTime}
                          name={value.name}
                          time={value.time}
                          content={value.content}
                          userSeq={value.userSeq}
                          image={value.image}
                        />
                      );
                    })}
                  </Scrollbars>
                </div>
                <ChatInput publish={publish} onChangeChat={onChangeChat} chat={chat} />
              </div>
            ) : null}
          </div>

          {chatInvite ? <ChatInvite open={chatInvite} onClose={handleCloseChatInvite} handleFlag={handleFlag} /> : null}
        </section>
      ) : null}
    </div>
  );
}

export default Chatting;
