"use client";

const {BASE_URL, PHOTO_URL, LOCK, UNLOCK} = require('.env.js');

import Image from "next/image";
import { TypingContext, BlockedUsersContext, IsBlockedContext, MyLoginContext } from "./SSEProvider";
import { useSearchParams } from "next/navigation";
import { useContext, useMemo } from "react";
import useHttp from "@/hooks/http.hook";

import styles from "../styles/chatPage.module.css";

const UserBar = ({online, login}) => {
    const {getData} = useHttp();
    const searchParams = useSearchParams();
    const typing = useContext(TypingContext);
    const blockedUsers = useContext(BlockedUsersContext);
    const isBlocked = useContext(IsBlockedContext);
    const myLogin = useContext(MyLoginContext);
    const name = searchParams.get('name');
    const surname = searchParams.get('surname');
    const image = searchParams.get('image');
    const condition = useMemo(() => blockedUsers && blockedUsers.includes(login), [blockedUsers]);

    const toggleUserBlocking = () => blockedUsers ? getData(`${BASE_URL}/${condition ? 'unlock' : 'block'}/${login}/${myLogin}`) : null;

    return (
        <div className={styles.userBar}>
            <div className={styles.userInfoWrapper}>
                <Image src={image ? `${BASE_URL}/${image}` : PHOTO_URL} alt={`profile photo of ${name}`} width={60} height={60} style={{'objectFit': 'cover', 'borderRadius': '50%'}}/>
                <div className={styles.textWrapper}>
                    <span style={{'fontWeight': '600'}}>{name} {surname}</span>
                    {online ? typing ? <span>Печатает...</span> : <span>В сети</span> : null}
                </div>
            </div>
            {!isBlocked ? <Image onClick={toggleUserBlocking} 
                                src={condition ? LOCK : UNLOCK}
                                alt={condition ? 'unlock user' : 'block user'} 
                                width={45} height={45} style={{'cursor': 'pointer'}}/> : null}
        </div>
    );
}

export default UserBar;