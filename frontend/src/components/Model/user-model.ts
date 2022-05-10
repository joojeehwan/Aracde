class UserModel {
    connectionId;
    audioActive;
    videoActive;
    // screenShareActive;
    speaking;
    nickname;
    streamManager : any;
    type : string; // 'remote' | 'local'
  
    constructor() {
      this.connectionId = "";
      this.audioActive = true;
      this.videoActive = true;
      this.speaking = false;
      this.nickname = "";
      this.streamManager = null;
      this.type = "local";
    }
  
    isAudioActive() {
      return this.audioActive;
    }
  
    isVideoActive() {
      return this.videoActive;
    }
    isSpeaking(){
      return this.speaking;
    }
    getConnectionId() {
      return this.connectionId;
    }
  
    getNickname() {
      return this.nickname;
    }
  
    getStreamManager() {
      return this.streamManager;
    }
  
    isLocal() {
      return this.type === "local";
    }
    isRemote() {
      return !this.isLocal();
    }
    setAudioActive(isAudioActive : boolean) {
      
      this.audioActive = isAudioActive;
    }
    setVideoActive(isVideoActive : boolean) {
      this.videoActive = isVideoActive;
    }
  
    setStreamManager(streamManager : any) {
      this.streamManager = streamManager;
    }
    setSpeaking(payload : any) {
      this.speaking = payload;
    }
    setConnectionId(conecctionId : any ) {
      this.connectionId = conecctionId;
    }
    setNickname(nickname : string) {
      this.nickname = nickname;
    }
    setType(type : string) {
      if ((type === "local") || (type === "remote")) {
        this.type = type;
      }
    }
  }
  
  export default UserModel;