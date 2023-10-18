'use client';

import FriendsListItem from "./FriendsListItem";
import Loading from "./Loading";
import { useContext, useEffect, useState } from "react";
import { FriendContext } from "./SSEProvider";

import styles from "../styles/friendsPage.module.css";

const FriendsList = () => {
    const {friends, friendProcess} = useContext(FriendContext);
    const [string, setString] = useState('');
    const [isChild, setIsChild] = useState(true);

    useEffect(() => {
        friends && friends.length && !document.getElementById('friends_list').childElementCount ? setIsChild(false) : setIsChild(true);
    }, [string, friends]);

    const searchFriends = (e) => setString(e.target.value);

    const renderElements = () => {
        switch (friendProcess) {
            case 'loading': return <Loading/>;
            case 'error': return <h2 style={{'color': 'red'}}>Произошла ошибка</h2>;
            case 'success': return friends && friends.length ? 
                friends.map((friend, i) => <FriendsListItem key={friend} string={string} login={friend} index={i}/>) :
                <h1>У вас пока нет друзей</h1>;
            default: return null;
        }
    }

    const elements = renderElements();

    return (
        <>    
            <div className={styles.friendsListWrapper} id="friends">
                {friends && friends.length && friendProcess === 'success' ? 
                <input type="text" placeholder="Найти друга" className={styles.input} onChange={searchFriends}/> : null}
                {string && !isChild ? <h2>Нет пользователей</h2> : null}
                <ul style={{'width': '100%', 'textAlign': 'center'}} id="friends_list">
                    {elements}
                </ul>
            </div>
            <div className={styles.split}></div>
        </>
    );
}

export default FriendsList;