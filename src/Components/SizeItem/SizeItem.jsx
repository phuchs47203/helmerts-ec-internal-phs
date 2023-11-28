import React, { useState, useEffect } from 'react'
import './SizeItem.css'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const SizeItem = ({ Product_size }) => {
    const [available, setavailable] = useState(Product_size.available);
    const [sold, setsold] = useState(Product_size.sold);

    const [errorEmail, seterrorEmail] = useState('');
    const [registerSuccess, setregisterSuccess] = useState('');
    const [pleaseWait, setpleaseWait] = useState('');
    const URL_LOGOUT = "http://localhost:8000/api/logout";
    const [accessTokenLogout, setaccessTokenLogout] = useState(null);
    const Loggout = () => {
        try {
            const storedAccessToken = localStorage.getItem('accessToken');
            const parsedAccessToken = JSON.parse(storedAccessToken);
            setaccessTokenLogout(parsedAccessToken.token);
            console.log("token:", parsedAccessToken.token);
            axios.post(URL_LOGOUT, null, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${parsedAccessToken.token}`
                }
            })
                .then(response => {
                    // console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });

            localStorage.removeItem('accessToken');

        } catch (error) {
            return error;
        }

    }
    const [PermitUsers, setPermitUsers] = useState(true);
    const [userInfor, setuserInfor] = useState({});
    const [accessToken, setaccessToken] = useState(null);
    const isTokenValid = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        console.log(Product_size.product_id);
        if (storedAccessToken) {
            const parsedAccessToken = JSON.parse(storedAccessToken);
            const expirationTime = new Date(parsedAccessToken.expiration_time);
            setuserInfor(parsedAccessToken.user);
            setaccessToken(parsedAccessToken.token);
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
    const URL_REQUEST = "http://localhost:8000/api/product-size/" + Product_size.id;

    const updateProductSize = () => {
        console.log(Product_size.id);
        if (available == Product_size.available && sold == Product_size.sold) {
            seterrorEmail('No change');
            setregisterSuccess('');
            setTimeout(() => {
                seterrorEmail('');
            }, 1000);
            return;
        }


        // console.log(URL_REQUEST);

        const formData = new FormData();

        formData.append('available', available);
        formData.append('sold', sold);



        axios
            .post(URL_REQUEST, formData,
                {
                    headers: { Accept: "application/json" },
                })
            .then((response) => {
                console.log(response.data);

                setregisterSuccess("Success");
                seterrorEmail('');
                setTimeout(() => {
                    setregisterSuccess('');
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                seterrorEmail('No change');
                setTimeout(() => {
                    seterrorEmail('');
                }, 1000);
            });
    };
    useEffect(() => {
        seterrorEmail('');
        setpleaseWait('');

    }, [registerSuccess]);
    useEffect(() => {
        setpleaseWait('');
    }, [errorEmail]);

    return (
        <div className='app-helmert-product_size'>
            <div className='app-helmert-product_size-left'>
                <div className='app-helmert-product_size-left-name'>
                    <h3>{Product_size.size}</h3>
                </div>
                <div className='app-helmert-product_size-left-input'>
                    <div className='app-helmert-product_size-left-input-item'>
                        <TextField
                            required
                            id="available"
                            label="Available"
                            variant="outlined"
                            value={available}
                            onChange={(e) => {
                                setavailable(e.target.value);
                            }}
                            type='number'
                            autoComplete="on"
                            style={commonTextFieldStyle}
                            InputLabelProps={{
                                classes: commonInputLabelStyle,
                            }}
                            InputProps={{
                                style: commonInputPropsStyle,
                                classes: commonInputClasses,
                            }}
                        />
                    </div>
                    <div className='app-helmert-product_size-left-input-item'>
                        <TextField
                            required
                            id="sold"
                            label="Sold"
                            variant="outlined"
                            value={sold}
                            onChange={(e) => {
                                setsold(e.target.value);
                            }}
                            type='number'
                            autoComplete="on"
                            style={commonTextFieldStyle}
                            InputLabelProps={{
                                classes: commonInputLabelStyle,
                            }}
                            InputProps={{
                                style: commonInputPropsStyle,
                                classes: commonInputClasses,
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='app-helmert-product_size-right'>
                {registerSuccess &&
                    <p>{registerSuccess}</p>
                }
                {errorEmail &&
                    <h6>{errorEmail}</h6>
                }
                <button
                    className='btn-transition button_update'
                    onClick={updateProductSize}
                >Update</button>
            </div>
        </div>
    )
}
const commonTextFieldStyle = {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 'none',
    border: '0px solid var(--color-p)',
    outline: 'none',
    background: 'transparent',
};

const commonInputLabelStyle = {
    root: 'custom-input-label',
};

const commonInputPropsStyle = {
    color: 'var(--color-p)',
    backgroundColor: 'transparent',
    borderRadius: '0rem',
    border: '0rem solid white',
    outline: 'none',
    fontSize: '13px',
    background: 'transparent',
    maxWidth: '300px',
    height: '40px',
    width: '100%'
};

const commonInputClasses = {
    root: 'custom-input-root',
    notchedOutline: 'custom-notched-outline',
    focused: 'custom-focused',
};

export default SizeItem