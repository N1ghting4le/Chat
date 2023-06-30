"use client";

const BASE_URL = process.env.BASE_URL;

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useContext, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import SearchedUsersList from "./SearchedUsersList";
import { CounterContext, FriendRequestsContext, FriendNotificationsContext } from "./SSEProvider";

import styles from "../styles/header.module.css";

const Header = () => {
    const {getData} = useHttp();
    const ref = useRef({});
    const [display, setDisplay] = useState('none');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [string, setString] = useState('');
    const [myLogin, setMyLogin] = useState('');
    const counters = useContext(CounterContext); 
    const {friendRequests} = useContext(FriendRequestsContext);
    const {friendNotifications} = useContext(FriendNotificationsContext);

    useEffect(() => {
        setMyLogin(localStorage.getItem('myLogin'));
    }, []);

    const total = useMemo(() => counters ? counters.reduce((sum, current) => sum + current.number, 0) : 0, [counters]);
    const friendRequestsTotal = useMemo(() => friendRequests && friendRequests.received && friendRequests.sended ? friendRequests.received.length + friendRequests.sended.length : 0, [friendRequests]);
    const friendNotsTotal = useMemo(() => friendNotifications && friendNotifications.length, [friendNotifications]);

    const usersSearch = (e) => {
        setDisplay('block');
        setString(e.target.value);
        if (e.target.value !== '') getData(`${BASE_URL}/search/${e.target.value.toLowerCase()}`).then(res => res && res.length > 0 ? setSearchedUsers({users: res}) : !res ? setSearchedUsers('Ошибка поиска') : setSearchedUsers('Нет пользователей'));
        if (e.target.value === '') setDisplay('none');
    }

    return (
        <header className={styles.header} ref={el => ref.current = el}>
            <nav className={styles.navigation}>
                <Link href={myLogin ? `/users/${myLogin}` : ''} className={styles.link}>Мой профиль</Link>
                <Link href="/friends" className={styles.link}>Друзья {friendNotsTotal ? <span className={styles.chatCounter}>{friendNotsTotal}</span> : null}</Link>
                <Link href="/friend-requests" className={styles.link}>Запросы на дружбу {friendRequestsTotal ? <span className={styles.chatCounter}>{friendRequestsTotal}</span> : null}</Link>
                <Link href="/chats" className={styles.link}>Чаты {total ? <span className={styles.chatCounter}>{total}</span> : null}</Link>
            </nav>
            <label className={styles.label}>
                <input type="text" placeholder="Поиск" className={styles.input} onChange={usersSearch}/>
                <Image src="https://img.icons8.com/color/20/search--v1.png" alt="search icon" width={20} height={20} className={styles.search}/>
            </label>
            <Link href="/" className={`${styles.link} ${styles.exitLink}`}>
                <Image src="https://img.icons8.com/ios-filled/50/FA5252/door-opened.png" alt="exit" width={20} height={20} style={{'transform': 'translateY(3px)'}}/>
                Выйти
            </Link>
            <SearchedUsersList searchedUsers={searchedUsers} top={`${ref.current.clientHeight}px`} display={display} string={string}/>
        </header>
    );
}

export default Header;