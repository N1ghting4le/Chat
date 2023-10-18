'use client';

const {BASE_URL, PHOTO_URL} = require('.env.js');

import Link from "next/link";
import Image from "next/image";
import Loading from "./Loading";
import { useState, useEffect, useContext, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import { renderUserInfo } from "./FriendsListItem";
import { FriendRequestsContext, MyLoginContext } from "./SSEProvider";

import styles from "../styles/friendRequestsPage.module.css";

export const setView = (View, process, string, userString, isFriendListItem, styles, ...props) => {
    const condition = userString && userString.toLowerCase().includes(string.toLowerCase());
    const className = isFriendListItem ? `${styles.listItem} ${styles.friendsListItem}` : styles.listItem;

    switch (process) {
        case 'loading': return <Loading/>;
        case 'error': return <li style={{'color': 'red'}} className={className}>Произошла ошибка</li>;
        default: return condition ? <View props={props}/> : null;
    }
}

const FriendRequestsListItem = ({string, login, index, type}) => {
    const [user, setUser] = useState({});
    const [process, setProcess] = useState('idle');
    const {getData} = useHttp();
    const {setFriendRequests} = useContext(FriendRequestsContext);
    const myLogin = useContext(MyLoginContext);

    useEffect(() => {
        getData(`${BASE_URL}/users/${login}`, setProcess).then(res => setUser(res));
    }, []);

    const handleRequest = (e) => {
        const action = type === 'received' ? e.target.textContent === 'Принять' ? 'accept' : 'decline' : 'cancel';

        getData(`${BASE_URL}/${action}FriendRequest/${login}/${myLogin}`, setProcess).then(() => {
            setFriendRequests(requests => ({...requests, [type]: requests[type].filter(req => req !== login)}));
        });
    }

    const {symbols, userString} = useMemo(() => user.name ? renderUserInfo(user, string) : ({symbols: '', userString: ''}), [user, string]);

    return setView(View, process, string, userString, false, styles, index, login, user, symbols, type, handleRequest);
}

const View = ({props}) => {
    const [i, login, user, symbols, type, handleReq] = props;

    return (
        <li className={styles.listItem} style={!i ? {'borderTop': '1px solid black'} : null}>
            <Link href={`/users/${login}`} className={styles.link} prefetch={false}>
                <Image src={user.image ? `${BASE_URL}/${user.image}` : PHOTO_URL} alt={`profile photo of ${user.name}`} width={100} height={100} style={{'objectFit': 'cover'}}/>
                <p>{symbols}</p>
            </Link>
            {type === 'received' ? 
            <div style={{'display': 'flex', 'gap': '20px'}}>
                <button style={{'backgroundColor': 'rgb(1, 99, 1)'}} className={styles.button} onClick={handleReq}>Принять</button>
                <button style={{'backgroundColor': 'rgb(150, 0, 0)'}} className={styles.button} onClick={handleReq}>Отклонить</button>
            </div> : 
            <button style={{'backgroundColor': 'blue'}} className={styles.button} onClick={handleReq}>Отменить запрос</button>}
        </li>
    );
}

export default FriendRequestsListItem;