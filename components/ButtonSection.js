"use client";

const {BASE_URL} = require('.env.js');

import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import useHttp from "@/hooks/http.hook";
import Loading from "./Loading";
import { v4 } from "uuid";
import { FriendRequestsContext, FriendContext } from "./SSEProvider";

import styles from "../styles/userPage.module.css";

const ButtonSection = ({login, name, surname, image}) => {
    const [myLogin, setMyLogin] = useState('');
    const [chatProcess, setChatProcess] = useState('idle');
    const [friendProcess, setFriendProcess] = useState('idle');
    const [friendState, setFriendState] = useState('none');
    const [isChat, setIsChat] = useState(false);
    const {friendRequests, setFriendRequests} = useContext(FriendRequestsContext);
    const {friends} = useContext(FriendContext);
    const {postData, getData} = useHttp();
    const router = useRouter();

    useEffect(() => {
        setMyLogin(localStorage.getItem('myLogin'));
        getData(`${BASE_URL}/isChat/${localStorage.getItem('myLogin')},${login}`, setChatProcess).then(res => setIsChat(res.isChat));
    }, []);

    useEffect(() => {
        if (friendRequests && friendRequests.sended && friendRequests.received) {
            if (friendRequests.sended.includes(login)) {
                if (friendState !== 'sended') setFriendState('sended');
            } else if (friendRequests.received.includes(login)) {
                if (friendState !== 'received') setFriendState('received');
            } else if (friends.includes(login)) {
                if (friendState !== 'accepted') setFriendState('accepted');
            } else if (friendState !== 'none') setFriendState('none');
        }
    }, [friendRequests, friends]);

    const enterChat = () => {
        const chatObj = {
            id: v4(),
            users: [myLogin, login],
            messages: []
        };

        postData(`${BASE_URL}/chats`, JSON.stringify(chatObj), setChatProcess).then(res => {
            router.push(`/chats/${res.id}?name=${name}&surname=${surname}&image=${image}`);
        });
    }

    const handleFriendAction = (e) => {
        switch (friendState) {
            case 'none':
                getData(`${BASE_URL}/friendRequest/${login}/${myLogin}`, setFriendProcess).then(() => {
                    setFriendRequests(requests => ({...requests, sended: [...requests.sended, login]}));
                });
                break;
            case 'sended':
                getData(`${BASE_URL}/cancelFriendRequest/${login}/${myLogin}`, setFriendProcess).then(() => {
                    setFriendRequests(requests => ({...requests, sended: requests.sended.filter(req => req !== login)}));
                });
                break;
            case 'received':
                getData(`${BASE_URL}/${e.target.textContent === 'Принять' ? 'accept' : 'decline'}FriendRequest/${login}/${myLogin}`, setFriendProcess).then(() => {
                    setFriendRequests(requests => ({...requests, received: requests.received.filter(req => req !== login)}));
                });
                break;
            default:
                getData(`${BASE_URL}/deleteFriend/${login}/${myLogin}`, setFriendProcess);
                break;
        }
    }

    return myLogin !== login ?
    (
        <section className={styles.buttonSection}>
            <div className={styles.buttonWrapper}>
                {friendProcess !== 'loading' ? 
                    friendState === 'none' ? <button className={styles.button} onClick={handleFriendAction}>Добавить в друзья</button> : 
                        friendState === 'accepted' ? <button className={styles.button} onClick={handleFriendAction}>Удалить из друзей</button> :
                            friendState === 'sended' ? <button className={styles.button} onClick={handleFriendAction}>Запрос на дружбу отправлен | Отменить</button> :
                             <div className={styles.optionWrapper}>
                                <span className={styles.message}>Этот пользователь отправил вам запрос на дружбу</span>
                                <button style={{'backgroundColor': 'rgb(1, 99, 1)'}} className={styles.button} onClick={handleFriendAction}>Принять</button>
                                <button style={{'backgroundColor': 'rgb(150, 0, 0)'}} className={styles.button} onClick={handleFriendAction}>Отклонить</button>
                             </div>
                : <Loading/>}
                {friendProcess === 'error' ? <span style={{'color': 'red'}}>Произошла ошибка</span> : null}
            </div>
            <div className={styles.buttonWrapper}>
                {!isChat ? chatProcess !== 'loading' ? <button className={styles.button} onClick={enterChat}>Начать общение</button> : <Loading/> : null}
                {chatProcess === 'error' ? <span style={{'color': 'red'}}>Произошла ошибка</span> : null}
            </div>
        </section>
    ) :
    (
        <section className={styles.buttonSection}>
            <button className={styles.button}>
                <Link href={`/sign-up?login=${myLogin}`} className={styles.buttonLink}>Обновить профиль</Link>
            </button>
        </section>
    );
}

export default ButtonSection;