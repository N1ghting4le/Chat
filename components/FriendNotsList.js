'use client';

const {BASE_URL} = require('.env.js');

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

    const renderElements = () => {
        switch (friendNotsProcess) {
            case 'loading': return <Loading/>;
            case 'error': return  <h2 style={{'color': 'red'}}>Произошла ошибка</h2>;
            case 'success': return friendNotifications.length ? friendNotifications.map((not, i) => {
                const {id, answer, name, surname} = not;
                let message = 'удалил вас из своего списка друзей';

                switch (answer) {
                    case 'accept': message = 'принял запрос'; break;
                    case 'decline': message = 'отклонил запрос'; break;
                }
    
                return <li key={id} id={id} data-read="false" style={!i ? {'borderTop': '1px solid black'} : null} className={styles.listItem}>Пользователь {name}{surname ? ' ' + surname : ''} {message}</li>;
            }) : <h1>Нет уведомлений</h1>;
            default: return null;
        }
    }

    const elements = renderElements();

    return (
        <ul className={styles.list} id="notifications">
            {elements}
        </ul>
    );
}

export default FriendNotsList;