'use client';

const {BASE_URL, PHOTO_URL} = require('.env.js');

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import { createSymbolElements } from "./SearchedUser";
import { setView } from "./FriendRequestsListItem";

import styles from "../styles/friendsPage.module.css";

export const renderUserInfo = (user, string) => {
    const {name, surname, age, location} = user;

    return createSymbolElements(name, surname, age, location, string);
}

const FriendsListItem = ({login, string, index}) => {
    const [user, setUser] = useState({});
    const [process, setProcess] = useState('idle');
    const {getData} = useHttp();

    useEffect(() => {
        getData(`${BASE_URL}/users/${login}`, setProcess).then(res => setUser(res));
    }, []);

    const deleteFriend = () => getData(`${BASE_URL}/deleteFriend/${login}/${localStorage.getItem('myLogin')}`);

    const {symbols, userString} = useMemo(() => user.name ? renderUserInfo(user, string) : ({symbols: '', userString: ''}), [user, string]);

    return setView(View, process, string, userString, true, styles, index, login, user, symbols, deleteFriend);
}

const View = ({props}) => {
    const [index, login, user, symbols, deleteFriend] = props;

    return (
        <li className={`${styles.listItem} ${styles.friendsListItem}`} style={!index ? {'borderTop': '1px solid black'} : null}>
            <Link href={`/users/${login}`} className={styles.link} prefetch={false}>
                <Image src={user.image ? `${BASE_URL}/${user.image}` : PHOTO_URL} alt={`profile photo of ${user.name}`} width={100} height={100} style={{'objectFit': 'cover'}}/>
                <p>{symbols}</p>
            </Link>
            <button className={styles.button} onClick={deleteFriend}>Удалить из друзей</button>
        </li>
    );
}

export default FriendsListItem;