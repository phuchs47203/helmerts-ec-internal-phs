import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { images } from '../../Constants'
import { ManageOrder, Account } from '../../Containers'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import UpdatePersonalInformation from '../UpdatePersonalInformation/UpdatePersonalInformation';

const MenuLink = () => (
    <>
        <p>
            <a href={`/order`} className='menu-link' >Order</a>
        </p>
        <p>
            <a href={`/product`} className='menu-link' >Product</a>
        </p>
        <p>
            <a href={`/user`} className='menu-link' >User</a>
        </p>
        <p>
            <a href={`/shipper`} className='menu-link' >Shipper</a>
        </p>

    </>
);
const Navbar = () => {
    const URL_LOGOUT = "http://localhost:8000/api/logout";
    const [accessTokenLogout, setaccessTokenLogout] = useState(null);
    const navigate = useNavigate();
    const [managerInforAccess, setmanagerInforAccess] = useState({});
    const [toggleAccount, settoggleAccount] = useState(false);
    const [PermitUsers, setPermitUsers] = useState(true);
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
    const isTokenValid = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
            const parsedAccessToken = JSON.parse(storedAccessToken);
            const expirationTime = new Date(parsedAccessToken.expiration_time);
            setmanagerInforAccess(parsedAccessToken.user);
            // console.log(parsedAccessToken.user.role);
            return Date.now() < expirationTime
                && (parsedAccessToken.user.role !== 'user')
                && (parsedAccessToken.user.role !== 'shipper');
        }
        return false;
    }
    useEffect(() => {
        const isLoggedIn = isTokenValid();
        if (isLoggedIn) {
            setPermitUsers(true);
        }
        else {
            setPermitUsers(false);
        }
    }, []);
    const handleClickAccount = () => {

    }
    const [toggleMenu, settoggleMenu] = useState(false);
    return (
        <div className='app-helmerts-navbar' id='navbar'>
            <div className='app-helmerts-navbar-logo'>
                <Link to="/home">
                    <img src={images.logo_helmerts} alt="Not support image" />
                </Link>
            </div>
            <div className='app-helmerts-navbar-content'>
                <div className='app-helmerts-navbar-content-link'>
                    <MenuLink />
                    <button
                        onClick={() => settoggleAccount(true)}
                        className='menu-link_button-account'>
                        Account
                    </button>
                    <button className='button_default btn-transition' onClick={() => settoggleMenu(false) & Loggout()}>
                        Logout
                    </button>
                </div>
                <div className='app-helmerts-navbar-content-menu'>
                    <div className='app-helmerts-navbar-content-menu-svg'>
                        {toggleMenu
                            ? <AiOutlineClose style={{ display: 'none' }} onClick={() => settoggleMenu(false)} />
                            : <AiOutlineMenu onClick={() => settoggleMenu(true)} />
                        }
                    </div>
                    {
                        toggleMenu &&
                        <div className='app-helmerts-navbar-content-menu-link fall-in-right'>
                            <div className='app-helmerts-navbar-content-menu-link-svg'>
                                <AiOutlineClose onClick={() => settoggleMenu(false)} />
                            </div>
                            <div className='app-helmerts-navbar-content-menu-link-content'>
                                <MenuLink onClick={() => settoggleMenu(false)} />
                                <button
                                    onClick={() => settoggleAccount(true) & settoggleMenu(false)}
                                    className='menu-link_button-account'>
                                    Account
                                </button>
                                <button className='button_default btn-transition' onClick={() => settoggleMenu(false) & Loggout()}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {
                toggleAccount &&
                <div className='app-helmerts-navbar-content-personal_information fall-in-up'>
                    <div className='app-helmerts-navbar-content-personal_information-back'
                    >
                        <div
                            onClick={() => settoggleAccount(false)}
                            className='app-helmerts-navbar-content-personal_information-back-button'>
                            <HiOutlineArrowNarrowLeft className='svg_back' />
                            <p className='back_'>Back</p>
                        </div>
                    </div>
                    <div className='app-helmerts-navbar-content-personal_information-content'>
                        <UpdatePersonalInformation User_Details={managerInforAccess} />
                    </div>
                </div>
            }
        </div >
    )
}

export default Navbar