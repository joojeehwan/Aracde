import create from 'zustand';

export const modalStore = create<{
  romId: number;
  setRoomId: (payload: number) => void;
}>((set) => ({
  romId: 0,
  setRoomId: (payload: number) => set((state) => ({ romId: payload })),
}));
