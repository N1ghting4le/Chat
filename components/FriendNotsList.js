'use client';

const BASE_URL = process.env.BASE_URL;

import Loading from "./Loading";
import { useContext, useEffect } from "react";
import { FriendNotificationsContext } from "./SSEProvider";
import useHttp from "@/hooks/http.hook";

import styles from "../styles/friendsPage.module.css";

const FriendNotsList = () => {
    const {friendNotifications, friendNotsProcess} = useContext(FriendNotificationsContext);
    const {getData} = useHttp();

    const readNotification = () => {
        document.querySelectorAll('[data-read="false"]').forEach(item => {
            if (document.documentElement.clientHeight >= item.getBoundingClientRect().bottom) {
                getData(`${BASE_URL}/readFriendNotification/${localStorage.getItem('myLogin')}/${item.id}`);
                item.setAttribute('data-read', true);
            }
        });
    }

    useEffect(() => {
        document.addEventListener('scroll', readNotification);
        return () => document.removeEventListener('scroll', readNotification);
    }, []);

    useEffect(() => {
        readNotification();
    }, [friendNotsProcess, friendNotifications]);

    const renderElements = () => friendNotsProcess === 'loading' ? <Loading/> : friendNotsProcess === 'error' ? <h2 style={{'color': 'red'}}>Произошла ошибка</h2> :
    friendNotsProcess === 'success' ? friendNotifications.length ? friendNotifications.map((not, i) => {
        const {id, answer, name, surname} = not;

        return <li key={id} id={id} data-read="false" style={!i ? {'borderTop': '1px solid black'} : null} className={styles.listItem}>Пользователь {name}{surname ? ' ' + surname : ''} {answer === 'accept' ? 'принял запрос' : answer === 'decline' ? 'отклонил запрос' : 'удалил вас из своего списка друзей'}</li>;
    }) : <h1>Нет уведомлений</h1> : null;
    const elements = renderElements();

    return (
        <ul className={styles.list} id="notifications">
            {elements}
        </ul>
    );
}

export default FriendNotsList;