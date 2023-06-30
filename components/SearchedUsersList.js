import SearchedUser from "./SearchedUser";

import styles from "../styles/searchedUsersList.module.css";

const SearchedUsersList = ({searchedUsers, top, display, string}) => {
    const renderList = () => {
        return searchedUsers.users ? searchedUsers.users.map(user => {
            const {login, name, surname, age, location, image} = user;
            return <SearchedUser key={login} login={login} name={name} surname={surname} age={age} location={location} image={image} string={string}/>;
        }) : <li className={styles.listItem}>{searchedUsers}</li>;
    }

    const elements = renderList();

    return (
        <ul style={{'position': 'absolute', top, display}} className={styles.list}>
            {elements}
        </ul>
    );
}

export default SearchedUsersList;