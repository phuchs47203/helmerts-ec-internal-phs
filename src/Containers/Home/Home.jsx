import React, { useEffect, useState } from 'react'
import './Home.css'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login/Login';
import { UserItem, UpdateUser } from '../../Components';
const Home = () => {
    const navigate = useNavigate();
    const [listUsers, setlistUsers] = useState([]);
    const [permitUser, setPermitUser] = useState(true);
    const [expire_at, setexpire_at] = useState(null);
    const [waiting, setwaiting] = useState(false);
    const [userInfor, setuserInfor] = useState({});
    const [accessToken, setaccessToken] = useState(null);
    const [localToken, setlocalToken] = useState(null);

    const isTokenValid = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
            const parsedAccessToken = JSON.parse(storedAccessToken);
            const expirationTime = new Date(parsedAccessToken.expiration_time);
            setuserInfor(parsedAccessToken.user);
            setaccessToken(parsedAccessToken.token);
            setlocalToken(parsedAccessToken);
            setwaiting(true);
            // console.log(parsedAccessToken.user.role);
            console.log("Minutes: ", (expirationTime.getTime() - Date.now()) / 60000);

            return Date.now() < expirationTime.getTime()
                && (parsedAccessToken.user.role !== 'user')
                && (parsedAccessToken.user.role !== 'shipper');
        }
        return false;
    }

    useEffect(() => {
        const isLoggedIn = isTokenValid();
        if (isLoggedIn) {
            setPermitUser(true);
        }
        else {
            setPermitUser(false);
        }
    }, []);

    const URL_REQUEST_USER = "http://localhost:8000/api/users-user";
    useEffect(() => {
        console.log(accessToken);
        try {
            axios.get(URL_REQUEST_USER, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    setlistUsers(response.data);
                    setwaiting(false);
                })
                .catch(error => {
                    console.log(error);
                });

        } catch (err) {
            console.log(err);
        }

    }, [accessToken]);
    const URL_LOGOUT = "http://localhost:8000/api/logout";
    const [accessTokenLogout, setaccessTokenLogout] = useState(null);
    const Loggout = () => {
        try {
            const storedAccessToken = localStorage.getItem('accessToken');
            const parsedAccessToken = JSON.parse(storedAccessToken);
            setaccessTokenLogout(parsedAccessToken.token);
            // console.log("token:", parsedAccessToken.token);
            axios.post(URL_LOGOUT, null, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${parsedAccessToken.token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });

            localStorage.removeItem('accessToken');
            setTimeout(() => {
                navigate(`/`);
                window.location.reload();
            }, 1500);
        } catch (error) {
            return error;
        }
    }
    return (
        <div id='home' className='app-helmerts-home'>
            {!permitUser &&
                <div className='app-helmerts-home-error'>
                    <h1 className='app-helmerts-home-error-fixed'>You do not have permission to access this page</h1>
                    <div className='app-helmerts-home-error-login'>
                        <Login />
                    </div>
                </div>
            }
            {permitUser &&
                <div className='app-helmerts-home-main'>
                    <div className='app-helmerts-home-main-box'>
                        <div className='app-helmerts-home-main-heading'>
                            <h1>Manage User</h1>
                            <p>HELMETS commits not to sell or share user information in any form.
                                For further information, please read the&nbsp;
                                <a href="/information" className='link_'>Protect Personal Information</a>
                                &nbsp; of Helmerts.&nbsp;
                                <span className='alert_violate'>Any violating individuals or organizations will be handled according to the law</span>
                            </p>
                        </div>
                        {waiting &&
                            <div className='app-helmerts-home-main-box-waiting'>
                                <p className='color-change'>
                                    Please wait a few seconds
                                </p>
                            </div>
                        }
                        <div className='app-helmerts-home-main-content'>
                            {localToken && listUsers.map((item, index) => (
                                <UserItem User={item} key={item.id} localToken={localToken} />
                            ))
                            }
                        </div>



                    </div>
                </div>
            }
        </div>
    )
}

export default Home