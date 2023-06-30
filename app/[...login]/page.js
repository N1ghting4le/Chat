'use client';

const {BASE_URL} = require('.env.js');

import Header from "@/components/Header";
import ButtonSection from "@/components/ButtonSection";
import SSEProvider from "@/components/SSEProvider";

import styles from "../../styles/userPage.module.css";

export const metadata = {
    description: 'Страница пользователя'
};

const getUserInfo = async (login) => {
    const res = await fetch(`${BASE_URL}/users/${login}`, {cache: "no-store"});
    return res.json();
}

export const setAgeString = (age) => {
    if ((age >= 10 && age <= 20) || age % 10 >= 5) {
        return 'лет';
    } else if (age % 10 >= 2 && age % 10 <= 4) {
        return 'года';
    } else if (age) {
        return 'год';
    } else return '';
}

const userPage = async ({params}) => {
    const login = params.login[1];
    const userInfo = await getUserInfo(login);
    const {name, surname, age, location, info, image} = userInfo;

    return (
        <SSEProvider>
            <Header/>
            <main className={styles.main}>
                <section className={styles.userInfo}>
                    <img src={image ? `${BASE_URL}/${image}` : "https://img.icons8.com/material/400/7B92AD/camera--v1.png"} alt={`profile photo of ${name}`} className={styles.image} style={{'objectFit': 'cover'}}/>
                    <div className={styles.textInfoWrapper}>
                        <h1 className={styles.bold}>{name} {surname}</h1>
                        {age ? 
                        <div className={styles.infoString}>
                            <span className={styles.bold}>Возраст:</span>
                            <span>{age} {setAgeString(age)}</span>
                        </div> : null}
                        {location ? 
                        <div className={styles.infoString}>
                            <span className={styles.bold}>Место жительства:</span>
                            <span>{location}</span>
                        </div> : null}
                        {info ? 
                        <div>
                            <span className={styles.bold}>Обо мне:</span>
                            <p>{info}</p>
                        </div> : null}
                    </div>
                </section>
                <ButtonSection login={login} name={name} surname={surname} image={image}/>
            </main>
        </SSEProvider>
    );
}

export default userPage;