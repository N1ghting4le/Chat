"use client";

const {BASE_URL} = require('.env.js');

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext, useMemo } from "react";
import { CounterContext } from "./SSEProvider";

import styles from '../styles/chatsListPage.module.css';

const ChatsListItem = ({chat}) => {
    const {chatId, name, surname, image, lastMessage} = chat;
    const {login, text} = lastMessage;
    const [author, setAuthor] = useState('');
    const counters = useContext(CounterContext);

    useEffect(() => {
        login ? login === localStorage.getItem('myLogin') ? setAuthor('Вы') : setAuthor(`${name}${surname ? ' ' + surname : ''}`) : null;
    }, [login]);

    const content = useMemo(() => text ? text.length > 13 ? `${text.slice(0, 13)}...` : text : 'В этом чате пока нет сообщений', [text]);

    const counter = useMemo(() => {
        if (counters.length) {
            const [{number}] = counters.filter(counter => counter.id === chatId);
            return number;
        }
    }, [counters]);

    return (
        <li>
            <Link href={`/chats/${chatId}?name=${name}&surname=${surname}&image=${image}`} className={styles.listItem}>
                <div className={styles.userInfoWrapper}>
                    <Image src={image ? `${BASE_URL}/${image}` : "https://img.icons8.com/material/400/7B92AD/camera--v1.png"} alt={`profile photo of ${name}`} width={60} height={60} style={{'objectFit': 'cover', 'borderRadius': '50%'}}/>
                    <span>{surname ? `${name} ${surname}` : `${name}`}</span>
                </div>
                <span>{author ? `${author}: ${content}` : content}</span>
                {counter ? <span className={styles.counter}>{counter}</span> : null}
            </Link>
        </li>
    );
}

export default ChatsListItem;