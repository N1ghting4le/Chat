"use client";

const {BASE_URL, PHOTO_URL} = require('.env.js');

import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { CounterContext, MyLoginContext } from "./SSEProvider";

import styles from '../styles/chatsListPage.module.css';

const ChatsListItem = ({chat}) => {
    const {chatId, name, surname, image, lastMessage} = chat;
    const {login, text} = lastMessage;
    const counters = useContext(CounterContext);
    const myLogin = useContext(MyLoginContext);
    const author = useMemo(() => login ? login === myLogin ? 'Вы' : `${name}${surname ? ' ' + surname : ''}` : '', [login]);
    const content = useMemo(() => text ? text.length > 13 ? `${text.slice(0, 13)}...` : text : 'В этом чате пока нет сообщений', [text]);
    const counter = useMemo(() => counters.length ? counters.filter(counter => counter.id === chatId)[0].number : null, [counters]);

    return (
        <li>
            <Link href={`/chats/${chatId}?name=${name}&surname=${surname}&image=${image}`} className={styles.listItem}>
                <div className={styles.userInfoWrapper}>
                    <Image src={image ? `${BASE_URL}/${image}` : PHOTO_URL} alt={`profile photo of ${name}`} width={60} height={60} style={{'objectFit': 'cover', 'borderRadius': '50%'}}/>
                    <span>{surname ? `${name} ${surname}` : `${name}`}</span>
                </div>
                <span>{author ? `${author}: ${content}` : content}</span>
                {counter ? <span className={styles.counter}>{counter}</span> : null}
            </Link>
        </li>
    );
}

export default ChatsListItem;