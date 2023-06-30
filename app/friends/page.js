import SSEProvider from "@/components/SSEProvider";
import FriendsList from "@/components/FriendsList";
import FriendNotsList from "@/components/FriendNotsList";
import Header from "@/components/Header";

import styles from "../../styles/friendsPage.module.css";

export const metadata = {
    title: 'Друзья',
    description: 'Страница со списками друзей и уведомлений о принятии или отклонении запросов на добавление в друзья'
};

const FriendsPage = () => {
    return (
        <SSEProvider>
            <Header/>
            <nav className={styles.navigation}>
                <a className={styles.navLink} href="#friends">Друзья</a>
                <a className={styles.navLink} href="#notifications">Уведомления</a>
            </nav>
            <main className={styles.main}>
                <FriendsList/>
                <FriendNotsList/>
            </main>
        </SSEProvider>
    );
}

export default FriendsPage;