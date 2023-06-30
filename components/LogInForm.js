'use client';

const BASE_URL = process.env.BASE_URL;

import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useHttp from "@/hooks/http.hook";

import styles from "../styles/page.module.css";

export const showHidePassword = (e, setType, type) => {
    type === 'password' ? setType('text') : setType('password');
    e.target.classList.toggle(styles.view);
}

const Form = () => {
    const router = useRouter();
    const [process, setProcess] = useState('idle');
    const [invalidData, setInvalidData] = useState('');
    const [type, setType] = useState('password');
    const { postData, getData } = useHttp();

    useEffect(() => {
        if (localStorage.getItem('myLogin')) {
            getData(`${BASE_URL}/users/${localStorage.getItem('myLogin')}/exit`);
            getData(`${BASE_URL}/resetCurrentChat/${localStorage.getItem('myLogin')}`);
            localStorage.clear();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const json = JSON.stringify(Object.fromEntries(formData.entries()));
        
        postData(`${BASE_URL}/check`, json, setProcess).then(res => {
            if (res) {
                if (res.login) {
                    setInvalidData('');
                    if (localStorage.getItem('myLogin') !== res.login) localStorage.setItem('myLogin', res.login);
                    router.push(`/users/${res.login}`);
                } else {
                    if (res.incorrectData === 'login') {
                        setInvalidData('login');
                    } else {
                        setInvalidData('password');
                    }
                }
            }
        });
    }

    return (
        <form action="#" className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.wrapper}>
                <label htmlFor="login">Введите логин</label>
                <input type="text" name='login' className={styles.input}/>
                {invalidData === 'login' ? <span style={{'color': 'red'}}>Неверный логин</span> : null}
            </div>
            <div className={styles.wrapper}>
                <div className={`${styles.password} ${styles.wrapper}`}>
                    <label htmlFor="password">Введите пароль</label>
                    <input type={type} name='password' className={styles.input}></input>
                    <span className={styles.passwordControl} onClick={(e) => showHidePassword(e, setType, type)}></span>
                </div>
                {invalidData === 'password' ? <span style={{'color': 'red'}}>Неверный пароль</span> : null}
            </div>
            {process === 'loading' ? <Loading/> : 
            <button type='submit' className={styles.button}>Войти</button>}
            {process === 'error' ? <span style={{'color': 'red'}}>Произошла ошибка</span> : null}
        </form>
    );
}

export default Form;