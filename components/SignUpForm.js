"use client";

const BASE_URL = process.env.BASE_URL;

import Loading from "./Loading";
import useHttp from "@/hooks/http.hook";
import { showHidePassword } from "./LogInForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useValidateField from "@/hooks/validateField.hook";

import styles from "../styles/signUp.module.css";

const SignUpForm = () => {
    const { getData, postFormData } = useHttp();
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = searchParams.get('login');
    const [loginMessage, setLoginMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [surnameMessage, setSurnameMessage] = useState('');
    const [photoMessage, setPhotoMessage] = useState('');
    const [ageMessage, setAgeMessage] = useState('');
    const [preview, setPreview] = useState('');
    const [firstType, setFirstType] = useState('password');
    const [secondType, setSecondType] = useState('password');
    const [process, setProcess] = useState('idle');
    const [loginProcess, setLoginProcess] = useState('idle');
    const [image, setImage] = useState('');
    const pattern = /^[a-z0-9\_\-]{3,13}$/i;
    const namePattern = /^[а-я\-]{2,15}$/i;
    const surnamePattern = /^[а-я\-]{2,25}$/i;
    const validateField = useValidateField();

    useEffect(() => {
        if (login) getData(`${BASE_URL}/users/${login}`).then(res => {
            if (res) {
                setPreview(res.image ? {src: `${BASE_URL}/${res.image}`} : null);
                for (let key in res) {
                    key !== 'image' ? document.getElementById(key).value = res[key] : setImage(res[key]);
                }
            }
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const password = formData.get('password') ?? '';
        const confirmPassword = formData.get('password_confirm') ?? '';
        const newLogin = formData.get('login') ?? '';

        if (name.length > 0) setNameMessage('');
        if (newLogin.length > 0) setLoginMessage(loginMessage => loginMessage === 'Обязательное поле' ? '' : loginMessage);
        if (password.length > 0) setPasswordMessage(passwordMessage => passwordMessage && passwordMessage !== 'Пароль может содержать только латинские буквы, цифры, дефисы и нижние подчёркивания. Минимальная длина - 3 символа, максимальная - 13' ? '' : passwordMessage);
        if (confirmPassword.length > 0) setConfirmPasswordMessage('');

        if (newLogin.length === 0 || name.length === 0 || password.length === 0) {
            document.querySelectorAll('[data-necessary]').forEach(field => {
                if (field.value.length === 0) {
                    switch (field.getAttribute('name')) {
                        case 'login':
                            setLoginMessage('Обязательное поле');
                            break;
                        case 'password':
                            setPasswordMessage('Обязательное поле');
                            break;
                        case 'name':
                            setNameMessage('Обязательное поле');
                            break;
                        default:
                            setConfirmPasswordMessage('Обязательное поле'); 
                            break;
                    }
                }
            });
        }

        if (password !== confirmPassword) {
            setPasswordMessage(passwordMessage => passwordMessage ? passwordMessage : 'Пароль в поле "Подтвердите пароль" не соответствует паролю в этом поле');
            return;
        }
        
        if (!login && (loginMessage !== 'Доступен' || passwordMessage || !password.length || !confirmPassword.length) || photoMessage || !name.length || nameMessage || ageMessage || surnameMessage) return;

        if (e.target.querySelector('#image').files.length > 0) {
            const file = e.target.querySelector('#image').files[0];
            formData.append('image', `${login || newLogin}${file.name.slice(file.name.indexOf('.'))}`);
        } else formData.append('image', image);

        formData.delete('password_confirm');

        postFormData(login ? `${BASE_URL}/updateProfile/${login}` : `${BASE_URL}/users`, formData, setProcess).then(res => {
            if (res) {
                localStorage.setItem('myLogin', res.login);
                router.push(`/users/${res.login}`);
            }
        });
    }

    const checkLogin = (e) => {
        validateField(!pattern.test(e.target.value) && e.target.value, setLoginMessage, 
        'Логин может содержать только латинские буквы, цифры, дефисы и нижние подчёркивания. Минимальная длина - 3 символа, максимальная - 13');
        if (!pattern.test(e.target.value) || !e.target.value) return;

        getData(`${BASE_URL}/isAvailable/${e.target.value}`, setLoginProcess).then(res => {
            if (res) {
                res.available ? setLoginMessage('Доступен') : setLoginMessage('Такой логин уже занят');
            } else setLoginMessage('Невозможно проверить доступность логина');
        });
    }

    const checkPassword = (e) => {
        validateField(!pattern.test(e.target.value) && e.target.value, setPasswordMessage, 
        'Пароль может содержать только латинские буквы, цифры, дефисы и нижние подчёркивания. Минимальная длина - 3 символа, максимальная - 13');
    }

    const checkName = (e) => {
        validateField(!namePattern.test(e.target.value) && e.target.value || e.target.value[0] === '-' || e.target.value[e.target.value.length - 1] === '-',
        setNameMessage, 'Имя может содержать только буквы кириллицы и дефис. Дефис не может стоять в начале и в конце. Минимальная длина - 2 символа, максимальная - 15');
    }

    const checkSurname = (e) => {
        validateField(!surnamePattern.test(e.target.value) && e.target.value || e.target.value[0] === '-' || e.target.value[e.target.value.length - 1] === '-',
        setSurnameMessage, 'Фамилия может содержать только буквы кириллицы и дефис. Дефис не может стоять в начале и в конце. Минимальная длина - 2 символа, максимальная - 25');
    }

    const checkAge = (e) => {
        validateField((e.target.value > 120 || e.target.value < 12) && e.target.value, setAgeMessage, 'Значение возраста должно быть не меньше 12 и не больше 120');
    }

    const handleUpload = (e) => {
        setPhotoMessage('');
        setPreview('');
      
        if (e.target.files[0]) {
            const file = e.target.files[0];
            if (file && !["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(file.type)) {
                setPhotoMessage('Выбранный вами файл не является фотографией');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => setPreview({ src: reader.result });
            reader.readAsDataURL(file);
        } else return;
    }
      

    const removeImage = () => {
        let input = document.getElementById('image');
        let newInput = document.createElement('input');
        newInput.type = input.type;
        newInput.id = input.id;
        newInput.accept = input.accept;
        newInput.name = input.name;
        newInput.classList.add(input.classList.value);
        newInput.addEventListener('change', handleUpload);
        input.replaceWith(newInput);
        setImage('');
        setPreview('');
        setPhotoMessage('');
    }

    return (
        <form action="#" encType="multipart/form-data" className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formWrapper}>
                {!login ? 
                <div className={styles.wrapper}>
                    <label htmlFor="login">Логин</label>
                    <input type="text" id="login" name='login' data-necessary style={loginMessage === 'Доступен' || !loginMessage ? null : {'borderColor': 'red'}} className={styles.input} onChange={checkLogin}/>
                    {loginProcess === 'loading' ? <Loading/> : loginMessage ? <span style={loginMessage === 'Доступен' ? {'color': 'green'} : {'color': 'red'}}>{loginMessage}</span> : null}
                </div> : null}
                {!login ? 
                <div className={styles.wrapper}>
                    <div className={`${styles.password} ${styles.wrapper}`}>
                        <label htmlFor="password">Пароль</label>
                        <input type={firstType} id="password" name='password' data-necessary style={passwordMessage ? {'borderColor': 'red'} : null} className={styles.input} onChange={checkPassword}/>
                        <span className={styles.passwordControl} onClick={(e) => showHidePassword(e, setFirstType, firstType)}></span>
                    </div>
                    {passwordMessage ? <span style={{'color': 'red'}}>{passwordMessage}</span> : null}
                </div> : null}
                <div className={styles.wrapper}>
                    <label htmlFor="name">Имя</label>
                    <input type="text" id="name" name='name' data-necessary style={nameMessage ? {'borderColor': 'red'} : null} className={styles.input} onChange={checkName}/>
                    {nameMessage ? <span style={{'color': 'red'}}>{nameMessage}</span> : null}
                </div>
                {!login ? 
                <div className={styles.wrapper}>
                    <div className={`${styles.password} ${styles.wrapper}`}>
                        <label htmlFor="password_confirm">Подтвердите пароль</label>
                        <input type={secondType} id="password_confirm" name="password_confirm" data-necessary style={confirmPasswordMessage ? {'borderColor': 'red'} : null} className={styles.input}/>
                        <span className={styles.passwordControl} onClick={(e) => showHidePassword(e, setSecondType, secondType)}></span>
                    </div>
                    {confirmPasswordMessage ? <span style={{'color': 'red'}}>{confirmPasswordMessage}</span> : null}
                </div> : null}
                <div className={styles.wrapper}>
                    <label htmlFor="surname">Фамилия (опционально)</label>
                    <input type="text" id="surname" name="surname" style={surnameMessage ? {'borderColor': 'red'} : null} className={styles.input} onChange={checkSurname}/>
                    {surnameMessage ? <span style={{'color': 'red'}}>{surnameMessage}</span> : null}
                </div>
                <div className={styles.wrapper}>
                    <label htmlFor="age">Возраст (опционально)</label>
                    <input type="number" id="age" name="age" style={ageMessage ? {'borderColor': 'red'} : null} className={styles.input} onChange={checkAge}/>
                    {ageMessage ? <span style={{'color': 'red'}}>{ageMessage}</span> : null}
                </div>
                <div className={styles.wrapper}>
                    <label htmlFor="location">Место жительства (опционально)</label>
                    <input type="text" id="location" name="location" className={styles.input}/>
                </div>
                <div className={styles.wrapper}>
                    <label htmlFor="info">О себе (опционально)</label>
                    <textarea type="text" id="info" name="info" className={styles.textarea}/>
                </div>
                <div className={`${styles.wrapper} ${styles.last}`}>
                    <label htmlFor="image">Фото профиля</label>
                    <div className={styles.additionalWrapper}>
                        <input type="file" accept="image/*" id="image" name="photo" className={styles.fileInput} onChange={handleUpload}/>
                        <input type="button" className={styles.fileButton} value="Выберите файл"/>
                    </div>
                    {preview ? <img src={preview.src} alt="profile photo" width="300px" height="300px" style={{'objectFit': 'cover'}}/> : null}
                    {image || preview || photoMessage ? <button className={styles.button} style={{'backgroundColor': 'rgb(150, 0, 0)'}} onClick={removeImage}>Убрать файл</button> : null}
                    {photoMessage ? <span style={{'color': 'red'}}>{photoMessage}</span> : null}
                </div>
            </div>
            {process === 'loading' ? <Loading/> : 
            <button type="submit" className={styles.button}>{login ? 'Обновить профиль' : 'Зарегистрироваться'}</button>}
            {process === 'error' ? <span style={{'color': 'red'}}>Произошла ошибка</span> : null}
        </form>
    );
}

export default SignUpForm;