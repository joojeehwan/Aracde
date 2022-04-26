import React from 'react';
import ReactModal from 'react-modal';

//styles
import styles from '../styles/Alarms.module.scss';
import '../styles/styles.css';

//png
import pos from '../../../assets/Modal/positive.png';
import neg from '../../../assets/Modal/negative.png';

interface MyProps {
  open: boolean;
  onClose: (e: any) => void;
}

const dummydata = [
  { key: '1', message: '박현우님이 친구 요청을 보냈습니다.' },
  { key: '2', message: '박현우님이 방에 초대하셨습니다.' },
];

function Alarms({ open, onClose }: MyProps) {
  return (
    <>
      <ReactModal
        className={styles.ReactModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
        }}
        isOpen={open}
        onRequestClose={onClose}
        contentLabel="알람"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <button onClick={onClose}>CloseModal</button>
        <div style={{ fontSize: '48px' }}>알림</div>
        <div>
          {dummydata.map((value) => {
            return (
              <div>
                <div style={{ fontSize: '14px', marginTop: '20px', display: 'flex' }} key={value.key}>
                  {value.message}
                  <div style={{}}>
                    <img style={{ marginRight: '10px' }} src={pos} alt="긍정" />
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <img src={neg} alt="부정" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ReactModal>
    </>
  );
}

export default Alarms;
