import { IDM } from '../typings/db';
import dayjs from 'dayjs';

// 날짜 별로 분기해서 채팅창에 선 긋기
export default function makeSection<T extends IDM>(chatList: T[]) {
  const sections: { [key: string]: T[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
