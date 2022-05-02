export interface IUser {
  id: number;
  nickname: string;
  email: string;
}

export interface IDM {
  // DM 채팅
  id: number;
  SenderId: number; // 보낸 사람 아이디
  Sender: IUser;
  content: string;
  createdAt: Date;
}

export interface IChannel {
  id: number;
  name: string; // ? 있을려나?!
}
