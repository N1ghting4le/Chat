"use client";

const BASE_URL = process.env.BASE_URL;

import { createContext, useState, useEffect } from "react";
import useHttp from "@/hooks/http.hook";

export const OnlineContext = createContext('');
export const MessagesContext = createContext([]);
export const CounterContext = createContext([]);
export const TypingContext = createContext(false);
export const ChangingMessageContext = createContext({});
export const BlockedUsersContext = createContext([]);
export const IsBlockedContext = createContext(false);
export const ChatsContext = createContext([]);
export const FriendRequestsContext = createContext({});
export const FriendContext = createContext([]);
export const FriendNotificationsContext = createContext([]);

const SSEProvider = ({chatId, users, children}) => {
    const [online, setOnline] = useState('');
    const [messages, setMessages] = useState([]);
    const [counters, setCounters] = useState([]);
    const [typing, setTyping] = useState(false);
    const [changingMessage, setChangingMessage] = useState({});
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isCurrentChat, setIsCurrentChat] = useState(false);
    const [chats, setChats] = useState([]);
    const [friendRequests, setFriendRequests] = useState({});
    const [friends, setFriends] = useState([]);
    const [friendNotifications, setFriendNotifications] = useState([]);
    const [chatProcess, setChatProcess] = useState('idle');
    const [friendProcess, setFriendProcess] = useState('idle');
    const [friendNotsProcess, setFriendNotsProcess] = useState('idle');
    const [friendRequestsProcess, setFriendRequestsProcess] = useState('idle');
    const {SSEConnection, getData} = useHttp();

    useEffect(() => {
        const myLogin = localStorage.getItem('myLogin');
        getData(`${BASE_URL}/makeOnline/${myLogin}`);
        getData(`${BASE_URL}/friendRequests/${myLogin}`, setFriendRequestsProcess).then(res => setFriendRequests(res));
        getData(`${BASE_URL}/friends/${myLogin}`, setFriendProcess).then(res => setFriends(res));
        getData(`${BASE_URL}/friendNotifications/${myLogin}`, setFriendNotsProcess).then(res => setFriendNotifications(res));
        const eventSource = SSEConnection(`${BASE_URL}/events/${myLogin}`, users, setMessages, setOnline, setCounters, setTyping, setIsBlocked, setBlockedUsers, setChats, setFriendRequests, setFriends, setFriendNotifications);
        const listener = () => {
            getData(`${BASE_URL}/users/${myLogin}/exit`);
            getData(`${BASE_URL}/resetCurrentChat/${myLogin}`);
        }
        window.addEventListener('beforeunload', listener);
        return () => {
            eventSource.close(); 
            window.removeEventListener('beforeunload', listener);
        }
    }, []);

    useEffect(() => {
        const myLogin = localStorage.getItem('myLogin');
        if (chatId) {
            getData(`${BASE_URL}/blockedUsers/${myLogin}`).then(res => setBlockedUsers(res));
            getData(`${BASE_URL}/resetCounter/${chatId}/${myLogin}`).then(res => setCounters(res));
            getData(`${BASE_URL}/setCurrentChat/${myLogin}/${chatId}`).then(() => setIsCurrentChat(true));
            getData(`${BASE_URL}/chats/${chatId}`).then(res => setMessages(res.messages));
            if (users.length === 2) {
                const [user] = users.filter(user => user !== myLogin);
                getData(`${BASE_URL}/isTyping/${user}`).then(res => setTyping(res.typing));
                getData(`${BASE_URL}/isBlocked/${user}/${myLogin}`).then(res => setIsBlocked(res.isBlocked));
            }
        } else {
            if (isCurrentChat) {
                setIsCurrentChat(false);
                getData(`${BASE_URL}/resetTyping/${myLogin}`);
            }
            getData(`${BASE_URL}/resetCurrentChat/${myLogin}`)
                .then(() => {
                    getData(`${BASE_URL}/counters/${myLogin}`).then(res => setCounters(res));
                    getData(`${BASE_URL}/lastMessages/${myLogin}`, setChatProcess).then(res => setChats(res));
                }); 
        }
    }, [chatId]);

    return (
        <OnlineContext.Provider value={{online, setOnline}}>
            <MessagesContext.Provider value={messages}>
                <CounterContext.Provider value={counters}>
                    <TypingContext.Provider value={typing}>
                        <ChangingMessageContext.Provider value={{changingMessage, setChangingMessage}}>
                            <IsBlockedContext.Provider value={isBlocked}>
                                <BlockedUsersContext.Provider value={blockedUsers}>
                                    <ChatsContext.Provider value={{chats, chatProcess}}>
                                        <FriendRequestsContext.Provider value={{friendRequests, setFriendRequests, friendRequestsProcess}}>
                                            <FriendContext.Provider value={{friends, setFriends, friendProcess}}>
                                                <FriendNotificationsContext.Provider value={{friendNotifications, setFriendNotifications, friendNotsProcess}}>
                                                    {children}
                                                </FriendNotificationsContext.Provider>
                                            </FriendContext.Provider>
                                        </FriendRequestsContext.Provider>
                                    </ChatsContext.Provider>
                                </BlockedUsersContext.Provider>
                            </IsBlockedContext.Provider>
                        </ChangingMessageContext.Provider>
                    </TypingContext.Provider>
                </CounterContext.Provider>
            </MessagesContext.Provider>
        </OnlineContext.Provider>
    );
}

export default SSEProvider;