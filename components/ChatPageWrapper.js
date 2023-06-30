"use client";

const BASE_URL = process.env.BASE_URL;

import UserBar from "./UserBar";
import Messages from "./Messages";
import SendMessage from "./SendMessage";
import { OnlineContext } from "./SSEProvider";
import { useEffect, useContext, useState } from "react";
import useHttp from "@/hooks/http.hook";

const ChatPageWrapper = ({chatId, users, oldMessages}) => {
    const {getData} = useHttp();
    const [companionLogin, setCompanionLogin] = useState('');
    const {online, setOnline} = useContext(OnlineContext);

    useEffect(() => {
        if (users.length === 2) {
            const [login] = users.filter(user => user !== localStorage.getItem('myLogin'));
            setCompanionLogin(login);
            getData(`${BASE_URL}/isOnline/${login}`).then(res => setOnline(res.online));
        }
    }, []);

    return (
        <main>
            <UserBar online={online} login={companionLogin}/>
            <Messages oldMessages={oldMessages} chatId={chatId} login={companionLogin}/>
            <SendMessage chatId={chatId} login={companionLogin}/>
        </main>
    );
}

export default ChatPageWrapper;