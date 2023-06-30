const BASE_URL = process.env.BASE_URL;

import { useCallback } from "react";

const useHttp = () => {
    const postData = useCallback(async (url, body, setProcess) => {
        const headers = {'Content-Type': 'application/json; charset=utf-8'};
        const method = 'POST';
    
        try {
            setProcess('loading');
            const res = await fetch(url, {method, headers, body});
            if (!res.ok) {
                setProcess('error');
                throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
            }
            setProcess('idle');
            return await res.json();
        } catch(err) {
            console.log(`Could not fetch ${url}`);
            setProcess('error');
        }
    }, []);

    const postFormData = useCallback(async (url, body, setProcess) => {
        const method = 'POST';
    
        try {
            setProcess('loading');
            const res = await fetch(url, {method, body});
            if (!res.ok) {
                setProcess('error');
                throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
            }
            setProcess('idle');
            return await res.json();
        } catch(err) {
            console.log(`Could not fetch ${url}`);
            setProcess('error');
        }
    }, []);

    const getData = useCallback(async (url, setProcess) => {
        try {
            if (setProcess) setProcess('loading');
            const res = await fetch(url);
            if (!res.ok) {
                if (setProcess) setProcess('error');
                throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
            }
            if (setProcess) setProcess('success');
            return await res.json();
        } catch(err) {
            console.log(`Could not fetch ${url}`);
            if (setProcess) setProcess('error');
        }
    }, []);

    const SSEConnection = useCallback((url, users, ...setState) => {
        const eventSource = new EventSource(url);
        const [setMessages, setOnline, setCounters, setTyping, setIsBlocked, setBlockedUsers, setChats, setFriendRequests, setFriends, setFriendNotifications] = setState;

        eventSource.onmessage = ({data}) => {
            if (typeof data !== 'string') {
                console.warn('Unsupported sse data type (should be string)', {data, dataType: typeof data});
                return;
            }

            try {
                const response = JSON.parse(data);
                const myLogin = localStorage.getItem('myLogin');
                if (response.text) {
                    if (!users) getData(`${BASE_URL}/getLastMessage/${response.chatId}`).then(res => setChats(chats => chats.map(chat => chat.chatId === res.chatId ? {...chat, lastMessage: res} : chat)));
                    if (typeof response.index !== 'undefined') {
                        setMessages(messages => messages.map((message, i) => i === response.index ? response : message));
                        return;
                    } else {
                        setMessages(messages => [...messages, response]);
                    }
                
                    if (!users || !users.includes(response.login)) {
                        setCounters(counters => counters.map(counter => counter.id === response.chatId ? {...counter, number: counter.number + 1} : counter));
                    } else if (myLogin === response.login) {
                        users.forEach(login => {
                            if (login !== myLogin) {
                                getData(`${BASE_URL}/getCurrentChat/${login}`).then(res => {
                                    !res.chatId || res.chatId !== response.chatId ? getData(`${BASE_URL}/increaseCounter/${response.chatId}/${login}`) : null;
                                });
                            }
                        });
                    }

                } else if (typeof response.online !== 'undefined') {
                    setOnline(response.online);
                } else if (response.id && !response.delete && (!response.answer && !response.state)) {
                    setMessages(messages => messages.map(message => message.id === response.id ? {...message, read: true} : message));
                } else if (typeof response.typing !== 'undefined') {
                    setTyping(response.typing);
                } else if (response.delete) {
                    setMessages(messages => messages.filter(message => message.id !== response.id));
                    if (!users) getData(`${BASE_URL}/getLastMessage/${response.chatId}`).then(res => setChats(chats => chats.map(chat => chat.chatId === res.chatId ? res.text ? {...chat, lastMessage: res} : {...chat, lastMessage: {}} : chat)));
                    if (!response.read) {
                        getData(`${BASE_URL}/getCurrentChat/${myLogin}`)
                            .then(res => {
                                res.chatId === response.chatId ? null :
                                setCounters(counters => counters.map(counter => counter.id === response.chatId ? {...counter, number: counter.number - 1} : counter));
                            });
                    }
                } else if (typeof response.block !== 'undefined') {
                    response.login === myLogin ? setIsBlocked(response.block) : 
                    response.block ? setBlockedUsers(users => [...users, response.login]) : setBlockedUsers(users => users.filter(login => login !== response.login));
                } else if (response.state) {
                    switch (response.state) {
                        case 'send':
                            setFriendRequests(requests => ({...requests, received: [...requests.received, response.login]}));
                            break;
                        case 'cancel':
                            setFriendRequests(requests => ({...requests, received: requests.received.filter(req => req !== response.login)}));
                            break;
                        default:
                            setFriendRequests(requests => ({...requests, sended: requests.sended.filter(req => req !== response.login)}));
                            setFriendNotifications(nots => [...nots, {id: response.id, login: response.login, name: response.name, surname: response.surname, answer: response.state}]);
                            break;
                    } 
                } else if (response.answer) {
                    if (response.answer === 'accept') {
                        myLogin === response.firstLogin ? setFriends(friends => [...friends, response.secondLogin]) : setFriends(friends => [...friends, response.firstLogin]);
                    } else {
                        if (myLogin === response.firstLogin) {
                            setFriends(friends => friends.filter(friend => friend !== response.secondLogin));
                            setFriendNotifications(nots => [...nots, {id: response.id, login: response.secondLogin, name: response.name, surname: response.surname, answer: response.answer}]);
                        } else setFriends(friends => friends.filter(friend => friend !== response.firstLogin));
                    }
                } else if (response.chatId) {
                    setChats(chats => chats.filter(chat => chat.chatId !== response.chatId));
                    setCounters(counters => counters.filter(counter => counter.id !== response.chatId));
                } else if (response.chat) {
                    const [login] = response.chat.users.filter(user => user !== myLogin);
                    getData(`${BASE_URL}/users/${login}`).then(res => {
                        const {name, surname, image} = res;
                        setChats(chats => [...chats, {chatId: response.chat.id, name, surname, image, lastMessage: {login: '', text: ''}}]);
                        setCounters(counters => [...counters, {id: response.chat.id, number: 0}]);
                    });
                }
            } catch(err) {
                console.error(err);
            }
        }

        return eventSource;
    }, []);

    return {postData, postFormData, getData, SSEConnection};
}

export default useHttp;