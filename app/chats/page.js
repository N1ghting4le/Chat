'use client';

import Header from "@/components/Header";
import ChatsList from "@/components/ChatsList";
import SSEProvider from "@/components/SSEProvider";

export const metadata = {
    title: 'Ваши чаты',
    description: 'Страница со списком чатов пользователя'
};

const ChatsPage = () => {
    return (
        <SSEProvider>
            <Header/>
            <main>
                <ChatsList/>
            </main>
        </SSEProvider>
    );
}

export default ChatsPage;