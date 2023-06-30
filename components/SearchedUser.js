const {BASE_URL} = require('.env.js');

import Link from "next/link";
import Image from "next/image";
import { setAgeString } from "@/app/[...login]/page";

import styles from "../styles/searchedUsersList.module.css";

export const createSymbolElements = (name, surname, age, location, string) => {
    const userString = `${name}${surname ? ' ' + surname : ''}${age ? ', ' + age + ' ' + setAgeString(age) : ''}${location ? ', ' + location : ''}`;
    const userArray = userString.split('');
    const symbols = userArray.map((symbol, i) => <span key={i} style={string.toLowerCase().includes(symbol.toLowerCase()) ? {'fontWeight': '600'} : null}>{symbol}</span>);
    return {symbols, userString};
}

const SearchedUser = ({login, name, surname, age, location, image, string}) => {
    const {symbols} = createSymbolElements(name, surname, age, location, string);

    return (
        <li className={styles.listItem}>
            <Link href={`/users/${login}`} className={styles.link} prefetch={false}>
                <Image src={image ? `${BASE_URL}/${image}` : "https://img.icons8.com/material/30/7B92AD/camera--v1.png"} alt={`profile photo of ${name}`} width={50} height={50} style={{'objectFit': 'cover'}}/>
                <p>{symbols}</p>
            </Link>
        </li>
    );
}

export default SearchedUser;