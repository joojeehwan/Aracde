import React, { useCallback, useState, useEffect } from 'react';
import styles from '../styles/Friends.module.scss';
import FriendsList from './FriendsList';
import FriendsSeachBar from './FriendsAdd/FriendsSearhBar';
import FriendsSearchResults from './FriendsAdd/FriendsSearchResults';
import UserApi from '../../../common/api/UserApi';

interface MyProps {
  // client : any;
  open: boolean;
  onClose: (e: any) => void;
}

function Friends({ open, onClose }: MyProps) {
  const [friend, setFriend] = useState<
    { userSeq: number; email: string; name: string; image: string; status: number; login: boolean }[]
  >([]);
  const [people, setPeople] = useState<
    { userSeq: number; email: string; name: string; image: string; status: number; login: boolean }[]
  >([]);
  const [label, setLabel] = useState([]);
  const [number, setNum] = useState([]);
  const [tab, setTab] = useState(0);
  const [isDelete, setIsDelete] = useState(false);

  const { getUserSearchResult, getFriendList } = UserApi;

  const handletab = useCallback(
    (value: any) => {
      setTab(value);
    },
    [tab],
  );
  const stopEvent = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  const handleSearchPeople = async (name: string) => {
    const result = await getUserSearchResult(name);
    if (result?.status === 200) {
      setPeople([...result.data]);
    }

  };

  const getAndgetFriendList = async () => {
    const result = await getFriendList()
    console.log(result)
    if (result?.status === 200) {
      setFriend([...result.data])
    }
    if (isDelete === true) {
      setIsDelete(false)
    }
  }

  useEffect(() => {
    getAndgetFriendList()
    setPeople([])
  }, [tab, isDelete])

  console.log(friend)

  const rendertab = (value: any) => {
    if (value >= 0 && value < 5) {
      return (
        <div className={styles.friendList}>
          {value === 0 ? (
            <div className={styles.friendListContainer}>
              {friend.map((value, i) => {
                const idx = i;
                return <FriendsList key={idx} imgUrl={value.image} name={value.name} userSeq={value.userSeq} setIsDelete={setIsDelete} login={value.login} email={value.email} />;
              })}
            </div>
          ) : (
            <>
              <FriendsSeachBar searchPeople={handleSearchPeople} />
              <div className={styles.friendAddContainer}>
                {people.map((value, i) => {
                  const idx = i;
                  return (
                    <FriendsSearchResults
                      seq={value.userSeq}
                      key={idx}
                      imgUrl={value.image}
                      name={value.name}
                      email={value.email}
                      status={value.status}
                      login={value.login}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className={`${styles.openModal} ${styles.modal}`} onClick={onClose}>
      <div onClick={stopEvent}>
        <ul className={styles.tabs}>
          <li className={`${tab === 0 ? styles.active : ''}`} onClick={() => handletab(0)}>
            친구 목록
          </li>
          <li className={`${tab === 1 ? styles.active : ''}`} onClick={() => handletab(1)}>
            친구 추가
          </li>
        </ul>
        {rendertab(tab)}
      </div>
    </div>
  );
}


export default Friends;
