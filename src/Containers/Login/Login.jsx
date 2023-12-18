import React, { useState, useEffect } from 'react'
import './Login.css'
import { images } from '../../Constants'
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const URL_REQUEST = "http://localhost:8000/api/login";
    const [valueEmail, setvalueEmail] = useState(null);
    const [valuePassword, setvaluePassword] = useState(null);
    const navigate = useNavigate();
    const handleChangeEmail = (event) => {
        setvalueEmail(event.target.value);
    };
    const handleChangePassword = (event) => {
        setvaluePassword(event.target.value);
    }
    const [storedAccessToken, setstoredAccessToken] = useState(null);
    const [errorEmailOrPassword, seterrorEmailOrPassword] = useState('');
    const [loginSuccess, setloginSuccess] = useState('');
    const requestSignIn = () => {
        const fromData = new FormData();
        fromData.append('email', valueEmail);
        fromData.append('password', valuePassword);

        axios
            .post(URL_REQUEST, fromData,
                {
                    headers: { Accept: "application/json" },
                })
            .then((response) => {
                const { token, user } = response.data;
                const accessToken = {
                    token: token,
                    expiration_time: new Date(new Date().getTime() + 58 * 60 * 1000), // Thời gian hết hạn sau 30 phút
                    user: user
                }
                if (user.role === 'manager' || user.role === 'admin') {
                    localStorage.setItem('accessToken', JSON.stringify(accessToken));

                    setloginSuccess('Loggin successfully');

                    setstoredAccessToken(localStorage.getItem('accessToken'));
                    setTimeout(() => {
                        navigate(`/home`);
                        window.location.reload();
                    }, 1000);
                }
                seterrorEmailOrPassword('The email address or password is incorrect');

            })
            .catch((error) => {
                console.log(error);
                seterrorEmailOrPassword('The email address or password is incorrect');
            });
    };
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
                // window.location.reload();
            }, 1500);
        } catch (error) {
            return error;
        }

    }
    useEffect(() => {
        seterrorEmailOrPassword('');
    }, [loginSuccess]);
    useEffect(() => {
        if (storedAccessToken) {
            const parsedAccessToken = JSON.parse(storedAccessToken);
            // console.log("token saved: ")
            // console.log(parsedAccessToken.token); // Xuất giá trị của trường "token"
            // console.log(parsedAccessToken.expiration_time); // Xuất giá trị của trường "expiration_time"
            // console.log(parsedAccessToken.user); // Xuất giá trị của trường "role"
        }
    }, [storedAccessToken]);
    return (
        <div id='signin' className='app-helmerts-signin'>
            <div className='app-helmerts-signin-box'>
                <div className='app-helmerts-signin-heading'>
                    <div className='app-helmerts-signin-heading-logo'>
                        <img src={images.logo_helmerts} alt="No Support image" />
                    </div>
                    <div className='app-helmerts-signin-heading-title'>
                        <h1>
                            Sign in to Helmerts
                        </h1>
                    </div>
                </div>
                <div className='app-helmerts-signin-content'>
                    <div className='app-helmerts-signin-content-input'>
                        <div className='app-helmerts-signin-content-input-email'>
                            <TextField
                                required
                                id="email"
                                label="E-mail"
                                // variant="outlined"
                                value={valueEmail}
                                onChange={handleChangeEmail}
                                type='email'
                                // autoComplete="current-email"
                                // className='custom-textfield-input'
                                autoComplete="on"
                                style={{
                                    backgroundColor: 'white',
                                    width: '100%',
                                    borderRadius: 'none',
                                    border: '0px solid var(--color-p)',
                                    outline: 'none',
                                    background: 'transparent',
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: 'custom-input-label'
                                    }
                                }}
                                InputProps={{
                                    style: {
                                        color: 'var(--color-p)',
                                        backgroundColor: 'transparent',
                                        borderRadius: '0rem',
                                        border: '0rem solid white',
                                        outline: 'none',
                                        fontSize: '13px',
                                        background: 'transparent',
                                        width: '100%',
                                    },
                                    classes: {
                                        root: 'custom-input-root',
                                        notchedOutline: 'custom-notched-outline',
                                        focused: 'custom-focused'
                                    }
                                }} />
                        </div>
                        <div className='app-helmerts-signin-content-input-password'>
                            <div className='app-helmerts-signin-content-input-password-content'>
                                <TextField
                                    required
                                    id="outlined-password-input"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={valuePassword}
                                    onChange={handleChangePassword}
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
                            <div className='app-helmerts-signin-content-input-password-forgot'>
                                <p>
                                    Forgot password?
                                </p>
                            </div>
                        </div>
                    </div>
                    {loginSuccess &&
                        <div className='app-helmerts-signin-content-success'>
                            <p>{loginSuccess}</p>
                        </div>
                    }
                    {errorEmailOrPassword &&
                        <div className='app-helmerts-signin-content-error'>
                            <p>{errorEmailOrPassword}</p>
                        </div>
                    }
                    <div className='app-helmerts-signin-content-btn'>
                        <button className='btn-transition button_default' onClick={requestSignIn}>Sign in</button>
                    </div>
                    <div className='app-helmerts-signin-content-signup'>
                        <p>New Manager's Helmerts? Contact&nbsp;
                            <a href="mailto:support@helmerts.com" className='signup_link'>
                                support@helmerts.com
                            </a>
                            &nbsp;to create an account
                        </p>

                    </div>

                </div>
            </div>

        </div >
    )
};
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
    width: '100%',
};

const commonInputClasses = {
    root: 'custom-input-root',
    notchedOutline: 'custom-notched-outline',
    focused: 'custom-focused',
};
export default Login