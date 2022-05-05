import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
//styles
import { StickyHeader, Section, Button, Input, Label } from '../styles/ChattingStyles';
import styles from '../styles/Chatting.module.scss';
//png
import plus from '../../../assets/Modal/Plus.png';
//mui
import Avatar from '@mui/material/Avatar';
//components
// import Modal from '../../../common/Modal';
import ChatEach from './ChattingComponents/ChatEach';
import ChatInput from './ChattingComponents/ChatInput';
import ChattingLists from './ChattingComponents/ChattingLists';
import useInput from '../../../common/hooks/useInput';
import ChatInvite from '../Chatting/ChattingComponents/ChatInvite';
import { getToken } from '../../../common/api/jWT-Token';

//api
import ChatAPI from '../../../common/api/ChatAPI';

// interface MyProps {
//   open: boolean;
//   onClose: (e: any) => void;
// }

const dummyChatList: (any | null)[] = [
  // {
  //   roomId: '1',
  //   name: '배하은',
  //   content: '캐치마인드 한판 고?!',
  //   time: '오후 5:46',
  //   unreads: 1,
  //   chatMessages: [
  //     { idx: '1', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '2', name: '배하은', content: '오케잉asfasdfasfsfasffafasdf', time: '오후 5:46' },
  //     { idx: '3', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '4', name: '배하은', content: '오케잉', time: '오후 5:46' },
  //     { idx: '5', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '6', name: '배하은', content: '오케잉', time: '오후 5:46' },
  //     { idx: '7', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '8', name: '배하은', content: '오케잉', time: '오후 5:46' },
  //     { idx: '9', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '10', name: '배하은', content: '오케잉', time: '오후 5:46' },
  //     { idx: '11', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '12', name: '배하은', content: '오케잉', time: '오후 5:46' },
  //     { idx: '13', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '14', name: '배하은', content: '오케잉', time: '오후 5:46' },
  //   ],
  // },
  // {
  //   roomId: '2',
  //   name: '홍승기',
  //   content: '캐치마인드 한판 고?!',
  //   time: '오후 5:47',
  //   unreads: 2,
  //   chatMessages: [
  //     { idx: '1', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '2', name: '홍승기', content: '오케잉asfasdfasfsfasffafasdf', time: '오후 5:46' },
  //     { idx: '3', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '4', name: '홍승기', content: '오케잉', time: '오후 5:46' },
  //     { idx: '5', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '6', name: '홍승기', content: '오케잉', time: '오후 5:46' },
  //     { idx: '7', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '8', name: '홍승기', content: '오케잉', time: '오후 5:46' },
  //     { idx: '9', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '10', name: '홍승기', content: '오케잉', time: '오후 5:46' },
  //     { idx: '11', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '12', name: '홍승기', content: '오케잉', time: '오후 5:46' },
  //     { idx: '13', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '14', name: '홍승기', content: '오케잉', time: '오후 5:46' },
  //   ],
  // },
  // {
  //   roomId: '3',
  //   name: '박현우',
  //   content: '캐치마인드 한판 고?!',
  //   time: '오후 5:48',
  //   unreads: 3,
  //   chatMessages: [
  //     { idx: '1', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '2', name: '박현우', content: '오케잉asfasdfasfsfasffafasdf', time: '오후 5:46' },
  //     { idx: '3', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '4', name: '박현우', content: '오케잉', time: '오후 5:46' },
  //     { idx: '5', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '6', name: '박현우', content: '오케잉', time: '오후 5:46' },
  //     { idx: '7', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '8', name: '박현우', content: '오케잉', time: '오후 5:46' },
  //     { idx: '9', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '10', name: '박현우', content: '오케잉', time: '오후 5:46' },
  //     { idx: '11', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '12', name: '박현우', content: '오케잉', time: '오후 5:46' },
  //     { idx: '13', name: '주지환', content: '한판 하자구!!', time: '오후 5:46' },
  //     { idx: '14', name: '박현우', content: '오케잉', time: '오후 5:46' },
  //   ],
  // },
];

