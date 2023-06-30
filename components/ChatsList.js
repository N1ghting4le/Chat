"use client";

import ChatsListItem from "./ChatsListItem";
import Loading from "./Loading";
import { useContext } from "react";
import { ChatsContext } from "./SSEProvider";

const ChatsList = () => {
    const {chats, chatProcess} = useContext(ChatsContext);
    const renderList = () => chatProcess === 'loading' ? <Loading/> : chatProcess === 'error' ? <h2 style={{'color': 'red'}}>Произошла ошибка</h2> :
    chatProcess === 'success' ? chats.length ? chats.map(chat => <ChatsListItem key={chat.chatId} chat={chat}/>) : 
    <h1 style={{'width': '100%', 'padding': '1rem', 'textAlign': 'center'}}>Вы не состоите ни в одном из чатов</h1> : null;
    const elements = renderList();

    return (
        <ul style={{'minHeight': '300px'}}>
            {elements}
        </ul>
    );
}

export default ChatsList;