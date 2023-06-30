import SignUpForm from "@/components/SignUpForm";

import styles from "../../styles/signUp.module.css";

export const metadata = {
    title: 'Регистрация | Обновление профиля',
    description: 'Страница для регистрации',
}

const SignUpPage = ({searchParams}) => {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>{searchParams.login ? 'Обновление профиля' : 'Регистрация'}</h1>
            <SignUpForm/>
        </main>
    );
}

export default SignUpPage;