function Chatting({ open, onClose, client }: any) {
  const [tab, setTab] = useState('CHATROOM');
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const [chateMessages, setChatMessages] = useState<any>([]);
  const [chatList, setChatList] = useState<any>([]);

  const [chatInvite, setChatInvite] = useState<boolean>(false);

  console.log(client);
  //api
  const { getChatList, createChatRoom } = ChatAPI;

  const handleOpenChatInvite = useCallback(() => {
    setChatInvite(true);
  }, [chatInvite]);

  const handleCloseChatInvite = useCallback(() => {
    setChatInvite(false);
  }, [chatInvite]);

  //modal

  const [showCreateChattRoomModal, setShowCreateChattRoomModal] = useState(false);
  const [newChattRoom, onChangeNewChattRoom, setNewChattRoom] = useInput('');

  const onClickCreateChattRoom = useCallback(() => {
    setShowCreateChattRoomModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateChattRoomModal(false);
  }, []);

  const publish = () => {
    if (!client.current.connected) {
      return;
    }
    const SendMessageReq = {
      chatRoomSeq: 1,
      content: chat,
    };
    client.current.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(SendMessageReq),
      headers: { Authorization: getToken() },
      skipContentLengthHeader: true,
    });

    // setMessage('');
    setChat('');
  };

  // const disconnect = () => {
  //   client.current.deactivate();
  // };

  const handleStopEvent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  //tab
  const useTabs = (inititalTabs: any, allTabs: any) => {
    const [roomId, setRoomId] = useState(inititalTabs);
    return {
      chatt: allTabs[roomId],
      chatChange: setRoomId,
    };
  };

  const { chatt, chatChange } = useTabs(0, chatList);
  const date = '2022-04-30';
  console.log(chatt);

  //객체 길이 구하기
  // const getLenfthOfObject = (obj: any): any => {
  //   let legnthOgObject = Object.keys(obj).length;
  //   return legnthOgObject;
  // };
  // console.log(getLenfthOfObject({ dummyChatList }));

  const getAndgetChatList = async () => {
    const result = await getChatList();
    console.log(result);
    if (result?.status === 200) {
      setChatList([...result.data]);
    }
  };

  useLayoutEffect(() => {
    getAndgetChatList();
  }, []);

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
          id={dummyChatList.length < 0 ? styles.test : ''}
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
                {chatList.length > 0 ? (
                  chatList?.map((section: any) => {
                    return (
                      <ChattingLists
                        setChatMessages={setChatMessages}
                        client={client}
                        chatChange={chatChange}
                        key={section.chatRoomSeq}
                        roomId={section.chatRoomSeq}
                        name={section.name}
                        image={section.image}
                        content={section.lastMessage}
                        time={section.lastTime}
                        // unreads={section.unreads}
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
                  margin: '0px 150px',
                }}
                onClick={handleOpenChatInvite}
              />
            </div>
            {chatList.length > 0 ? (
              <div className={styles.chatContent}>
                <header className={styles.chatHeader}>
                  <Avatar alt="사진" sx={{ width: 56, height: 56 }} />
                  <div style={{ marginTop: '20px', marginLeft: '20px' }}>{chatt?.name}</div>
                </header>
                <div className={styles.chatMessages}>
                  <Scrollbars autoHide>
                    <Section>
                      <StickyHeader>
                        <button>{date}</button>
                      </StickyHeader>
                      {/* 웹소켓 연결부분 */}
                      {/* {chatt?.chatMessages.map((value: any) => {
                        return <ChatEach name={value.name} content={value.content} time={value.time} key={value.idx} />;
                      })} */}
                    </Section>
                  </Scrollbars>
                </div>
                <ChatInput publish={publish} onChangeChat={onChangeChat} />
              </div>
            ) : null}
          </div>
          {/* <Modal show={showCreateChattRoomModal} onCloseModal={onCloseModal}>
            <form>
              <Label id="ChattRoom-label">
                <span>친구ID</span>
                <Input id="ChattRoom" value={newChattRoom} onChange={onChangeNewChattRoom} />
              </Label>
              <Button type="submit">생성</Button>
            </form>
          </Modal> */}
          {chatInvite ? <ChatInvite open={chatInvite} onClose={handleCloseChatInvite} /> : null}
        </section>
      ) : null}
    </div>
  );
}

export default Chatting;
