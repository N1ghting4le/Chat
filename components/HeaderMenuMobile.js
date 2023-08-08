import Popup from "reactjs-popup";
import Link from "next/link";

import styles from "../styles/header.module.css";
import 'reactjs-popup/dist/index.css';

const HeaderMenuMobile = ({ myLogin, friendNotsTotal, friendRequestsTotal, total }) => {
    return (
        <Popup
            trigger={<button className={styles.button}>
                        <hr className={styles.line}/>
                        <hr className={styles.line}/>
                        <hr className={styles.line}/>
                    </button>}
            position="bottom left"
            on="click"
            contentStyle={{'padding': '0', 'backgroundColor': 'blue', 'border': '0', 'boxShadow': 'none'}}
            offsetX={-16}
            offsetY={16}
            arrow={false}>
            <nav className={styles.navigationMobile}>
                <Link href={myLogin ? `/users/${myLogin}` : ''} className={styles.link}>Мой профиль</Link>
                <Link href="/friends" className={styles.link}>Друзья {friendNotsTotal ? <span className={styles.chatCounter}>{friendNotsTotal}</span> : null}</Link>
                <Link href="/friend-requests" className={styles.link}>Запросы на дружбу {friendRequestsTotal ? <span className={styles.chatCounter}>{friendRequestsTotal}</span> : null}</Link>
                <Link href="/chats" className={styles.link}>Чаты {total ? <span className={styles.chatCounter}>{total}</span> : null}</Link>
            </nav>
        </Popup>
    );
}

export default HeaderMenuMobile;