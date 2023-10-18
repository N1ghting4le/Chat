"use client";

const {BASE_URL} = require('.env.js');

import useHttp from "@/hooks/http.hook";
import { useSearchParams } from "next/navigation";
import { useRef, useState, useEffect, useContext } from "react";
import { v4 } from "uuid";
import { ChangingMessageContext, IsBlockedContext, BlockedUsersContext, MyLoginContext } from "./SSEProvider";

import styles from "../styles/chatPage.module.css";

const SendMessage = ({chatId, login}) => {
    const searchParams = useSearchParams();
    const name = searchParams.get('name');
    const surname = searchParams.get('surname');
    const {postData, getData} = useHttp();
    const ref = useRef({});
    const [initial, setInitial] = useState(true);
    const [typing, setTyping] = useState(false);
    const [lastMessage, setLastMessage] = useState('');
    const [process, setProcess] = useState('idle');
    const {changingMessage, setChangingMessage} = useContext(ChangingMessageContext);
    const isBlocked = useContext(IsBlockedContext);
    const blockedUsers = useContext(BlockedUsersContext);
    const myLogin = useContext(MyLoginContext);

    useEffect(() => {
        process === 'error' ? ref.current.value = lastMessage : ref.current.value = '';
    }, [process]);

    useEffect(() => {
        !initial ? typing ? getData(`${BASE_URL}/setTyping/${myLogin}/${chatId}`) 
        : getData(`${BASE_URL}/resetTyping/${myLogin}`) : setInitial(false);
    }, [typing]);

    useEffect(() => {
        if (changingMessage.text) {
            ref.current.value = changingMessage.text;
            ref.current.focus();
        }
    }, [changingMessage]);

    const sendMessage = () => {
        if (!ref.current.value) return;

        const messageObj = {
            id: v4(),
            login: myLogin,
            text: ref.current.value
        }

        if (changingMessage.text) {
            messageObj.id = changingMessage.id;
            setChangingMessage({});            
        }

        setLastMessage(ref.current.value);
        setTyping(false);

        postData(`${BASE_URL}/chats/${chatId}/messages`, JSON.stringify(messageObj), setProcess);
    }

    const setTypingState = (e) => (!typing && e.target.value.length) || (typing && !e.target.value.length) ? setTyping(!typing) : null;
    const onBlur = () => typing ? setTyping(false) : null;
    const onFocus = (e) => e.target.value.length ? setTyping(true) : null;

    return (
        <div className={styles.inputWrapper}>
            {!blockedUsers || !isBlocked && !blockedUsers.includes(login) ? 
            <div className={styles.inputBar}>
                <input type="text" placeholder="Написать сообщение" ref={el => ref.current = el} className={styles.input} onKeyDown={(e) => e.code === 'Enter' ? sendMessage() : null} onChange={setTypingState} onBlur={onBlur} onFocus={onFocus}/>
                <button className={styles.button} onClick={sendMessage}/>
            </div> : 
            isBlocked ? <div className={styles.block}>Вы заблокированы пользователем {name} {surname}</div> : <div className={styles.block}>Вы заблокировали пользователя {name} {surname}</div>}
            {process === 'error' ? <div style={{'color': 'red'}}>Произошла ошибка</div> : null}
        </div>
    );
}

export default SendMessage;