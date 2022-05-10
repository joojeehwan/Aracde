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
import ChatInvite from '../Chatting/ChattingComponents/ChatInvite';
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

function Chatting({ open, onClose, client, chattingList }: any) {
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const [chatList, setChatList] = useState<any>([]);
  const [privateChats, setPrivateChats] = useState<any>(new Map())
  const [chatInvite, setChatInvite] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false)
  //api
  const { getChatList, createChatRoom } = ChatAPI;

  const handleOpenChatInvite = useCallback(() => {
    setChatInvite(true);
  }, [chatInvite]);

  const handleCloseChatInvite = useCallback(() => {
    setChatInvite(false);
  }, [chatInvite]);

  //zustand
  const { romId, histoty } = modalStore()

  const publish = (evt: any) => {

    if (!client.current.connected) {
      return;
    }
    evt.preventDefault()
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
      console.log("scroolToBottom!", scrollbarRef.current?.getValues())
      scrollbarRef.current.scrollToBottom()
    }
  };

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const date = '2022-04-30'; // dummy data => section 나누기 필요

  const getAndgetChatList = async () => {
    const result = await getChatList();
    console.log(result)
    if (result?.status === 200) {
      setChatList([...result.data]);
    }
  };

  console.log(chattingList)
  console.log(romId)
  function islst(element: any) {
    if (element.chatRoomSeq === romId) {
      return true
    }
  }

  let ChatHeader = chattingList.find(islst)
  const test = chattingList.filter((value: any) => value.chatRoomSeq === romId)

  useEffect(() => {
    getAndgetChatList();
    return () => {
      console.log("실행되나?!")
      setIsShow(false)
      console.log(chatList)
    }
  }, []);

  // console.log(histoty?.data)
  // const test = privateChats.get(romId)
  // console.log(test)
  // console.log(histotyLst)
  // let sumChat
  // useEffect(() => {
  //   if (histotyLst !== undefined && test !== undefined) {
  //     sumChat = (histotyLst ? (histotyLst).concat(...test) : test)
  //   }
  // }, [test])

  // console.log(test)
  // console.log(histotyLst)

  const histotyLst: IDM[] = histoty?.data
  const chatSections = makeSection(histotyLst ? ([] as IDM[]).concat(...histotyLst) : [])
  console.log(ChatHeader)
  console.log(test)
  // console.log(chatSections)

  // console.log(chattingList.length)
  // console.log(romId)


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
          id={chatList.length < 0 ? styles.test : ''}
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
                        chattingList={chattingList}
                        chat={chat}
                        setIsShow={setIsShow}
                        scrollbarRef={scrollbarRef}
                        setPrivateChats={setPrivateChats}
                        privateChats={privateChats}
                        client={client}
                        key={section.chatRoomSeq}
                        roomId={section.chatRoomSeq}
                        name={section.name}
                        image={section.image}
                        content={section.lastMessage}
                        time={section.lastTime}
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
            {chattingList?.length > 0 ? (
              <div className={styles.chatContent}>
                <header className={styles.chatHeader}>
                  <Avatar alt="사진" src={ChatHeader?.image} sx={{ width: 56, height: 56 }} />
                  <div style={{ marginTop: '20px', marginLeft: '20px' }}>{ChatHeader?.name}</div>
                </header>
                <div className={styles.chatMessages}>
                  <Scrollbars autoHide ref={scrollbarRef}>
                    {Object.entries(chatSections).map(([date, chats]) => {
                      return (
                        <Section>
                          <StickyHeader>
                            <button style={{ zIndex: "100" }}>{date}</button>
                          </StickyHeader>
                          {/* 웹소켓 연결부분 */}
                          {ChatHeader !== undefined ? chats?.map((value: any) => {
                            return <ChatEach key={Math.random().toString(36).substr(2, 5)} name={value.name} time={value.time} content={value.content} userSeq={value.sender} image={value.profile} />
                          }) : null}
                        </Section>
                      )
                    })}
                    {privateChats.get(romId)?.map((value: any) => {
                      return <ChatEach key={Math.random().toString(36).substr(2, 5)} name={value.name} time={value.time} content={value.content} userSeq={value.userSeq} image={value.image} />
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
