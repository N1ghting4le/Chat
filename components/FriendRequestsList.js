'use client';

import Loading from "./Loading";
import FriendRequestsListItem from "./FriendRequestsListItem";
import { useContext, useEffect, useState, useMemo } from "react";
import { FriendRequestsContext } from "./SSEProvider";

import styles from "../styles/friendRequestsPage.module.css";

const FriendRequestsList = ({type}) => {
    const [isChild, setIsChild] = useState(true);
    const [string, setString] = useState('');
    const {friendRequests, friendRequestsProcess} = useContext(FriendRequestsContext);
    const condition = useMemo(() => friendRequests && friendRequests[type] && friendRequests[type].length, [friendRequests]);

    useEffect(() => {
        condition && !document.getElementById(`requests_list_${type}`).childElementCount ? setIsChild(false) : setIsChild(true);
    }, [string, condition]);

    const searchRequests = (e) => setString(e.target.value);

    const renderElements = () => {
        switch (friendRequestsProcess) {
            case 'loading': return <Loading/>;
            case 'error': return <h2 style={{'color': 'red'}}>Произошла ошибка</h2>;
            case 'success': return condition ? 
                friendRequests[type].map((req, i) => <FriendRequestsListItem key={req} string={string} login={req} index={i} type={type}/>) : 
                <h1 className={styles.title}>У вас пока нет {type === 'sended' ? 'исходящих' : 'входящих'} запросов</h1>;
            default: return null;
        }
    }

    const elements = renderElements();

    return (
        <>
            <div className={styles.listWrapper} id={type}>
                {condition && friendRequestsProcess === 'success' ?
                <input type="text" placeholder="Найти запрос" className={styles.input} onChange={searchRequests}/> : null}
                {string && !isChild ? <h2>Нет запросов</h2> : null}
                <ul className={styles.list} id={`requests_list_${type}`}>
                    {elements}
                </ul>
            </div>
            {type === 'sended' ? <div className={styles.split}></div> : null}
        </>
    );
}

export default FriendRequestsList;