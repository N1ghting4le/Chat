'use client';

import Loading from "./Loading";
import FriendRequestsListItem from "./FriendRequestsListItem";
import { useContext, useEffect, useState } from "react";
import { FriendRequestsContext } from "./SSEProvider";

import styles from "../styles/friendRequestsPage.module.css";

const FriendRequestsList = ({type}) => {
    const [isChild, setIsChild] = useState(true);
    const [string, setString] = useState('');
    const {friendRequests, friendRequestsProcess} = useContext(FriendRequestsContext);

    useEffect(() => {
        friendRequests && friendRequests[`${type}`] && friendRequests[`${type}`].length && !document.getElementById(`requests_list_${type}`).childElementCount ? setIsChild(false) : setIsChild(true);
    }, [string, friendRequests]);

    const searchRequests = (e) => setString(e.target.value);
    const renderElements = () => friendRequestsProcess === 'loading' ? <Loading/> : friendRequestsProcess === 'error' ? <h2 style={{'color': 'red'}}>Произошла ошибка</h2> :
    friendRequestsProcess === 'success' && friendRequests[`${type}`] ? friendRequests[`${type}`].length ? friendRequests[`${type}`].map((req, i) => <FriendRequestsListItem key={req} string={string} login={req} index={i} type={type}/>) : 
    <h1 className={styles.title}>У вас пока нет {type === 'sended' ? 'исходящих' : 'входящих'} запросов</h1> : null;
    const elements = renderElements();

    return type === 'sended' ? (
        <>
            <div className={styles.listWrapper} id={type}>
                {friendRequests && friendRequests[`${type}`] && friendRequests[`${type}`].length && friendRequestsProcess === 'success' ?
                <input type="text" placeholder="Найти запрос" className={styles.input} onChange={searchRequests}/> : null}
                {string && !isChild ? <h2>Нет запросов</h2> : null}
                <ul className={styles.list} id={`requests_list_${type}`}>
                    {elements}
                </ul>
            </div>
            <div className={styles.split}></div>
        </>
    ) : (
        <div className={styles.listWrapper} id={type}>
            {friendRequests && friendRequests.received && friendRequests.received.length && friendRequestsProcess === 'success' ?
            <input type="text" placeholder="Найти запрос" className={styles.input} onChange={searchRequests}/> : null}
            {string && !isChild ? <h2>Нет запросов</h2> : null}
            <ul className={styles.list} id={`requests_list_${type}`}>
                {elements}
            </ul>
        </div>
    );
}

export default FriendRequestsList;