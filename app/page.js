import Link from 'next/link';
import LogInForm from '@/components/LogInForm';

import styles from '../styles/page.module.css';

export const metadata = {
  title: 'Вход',
  description: 'Страница для входа в аккаунт',
}

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <h1>Вход</h1>
        <LogInForm/>
        <span>Нет учётной записи? <Link href="/sign-up">Создайте её!</Link></span>
      </main>
    </div>
  )
}
