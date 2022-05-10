
import dayjs from 'dayjs';

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

// 날짜 별로 분기해서 section 나눠주기
export default function makeSection<T extends IDM>(chatList: T[]) {
  const sections: { [key: string]: T[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.time).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
