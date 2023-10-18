"use client";

const {BASE_URL, DOOR_ICON, SEARCH_ICON} = require('.env.js');

import Link from "next/link";
import Image from "next/image";
import HeaderMenuMobile from "./HeaderMenuMobile";
import { useRef, useState, useContext, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import SearchedUsersList from "./SearchedUsersList";
import { CounterContext, FriendRequestsContext, FriendNotificationsContext, MyLoginContext } from "./SSEProvider";

import styles from "../styles/header.module.css";

const Header = () => {
    const {getData} = useHttp();
    const ref = useRef({});
    const [display, setDisplay] = useState('none');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [string, setString] = useState('');
    const counters = useContext(CounterContext);
    const myLogin = useContext(MyLoginContext); 
    const {friendRequests} = useContext(FriendRequestsContext);
    const {friendNotifications} = useContext(FriendNotificationsContext);
    const total = useMemo(() => counters ? counters.reduce((sum, current) => sum + current.number, 0) : 0, [counters]);
    const friendRequestsTotal = useMemo(() => friendRequests && friendRequests.received && friendRequests.sended ? friendRequests.received.length + friendRequests.sended.length : 0, [friendRequests]);
    const friendNotsTotal = useMemo(() => friendNotifications && friendNotifications.length, [friendNotifications]);

    const usersSearch = (e) => {
        setDisplay('block');
        setString(e.target.value);
        if (e.target.value !== '') {
            getData(`${BASE_URL}/search/${e.target.value.toLowerCase()}`).then(res => res ? res.length > 0 ? setSearchedUsers({users: res}) : setSearchedUsers('Нет пользователей') : setSearchedUsers('Ошибка поиска'));
        } else setDisplay('none');
    }

    return (
        <header className={styles.header} ref={el => ref.current = el}>
            <HeaderMenuMobile myLogin={myLogin} friendNotsTotal={friendNotsTotal} friendRequestsTotal={friendRequestsTotal} total={total}/>
            <nav className={styles.navigation}>
                <Link href={myLogin ? `/users/${myLogin}` : ''} className={styles.link}>Мой профиль</Link>
                <Link href="/friends" className={styles.link}>Друзья {friendNotsTotal ? <span className={styles.chatCounter}>{friendNotsTotal}</span> : null}</Link>
                <Link href="/friend-requests" className={styles.link}>Запросы на дружбу {friendRequestsTotal ? <span className={styles.chatCounter}>{friendRequestsTotal}</span> : null}</Link>
                <Link href="/chats" className={styles.link}>Чаты {total ? <span className={styles.chatCounter}>{total}</span> : null}</Link>
            </nav>
            <label className={styles.label}>
                <input type="text" placeholder="Поиск" className={styles.input} onChange={usersSearch}/>
                <Image src={SEARCH_ICON} alt="search icon" width={20} height={20} className={styles.search}/>
            </label>
            <Link href="/" className={`${styles.link} ${styles.exitLink}`}>
                <Image src={DOOR_ICON} alt="exit" width={20} height={20} style={{'transform': 'translateY(3px)'}}/>
                Выйти
            </Link>
            <SearchedUsersList searchedUsers={searchedUsers} top={`${ref.current.clientHeight}px`} display={display} string={string}/>
        </header>
    );
}

export default Header;