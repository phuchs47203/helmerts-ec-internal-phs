import React, { useState, useEffect } from 'react'
import './ManageUser.css'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserItem, UpdateUser } from '../../Components';
const ManageUser = () => {
    const navigate = useNavigate();
    const [userInfor, setuserInfor] = useState({});
    const [listUsers, setlistUsers] = useState([]);
    const [permitUser, setPermitUser] = useState(true);
    const [accessToken, setaccessToken] = useState(null);
    const [expire_at, setexpire_at] = useState(null);
    const [waiting, setwaiting] = useState(false);
    const [localToken, setlocalToken] = useState(null);

    const isTokenValid = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
            const parsedAccessToken = JSON.parse(storedAccessToken);
            const expirationTime = new Date(parsedAccessToken.expiration_time);
            setlocalToken(parsedAccessToken);
            setuserInfor(parsedAccessToken.user);
            setaccessToken(parsedAccessToken.token);
            setwaiting(true);
            // console.log(parsedAccessToken.user.role);
            return Date.now() < expirationTime
                && (parsedAccessToken.user.role !== 'user')
                && (parsedAccessToken.user.role !== 'shipper');
        }
        return false;
    }
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
    useEffect(() => {
        const isLoggedIn = isTokenValid();
        if (isLoggedIn) {
            setPermitUser(true);
        }
        else {
            setPermitUser(false);
        }
    }, []);
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
                            {listUsers.map((item, index) => (
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

export default ManageUser