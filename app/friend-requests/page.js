import Header from "@/components/Header";
import SSEProvider from "@/components/SSEProvider";
import FriendRequestsList from "@/components/FriendRequestsList";

import styles from "../../styles/friendRequestsPage.module.css";

export const metadata = {
    title: 'Запросы в друзья',
    description: 'Страница со входящими запросами на добавление в друзья'
};

const FriendRequestsPage = () => {
    return (
        <SSEProvider>
            <Header/>
            <nav className={styles.navigation}>
                <a className={styles.navLink} href="#sended">Исходящие</a>
                <a className={styles.navLink} href="#received">Входящие</a>
            </nav>
            <main className={styles.main}>
                <FriendRequestsList type="sended"/>
                <FriendRequestsList type="received"/>
            </main>
        </SSEProvider>
    );
}

export default FriendRequestsPage;