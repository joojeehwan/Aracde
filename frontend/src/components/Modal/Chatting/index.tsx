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
import makeSection from "./utils/makeSection"

//api & store
import ChatAPI from '../../../common/api/ChatAPI';
import { modalStore } from "../../../components/Modal/store/modal"

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

function Chatting({ open, onClose, client }: any) {
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  // const [chatList, setChatList] = useState<any>([]);
  const [privateChats, setPrivateChats] = useState<any>(new Map())
  const [chatInvite, setChatInvite] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false)
  const [subscribeDetail, setSubscribeDetail] = useState<subObject>()

  // 정리 useRef 객체를 이용하는 결정적인 이유,,?! 외부라이브러리의 객체를 사용 => ref를 통해 관리하는게 좋음
  // 컴포넌트의 전 생명주기를 통해 유지되는 값이라는 의미이며, 
  // 순수한 자바스크립트 객체를 생성 및 유지시켜주기 때문에 
  // 동시성을 유지하기 위함!
  const { fetchWithToken, getChatList } = ChatAPI;

  const { data: chattingList } = useSWR(process.env.REACT_APP_API_ROOT + '/chat', (url) =>
    fetchWithToken(url, getToken() as unknown as string), {
    refreshInterval: 1,
  });

  const subscribeRef = useRef(subscribeDetail)
  subscribeRef.current = subscribeDetail

  //정리 set함수를 props보낼때 함수에 싸서 보내는구먼,,! 
  const handleSubscribeDetail = (data: any) => {
    setSubscribeDetail(data)
  }
  //api
  const handleOpenChatInvite = useCallback(() => {
    setChatInvite(true);
  }, [chatInvite]);

  const handleCloseChatInvite = useCallback(() => {
    setChatInvite(false);
  }, [chatInvite]);

  //zustand
  const { romId, histoty } = modalStore()
  const [history, setHistory] = useState(histoty)

  const publish = (evt: any) => {

    if (!client.current.connected) {
      return;
    }
    evt.preventDefault()
    console.log(chat)
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

    setChat(" ")
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollToBottom()
    }
  };

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const getAndgetChatList = async () => {
    const result = await getChatList();
    if (result?.status === 200) {
      // setChatList([...result.data]);
    }
  };

  const unsub = () => {
    if (!subscribeRef.current) return
    const value = subscribeRef.current
    value.unsubscribe()
  }

  //ver1
  function islst(element: any) {
    if (element.chatRoomSeq === romId) {
      return true
    }
  }
  let ChatHeader = chattingList?.find(islst)
  //ver2
  const test = chattingList?.filter((value: any) => value.chatRoomSeq === romId)

  useEffect(() => {
    console.log("채팅방 useEffect")
    getAndgetChatList();
    console.log(client, "클라이언트 tt 채팅 인덱스")
    return () => {
      // 채팅창 닫아도 sub/detail 모두 구취 해야 함
      unsub()
      setIsShow(false)
      console.log(subscribeRef.current)
    }
  }, []);

  useEffect(() => {
    console.log(privateChats)
    setTimeout(() => {
      scrollbarRef.current?.scrollToBottom()
    }, 1)
  }, [subscribeRef.current])

  const histotyLst: IDM[] = histoty?.data
  const chatSections = makeSection(histotyLst ? ([] as IDM[]).concat(...histotyLst) : [])

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
          // id={chatList.length < 0 ? styles.test : ''}
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
                {chattingList?.length > 0 ? (
                  chattingList?.map((section: any) => {
                    return (
                      <ChattingLists
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
                  <div style={{ width: '250px', textAlign: 'end' }}>채팅이 없습니다.</div>
                )}
              </div>
              <img
                src={plus}
                style={{
                  height: '64px',
                  width: '64px',
                  display: 'block',
                  margin: '0px 80px',
                }}
                onClick={handleOpenChatInvite}
              />
            </div>
            {isShow ? (
              <div className={styles.chatContent}>
                <header className={styles.chatHeader}>
                  <Avatar alt="사진" src={ChatHeader?.image} sx={{ width: 56, height: 56 }} />
                  <div style={{ marginTop: '20px', marginLeft: '20px' }}>{ChatHeader?.name}</div>
                </header>
                <div className={styles.chatMessages}>
                  <Scrollbars autoHide ref={scrollbarRef}>
                    {Object.entries(chatSections).map(([date, chats], i: number) => {
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
                    })}
                    {privateChats.get(romId)?.map((value: any) => {
                      return <ChatEach key={value.realTime} name={value.name} time={value.time} content={value.content} userSeq={value.userSeq} image={value.image} />
                    })}
                  </Scrollbars>
                </div>
                <ChatInput publish={publish} onChangeChat={onChangeChat} chat={chat} />
              </div>
            ) : null}
          </div>

          {chatInvite ? <ChatInvite open={chatInvite} onClose={handleCloseChatInvite} /> : null}
        </section>
      ) : null}
    </div>
  );
}

export default Chatting;
