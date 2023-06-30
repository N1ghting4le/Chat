'use client';

const {BASE_URL} = require('.env.js');

import Link from "next/link";
import Image from "next/image";
import Loading from "./Loading";
import { useState, useEffect, useContext, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import { renderUserInfo } from "./FriendsListItem";
import { FriendRequestsContext } from "./SSEProvider";

import styles from "../styles/friendRequestsPage.module.css";

const FriendRequestsListItem = ({string, login, index, type}) => {
    const [user, setUser] = useState({});
    const [process, setProcess] = useState('idle');
    const {getData} = useHttp();
    const {setFriendRequests} = useContext(FriendRequestsContext);

    useEffect(() => {
        getData(`${BASE_URL}/users/${login}`, setProcess).then(res => setUser(res));
    }, []);

    const handleRequest = (e) => {
        type === 'received' ? getData(`${BASE_URL}/${e.target.textContent === 'Принять' ? 'accept' : 'decline'}FriendRequest/${login}/${localStorage.getItem('myLogin')}`, setProcess).then(() => {
            setFriendRequests(requests => ({...requests, received: requests.received.filter(req => req !== login)}));
        }) : getData(`${BASE_URL}/cancelFriendRequest/${login}/${localStorage.getItem('myLogin')}`, setProcess).then(() => {
            setFriendRequests(requests => ({...requests, sended: requests.sended.filter(req => req !== login)}));
        });
    }

    const {symbols, userString} = useMemo(() => user.name ? renderUserInfo(user, string) : ({symbols: '', userString: ''}), [user, string]);

    return process === 'loading' ? <Loading/> : process === 'error' ? 
    <li style={{'color': 'red'}} className={styles.listItem}>Произошла ошибка</li> :
    userString && userString.toLowerCase().includes(string.toLowerCase()) ? (
        <li className={styles.listItem} style={!index ? {'borderTop': '1px solid black'} : null}>
            <Link href={`/users/${login}`} className={styles.link} prefetch={false}>
                <Image src={user.image ? `${BASE_URL}/${user.image}` : "https://img.icons8.com/material/30/7B92AD/camera--v1.png"} alt={`profile photo of ${user.name}`} width={100} height={100} style={{'objectFit': 'cover'}}/>
                <p>{symbols}</p>
            </Link>
            {type === 'received' ? 
            <div style={{'display': 'flex', 'gap': '20px'}}>
                <button style={{'backgroundColor': 'rgb(1, 99, 1)'}} className={styles.button} onClick={handleRequest}>Принять</button>
                <button style={{'backgroundColor': 'rgb(150, 0, 0)'}} className={styles.button} onClick={handleRequest}>Отклонить</button>
            </div> : 
            <button style={{'backgroundColor': 'blue'}} className={styles.button} onClick={handleRequest}>Отменить запрос</button>}
        </li>
    ) : null;
}

export default FriendRequestsListItem;