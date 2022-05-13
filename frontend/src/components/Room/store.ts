import create from 'zustand';

export const useStore = create<{
  sessionId: any;
  setSessionId: (payload: any) => void;
  clientt: any;
  setClientt: (payload: any) => void;
}>((set) => ({
  sessionId: '',
  setSessionId: (payload: any) => set((state) => ({ sessionId: payload })),
  clientt: null,
  setClientt: (payload: any) => set((state) => ({ clientt: payload })),
}));
