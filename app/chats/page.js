'use client';

import Header from "@/components/Header";
import ChatsList from "@/components/ChatsList";
import SSEProvider from "@/components/SSEProvider";
import Head from "next/head";

const ChatsPage = () => {
    return (
        <>
            <Head>
                <meta title="Мои чаты"/>
                <meta aria-description="Страница со списком чатов пользователя"/>
            </Head>
            <SSEProvider>
                <Header/>
                <main>
                    <ChatsList/>
                </main>
            </SSEProvider>
        </>
    );
}

export default ChatsPage;