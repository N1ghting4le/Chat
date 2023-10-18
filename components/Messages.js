"use client";

const {BASE_URL, TICK} = require('.env.js');

import Image from "next/image";
import { useState, useEffect, useRef, useContext, useMemo } from "react";
import useHttp from "@/hooks/http.hook";
import { MessagesContext, ChangingMessageContext, IsBlockedContext, BlockedUsersContext, MyLoginContext } from "./SSEProvider";

import styles from "../styles/chatPage.module.css";

const Messages = ({chatId, login}) => {
    const [arrow, setArrow] = useState(false);
    const [scroll, setScroll] = useState(true);
    const ref = useRef({});
    const messages = useContext(MessagesContext);
    const {setChangingMessage} = useContext(ChangingMessageContext);
    const isBlocked = useContext(IsBlockedContext);
    const blockedUsers = useContext(BlockedUsersContext);
    const myLogin = useContext(MyLoginContext);
    const {getData} = useHttp();

    useEffect(() => {
        scroll ? ref.current.scrollTop = ref.current.scrollHeight : null;
        readMessage();
    }, [messages]);

    const counter = useMemo(() => arrow ? messages.filter(message => message.login !== myLogin && !message.read).length : 0, [myLogin, messages, arrow]);

    const readMessage = () => {
        document.querySelectorAll('[data-read="false"]').forEach(message => {
            if (ref.current.clientHeight + ref.current.offsetTop >= message.getBoundingClientRect().bottom && message.getAttribute('data-login') !== myLogin) {
                getData(`${BASE_URL}/read/${chatId}/${message.id}`);
                message.setAttribute('data-read', true);
            }
        });
    }

    const handleScroll = (e) => {
        if (Math.floor(e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop) < 5) {
            setScroll(true);
            setArrow(false);
        } else {
            setScroll(false);
            setArrow(true);
        }
        readMessage();
    }

    const showContextMenu = (e) => {
        e.preventDefault();
        document.querySelectorAll('[data-context]').forEach(el => el.style.display = 'none');
        e.target.parentElement.previousElementSibling ? e.target.parentElement.previousElementSibling.style.display = 'flex' : null;
        scroll ? ref.current.scrollTop = ref.current.scrollHeight : null;
    }
    const hideContextMenu = (e) => e.target.id && e.target.getAttribute('data-login') === myLogin ? e.target.querySelector('[data-context]').style.display = 'none' : null;

    const onMessageChange = (e) => {
        !isBlocked && !blockedUsers.includes(login) ? setChangingMessage({id: e.target.parentElement.parentElement.id, text: e.target.parentElement.nextElementSibling.firstElementChild.textContent}) : null;
        e.target.parentElement.style.display = 'none';
    }
    const onMessageDelete = (e) => {
        getData(`${BASE_URL}/deleteMessage/${chatId}/${e.target.parentElement.parentElement.id}`);
        e.target.parentElement.style.display = 'none';
    }

    const renderMessages = () => {
        return messages.length > 0 ? messages.map(message => {
            const {id, login, text, read} = message;

            return text ? (
                <div key={id} id={id} className={styles.messageWrapper} data-login={login} data-read={read} style={login === myLogin ? {'alignItems': 'end'} : null} onClick={hideContextMenu}>
                    {login === myLogin ? 
                    <div className={styles.contextMenu} data-context>
                        <span style={{'borderBottom': '1px solid black'}} className={styles.contextMenuSpan} onClick={onMessageChange}>Изменить</span>
                        <span className={styles.contextMenuSpan} onClick={onMessageDelete}>Удалить</span>
                    </div> : null}
                    <div className={styles.messageTextWrapper}>
                        <p style={login === myLogin ? {'backgroundColor': '#86c9fd'} : {'backgroundColor': '#dcdada'}} className={styles.message} onContextMenu={showContextMenu}>{text}</p>
                        {login === myLogin && read ? <Image src={TICK} alt="tick" width={20} height={20}/> : null}
                    </div>
                </div>
            ) : null;
        }) : null;
    }

    const elements = renderMessages();

    return (
        <>
            <section ref={el => ref.current = el} className={styles.messages} onScroll={handleScroll}>
                {elements}
            </section>
            {arrow ? <button className={styles.arrow} onClick={() => ref.current.scrollTop = ref.current.scrollHeight}/> : null}
            {counter > 0 ? <span className={styles.counter}>{counter}</span> : null}
        </>
    );
}

export default Messages;