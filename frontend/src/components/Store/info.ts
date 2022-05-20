import create from 'zustand';

export const infoStore = create<{
  nickname: string;
  invitecode: string;
  setNick: (payload: string) => void;
  setInviteCode: (payload: string) => void;
}>((set) => ({
  nickname: '',
  invitecode: '',
  setNick: (payload: string) => set((state) => ({ nickname: payload })),
  setInviteCode: (payload: string) => set((state) => ({ invitecode: payload })),
}));
