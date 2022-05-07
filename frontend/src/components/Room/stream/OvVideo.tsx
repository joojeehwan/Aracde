import { useState, useEffect, useRef } from 'react';
import styles from '../style/OvVideo.module.scss';

type MyProps = {
  user: any;
  mutedSound: boolean;
};

function OvVideo({ user, mutedSound }: MyProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  console.log('video render');
  console.log('비디오 그자체?!');

  // console.log(user);
  useEffect(() => {
    console.log('PROPS: ', user.streamManager);
    console.log('PROPS: ', user);
    if (user.streamManager && !!videoRef) {
      console.log('PROPS: ', user.streamManager);
      console.log('PROPS: ', user);
      console.log(videoRef.current);
      user.getStreamManager().addVideoElement(videoRef.current);
    }

    if (user && user.streamManager.session && !!videoRef) {
      user.streamManager.session.on('signal:userChanged', (event: any) => {
        const data = JSON.parse(event.data);
        if (data.isScreenShareActive !== undefined) {
          user.getStreamManager().addVideoElement(videoRef.current);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user && !!videoRef) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
  }, [user]);

  return <video autoPlay={true} ref={videoRef} muted={mutedSound} className={styles.video} />;
}

export default OvVideo;
