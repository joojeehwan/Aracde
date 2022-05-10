import create from 'zustand';

export const modalStore = create<{
  romId: number;
  setRoomId: (payload: number) => void;
  histoty: any;
  setHistory: (payload: any) => void
}>((set) => ({
  romId: 0,
  histoty: null,
  setRoomId: (payload: number) => set((state) => ({ romId: payload })),
  setHistory: (payload: any) => set((state) => ({ histoty: payload }))
}));
