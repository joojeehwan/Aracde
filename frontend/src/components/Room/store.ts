import create from 'zustand';

export const useStore = create<{ 
    sessionId: any; 
    setSessionId: (payload: any) => void; 
    clientt: any; 
    setClientt: (payload: any) => void;
    mode : string;
    setMode : (payload : string) => void;
    myMic : boolean;
    setMyMic : (payload : boolean) => void;
    myVideo : boolean;
    setMyVideo : (payload : boolean) => void;
    myTurn : boolean;
    setMyTurn : (payload : boolean) => void;
  }>((set) => ({
  sessionId: '',
  setSessionId: (payload: any) => set((state) => ({ sessionId: payload })),
  clientt: null,
  setClientt: (payload: any) => set((state) => ({ clientt: payload })),
  mode : "home",
  setMode : (payload : string) => set((state)=> ({mode : payload})),
  myMic : false,
  setMyMic : (payload : boolean) => set((state) => ({myMic : payload})),
  myVideo : false,
  setMyVideo : (payload : boolean) => set((state) => ({myVideo : payload})),
  myTurn : false,
  setMyTurn : (payload : boolean) => set((state) => ({myTurn : payload}))
}));
