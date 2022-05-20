import styles from '../style/ToolbarComponent.module.scss';

import MicOff from '@mui/icons-material/MicOff';
import Mic from '@mui/icons-material/Mic';
import Videocam from '@mui/icons-material/Videocam';
import VideocamOff from '@mui/icons-material/VideocamOff';

function ToolbarComponent({ user, camStatusChanged, micStatusChanged }: any) {
  const localUser = user;
  return (
    <div className={styles.toolbar}>
      <div className={styles.buttonClass}>
        <button className={styles.buttons} onClick={micStatusChanged}>
          {localUser !== undefined && localUser.isAudioActive() ? (
            <Mic
              style={{
                marginTop: '5px',
              }}
            />
          ) : (
            <MicOff
              style={{
                marginTop: '5px',
              }}
              color="secondary"
            />
          )}
        </button>

        <button className={styles.buttons} onClick={camStatusChanged}>
          {localUser !== undefined && localUser.isVideoActive() ? <Videocam /> : <VideocamOff color="secondary" />}
        </button>
      </div>
    </div>
  );
}

export default ToolbarComponent;
