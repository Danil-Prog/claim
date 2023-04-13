import React from 'react';
import axios from 'axios'

function CreateUser() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');

    const handlerSubmit = (event) => {
        event.preventDefault();
        authUser({username, password});
    }

    // const createUser = async (obj) => {
    //     try {
    //         await axios.post('http://localhost:8080/registration', obj);
    //     } catch (error) {
    //         console.log(error);
    //     }
       
    // }

    const authUser = async (obj) => {
        try {
            await axios.post('http://localhost:8080/auth', obj, {
                auth: {
                    username: obj.username,
                    password: obj.password
                  }
            });
            console.log(btoa(obj))
        } catch (error) {
            console.log(error);
        }
       
    }


    return(
        <div>
            <form onSubmit={handlerSubmit}>
                <label htmlFor="username">username:</label>
                <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="password">password:</label>
                <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="role">role:</label>
                <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="ROLE_USER">Пользователь</option>
                    <option value="ROLE_EXEC">Исполнитель</option>
                    <option value="ROLE_ADMIN">Администратор</option>
                </select>
                <input type="submit" value="Отправить"/>
            </form>
        </div>
    );
}

export default CreateUser;