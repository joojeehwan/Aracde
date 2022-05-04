class UserModel {
    connectionId;
    audioActive;
    videoActive;
    // screenShareActive;
    nickname;
    streamManager : any;
    type : string; // 'remote' | 'local'
  
    constructor() {
      this.connectionId = "";
      this.audioActive = true;
      this.videoActive = true;
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