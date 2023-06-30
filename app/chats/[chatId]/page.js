const BASE_URL = process.env.BASE_URL;

import Header from "@/components/Header";
import ChatPageWrapper from "@/components/ChatPageWrapper";
import SSEProvider from "@/components/SSEProvider";

export const metadata = {
    description: 'Страница чата'
};

const getChatInfo = async (chatId) => {
    const res = await fetch(`${BASE_URL}/chats/${chatId}`, {cache: "no-store"});
    return res.json();
}

const chatPage = async ({params}) => {
    const chatId = params.chatId;
    const chatInfo = await getChatInfo(chatId);
    const {users} = chatInfo;

    return (
        <SSEProvider chatId={chatId} users={users}>
            <Header/>
            <ChatPageWrapper chatId={chatId} users={users}/>
        </SSEProvider>
    );
}

export default chatPage;