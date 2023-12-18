import React, { useState, useEffect } from 'react'
import './ManageProduct.css'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login/Login';
import { UserItem, UpdateUser, ProductItem } from '../../Components';
const ManageProduct = () => {
    const navigate = useNavigate();
    const [userInfor, setuserInfor] = useState({});
    const [listProduct, setlistProduct] = useState([]);
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
            setuserInfor(parsedAccessToken.user);
            setaccessToken(parsedAccessToken.token);
            setlocalToken(parsedAccessToken);
            setwaiting(true);
            // console.log(parsedAccessToken.user.role);
            return Date.now() < expirationTime
                && (parsedAccessToken.user.role !== 'user')
                && (parsedAccessToken.user.role !== 'shipper');
        }
        return false;
    }
    const URL_REQUEST_PRODUCT = "http://localhost:8000/api/products";
    useEffect(() => {
        // console.log(accessToken);
        try {
            axios.get(URL_REQUEST_PRODUCT, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localToken.token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    setlistProduct(response.data);
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
    const handleCreateProduct = () => {
        navigate('/create-product');
    }
    return (
        <div id='product'>
            {permitUser &&
                <div className='app-helmerts-product-main'>
                    <div className='app-helmerts-product-main-box'>
                        <div className='app-helmerts-home-main-heading'>
                            <h1>Manage Product</h1>
                            <p>HELMETS commits not to sell or share user information in any form.
                                For further information, please read the&nbsp;
                                <a href="/information" className='link_'>Protect Personal Information</a>
                                &nbsp; of Helmerts.&nbsp;
                                <span className='alert_violate'>Any violating individuals or organizations will be handled according to the law</span>
                            </p>
                        </div>
                        <div className='app-helmerts-home-main-create_product btn-trainsition'>
                            <button
                                className='button_default'
                                onClick={handleCreateProduct}
                            >
                                Create new product
                            </button>
                        </div>
                        {waiting &&
                            <div className='app-helmerts-home-main-box-waiting'>
                                <p className='color-change'>
                                    Please wait a few seconds
                                </p>
                            </div>
                        }
                        <div className='app-helmerts-product-main-content'>
                            {listProduct.map((item, index) => (
                                <ProductItem Product={item} key={item.id} />
                            ))
                            }
                        </div>



                    </div>
                </div>
            }
            {!permitUser &&
                <div className='app-helmerts-product-error'>
                    <h1 className='app-helmerts-product-error-fixed'>You do not have permission to access this page</h1>
                    <div className='app-helmerts-product-error-login'>
                        <Login />
                    </div>
                </div>
            }

        </div>
    )
}

export default ManageProduct