"use client";

const {BASE_URL} = require('.env.js');

import Image from "next/image";
import { TypingContext, BlockedUsersContext, IsBlockedContext } from "./SSEProvider";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import useHttp from "@/hooks/http.hook";

import styles from "../styles/chatPage.module.css";

const UserBar = ({online, login}) => {
    const {getData} = useHttp();
    const searchParams = useSearchParams();
    const typing = useContext(TypingContext);
    const blockedUsers = useContext(BlockedUsersContext);
    const isBlocked = useContext(IsBlockedContext);
    const name = searchParams.get('name');
    const surname = searchParams.get('surname');
    const image = searchParams.get('image');

    const toggleUserBlocking = () => blockedUsers ? getData(`${BASE_URL}/${blockedUsers.includes(login) ? 'unlock' : 'block'}/${login}/${localStorage.getItem('myLogin')}`) : null;

    return (
        <div className={styles.userBar}>
            <div className={styles.userInfoWrapper}>
                <Image src={image ? `${BASE_URL}/${image}` : "https://img.icons8.com/material/400/7B92AD/camera--v1.png"} alt={`profile photo of ${name}`} width={60} height={60} style={{'objectFit': 'cover', 'borderRadius': '50%'}}/>
                <div className={styles.textWrapper}>
                    <span style={{'fontWeight': '600'}}>{name} {surname}</span>
                    {online ? typing ? <span>Печатает...</span> : <span>В сети</span> : null}
                </div>
            </div>
            {!isBlocked && blockedUsers ? <Image onClick={toggleUserBlocking} 
            src={blockedUsers.includes(login) ? 'https://img.icons8.com/ios/45/lock.png' : 'https://img.icons8.com/ios/45/unlock.png'}
            alt={blockedUsers.includes(login) ? 'unlock user' : 'block user'} 
            width={45} height={45} style={{'cursor': 'pointer'}}/> : null}
        </div>
    );
}

export default UserBar;