'use client';

const {BASE_URL} = require('.env.js');

import Link from "next/link";
import Image from "next/image";
import Loading from "./Loading";
import { useState, useEffect, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import { createSymbolElements } from "./SearchedUser";

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

    return process === 'loading' ? <Loading/> : process === 'error' ? 
    <li style={{'color': 'red'}} className={`${styles.listItem} ${styles.friendsListItem}`}>Произошла ошибка</li> :
    userString && userString.toLowerCase().includes(string.toLowerCase()) ? (
        <li className={`${styles.listItem} ${styles.friendsListItem}`} style={!index ? {'borderTop': '1px solid black'} : null}>
            <Link href={`/users/${login}`} className={styles.link} prefetch={false}>
                <Image src={user.image ? `${BASE_URL}/${user.image}` : "https://img.icons8.com/material/30/7B92AD/camera--v1.png"} alt={`profile photo of ${user.name}`} width={100} height={100} style={{'objectFit': 'cover'}}/>
                <p>{symbols}</p>
            </Link>
            <button className={styles.button} onClick={deleteFriend}>Удалить из друзей</button>
        </li>
    ) : null;
}

export default FriendsListItem;