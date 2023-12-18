import React, { useEffect, useState } from 'react'
import './UpdatePersonalInformation.css'
import { Link, json, useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
const UpdatePersonalInformation = ({ User_Details, localToken }) => {
    const defaultProps = {
        options: top7OptionTitle,
        getOptionLabel: (option) => option.name,
    };
    const flatProps = {
        options: top7OptionTitle.map((option) => option.name),
    };
    const defaultPropsCountry = {
        options: top6OptionLocation,
        getOptionLabel: (option) => option.country,
    };
    const navigate = useNavigate();
    const [valueEmail, setValueEmail] = useState(User_Details.email);
    const [valuePassword, setValuePassword] = useState(null);
    const [valueTitle, setValueTitle] = useState(User_Details.title);
    const [valueCountry, setValueCountry] = useState(User_Details.country);
    const [firstName, setfirstName] = useState(User_Details.first_name);
    const [lastName, setlastName] = useState(User_Details.last_name);
    const [phoneNumber, setphoneNumber] = useState(User_Details.phone_number);
    const [fileURL, setfileURL] = useState(User_Details.imgurl);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [dateOfBirth, setdateOfBirth] = useState(null);
    const [valueDate, setValueDate] = React.useState(dayjs(User_Details.dateofbirth));
    // const [valueLocation, setValueLocation] = useState(null);
    const [valueAddressDetails, setvalueAddressDetails] = useState(User_Details.address_details);
    const [valueCity, setvalueCity] = useState(User_Details.city);
    const [valueDistrict, setvalueDistrict] = useState(User_Details.district);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleChangeEmail = (event) => {
        setValueEmail(event.target.value);
    };
    const handleChangePassword = (event) => {
        setValuePassword(event.target.value);
    }
    const handleChangeFirstName = (event) => {
        setfirstName(event.target.value);
    };
    const handleChangeLastName = (event) => {
        setlastName(event.target.value);
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        setSelectedFile(file);
        if (file) {
            // console.log("has file");

            reader.readAsDataURL(file);
            reader.onload = () => {
                setfileURL(reader.result);
                // console.log(selectedFile);
            }
        }
    }
    const handleChangeAddress = (event) => {
        setvalueAddressDetails(event.target.value);
    };

    const handleChangeCity = (event) => {
        setvalueCity(event.target.value);
    };
    const handleChangeDistrict = (event) => {
        setvalueDistrict(event.target.value);
    };
    const handleChangeDateOfBirth = (event) => {
        setdateOfBirth(event.target.value);
    };
    const handleChangePhoneNumber = (event) => {
        setphoneNumber(event.target.value);
    };



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
                    Authorization: `Bearer ${localToken.token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });

            localStorage.removeItem('accessToken');

        } catch (error) {
            return error;
        }

    }
    const saveUser = () => {
        const URL_REQUEST = "http://localhost:8000/api/users/" + User_Details.id;
        const formData = new FormData();
        setpleaseWait('Please Wait ...!');
        seterrorEmail('');
        const formattedDate = dayjs(valueDate).format('YYYY-MM-DD');
        console.log(formattedDate);

        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('email', valueEmail);
        formData.append('title', valueTitle);
        formData.append('phone_number', phoneNumber);
        formData.append('country', valueCountry);
        formData.append('city', valueCity);
        formData.append('district', valueDistrict);
        formData.append('address_details', valueAddressDetails);
        if (selectedFile) {
            formData.append('imgurl', selectedFile);
        }
        formData.append('dateofbirth', formattedDate);
        if (valuePassword) {
            formData.append('password', valuePassword);
            formData.append('password_confirmation', valuePassword);
        }
        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }
        axios
            .post(URL_REQUEST, formData,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localToken.token}`
                    }
                })
            .then((response) => {
                console.log(response.data);
                setregisterSuccess('Update Successfully! Logout To Refresh Information');
                // Loggout();
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1500);
            })
            .catch((error) => {
                console.log(error);
                seterrorEmail('The Email Address Already Been Taken!');
                setregisterSuccess('');
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
        <div id='signup' className='app-helmerts-internal-update-box'>
            <div className='app-helmerts-internal-update'>
                <div className='app-helmerts-internal-update-heading'>
                    <h1>Your personal information</h1>
                    <p>
                        By updating your account, you agree to accept the&nbsp;
                        <Link to="/information" className='link_'>
                            General Terms and Conditions
                        </Link>
                        &nbsp;of Use and that your data will be processed in compliance with the&nbsp;
                        <Link to="/information" className='link_'>
                            Privacy Policy
                        </Link>
                        &nbsp;of Helmerts.
                    </p>
                </div>
                <div className='app-helmerts-internal-update-content'>
                    <div className='app-helmerts-internal-update-content-attribute'>
                        <div className='app-helmerts-internal-update-content-attribute-left'>
                            <div className='app-helmerts-internal-update-content-attribute-left-login_information'>
                                <div className='app-helmerts-internal-update-content-attribute-left-login_information-title'>
                                    <h1>
                                        LOGIN INFORMATION
                                    </h1>
                                    <p>
                                        * Required information
                                    </p>
                                </div>
                                <div className='app-helmerts-internal-update-content-attribute-left-login_information-content'>
                                    <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-email'>
                                        <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-email-input'>

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
                                    </div>
                                    <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-password'>
                                        <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-password-input'>
                                            <TextField
                                                required
                                                id="outlined-password-input"
                                                label="New Password"
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
                                        <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-password-alert'>
                                            <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-password-alert-title'>
                                                <p>
                                                    For your security, we invite you to fill your password according to the following criteria:
                                                </p>
                                            </div>
                                            <div className='app-helmerts-internal-update-content-attribute-left-login_information-content-password-alert-list'>
                                                <p>
                                                    At least 10 characters
                                                </p>
                                                <p>
                                                    At least 1 uppercase letter
                                                </p>
                                                <p>
                                                    At least 1 lowercase letter
                                                </p>
                                                <p>
                                                    At least 1 number
                                                </p>
                                                <p>
                                                    At least 1 special character
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='app-helmerts-internal-update-content-attribute-left-personal_information'>
                                <div className='app-helmerts-internal-update-content-attribute-left-personal_information-title'>
                                    <h1>
                                        PERSONAL INFORMATION
                                    </h1>
                                </div>
                                <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content'>
                                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                                        <Autocomplete
                                            {...defaultProps}
                                            id="disable-clearable"
                                            disableClearable
                                            value={{ name: valueTitle }}
                                            onChange={(event, newValue) => {
                                                setValueTitle(newValue ? newValue.name : User_Details.title);
                                            }}
                                            style={commonTextFieldStyle}
                                            InputLabelProps={{
                                                classes: commonInputLabelStyle,
                                            }}
                                            InputProps={{
                                                style: commonInputPropsStyle,
                                                classes: commonInputClasses,
                                            }}

                                            renderInput={(params) => (
                                                <TextField {...params}
                                                    required
                                                    label="Title"

                                                    variant="standard" />
                                            )}
                                        />
                                    </div>
                                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                                        <TextField
                                            required
                                            id="name"
                                            label="First name "
                                            variant="outlined"
                                            value={firstName}
                                            onChange={handleChangeFirstName}
                                            type='text'
                                            // autoComplete="current-name"
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
                                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>

                                        <TextField
                                            required
                                            id="name"
                                            label="Last name "
                                            variant="outlined"
                                            value={lastName}
                                            onChange={handleChangeLastName}
                                            type='text'
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
                                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                                        <Button component="label"
                                            variant="contained"

                                            style={{
                                                backgroundColor: 'var(--color-icon3)',
                                                color: 'var(--color-bg)',
                                                fontSize: '14px',
                                                fontFamily: 'var(--font-family)',
                                                fontWeight: '400',
                                                textTransform: 'capitalize'
                                            }}
                                            startIcon={<CloudUploadIcon />}>
                                            Choose image profile *
                                            <VisuallyHiddenInput
                                                type="file"
                                                onChange={handleFileChange}
                                            //  accept='image/*'
                                            />
                                        </Button>
                                        {fileURL && (
                                            <img src={fileURL} className='imge-style-update' alt="no image" />
                                        )

                                        }

                                    </div>
                                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                                        <PhoneInput
                                            className="phone_style"
                                            value={phoneNumber}
                                            onChange={(newValue) => setphoneNumber(newValue)}
                                            inputStyle={{
                                                width: '100%', // Thiết lập chiều dài của phần nhập số điện thoại là 100%
                                                backgroundColor: 'var(--color-bg)', // Thiết lập màu nền là yellow
                                                color: 'var(--color-p)'
                                            }}
                                            inputProps={{
                                                name: 'phone',
                                                required: true,
                                                autoFocus: true,

                                            }}
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
                                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                components={['DatePicker', 'DatePicker']}>
                                                <DatePicker
                                                    label="Date of birth"
                                                    value={valueDate}
                                                    onChange={(newValue) => setValueDate(newValue)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>
                                    {/* <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                    </div>
                    <div className='app-helmerts-internal-update-content-attribute-left-personal_information-content-item'>
                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className='app-helmerts-internal-update-content-attribute-right-billing_information'>
                            <div className='app-helmerts-internal-update-content-attribute-right-billing_information-title'>
                                <h1>
                                    BILLING INFORMATION
                                </h1>
                            </div>
                            <div className='app-helmerts-internal-update-content-attribute-right-billing_information-content'>
                                <div className='app-helmerts-internal-update-content-attribute-right-billing_information-content-item'>
                                    <Autocomplete
                                        {...defaultPropsCountry}
                                        id="disable-clearable"
                                        disableClearable
                                        value={{ country: valueCountry }}
                                        onChange={(event, newValue) => {
                                            setValueCountry(newValue ? newValue.country : User_Details.country);
                                        }}
                                        style={commonTextFieldStyle}
                                        InputLabelProps={{
                                            classes: commonInputLabelStyle,
                                        }}
                                        InputProps={{
                                            style: commonInputPropsStyle,
                                            classes: commonInputClasses,
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} required label="Location" variant="standard" />
                                        )}
                                    />
                                </div>

                                <div className='app-helmerts-internal-update-content-attribute-right-billing_information-content-item'>
                                    <TextField
                                        required
                                        id="city"
                                        label="City"
                                        variant="outlined"
                                        value={valueCity}
                                        onChange={handleChangeCity}
                                        type='text'
                                        // autoComplete="current-name"
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
                                <div className='app-helmerts-internal-update-content-attribute-right-billing_information-content-item'>
                                    <TextField
                                        required
                                        id="district"
                                        label="District"
                                        variant="outlined"
                                        value={valueDistrict}
                                        onChange={handleChangeDistrict}
                                        type='text'
                                        // autoComplete="current-name"
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
                                <div className='app-helmerts-internal-update-content-attribute-right-billing_information-content-item'>
                                    <TextField
                                        required
                                        id="address"
                                        label="Address"
                                        variant="outlined"
                                        value={valueAddressDetails}
                                        onChange={handleChangeAddress}
                                        type='text'
                                        // autoComplete="current-name"
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
                                {/* <div className='app-helmerts-internal-update-content-attribute-right-billing_information-content-item'>
                  </div> */}
                            </div>
                        </div>
                    </div>
                    <div className='app-helmerts-internal-update-content-confirm'>
                        <div className='line_' />
                        <div className='app-helmerts-internal-update-content-confirm-content'>
                            <div className='app-helmerts-internal-update-content-confirm-content-svg'>
                                <FormControlLabel control={<Checkbox />} />
                            </div>
                            <div className='app-helmerts-internal-update-content-confirm-content-p'>
                                <p>
                                    I guarantee compliance with
                                    the&nbsp;<Link to='/information' className='link_'>Privacy Policy</Link>
                                    &nbsp; of Helmerts
                                </p>
                            </div>
                        </div>
                        {pleaseWait &&
                            <div className='app-helmerts-internal-update-content-wait'>
                                <p>
                                    {pleaseWait}
                                </p>
                            </div>
                        }
                        {errorEmail &&
                            <div className='app-helmerts-internal-update-content-error'>
                                <p>
                                    {errorEmail}
                                </p>
                            </div>
                        }
                        {registerSuccess &&
                            <div className='app-helmerts-internal-update-content-success'>
                                <p>
                                    {registerSuccess}
                                </p>
                            </div>
                        }
                        <div className='app-helmerts-internal-update-content-confirm-button'>
                            <button
                                className='btn-transition'
                                onClick={saveUser}
                            >Confirm Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
const top6OptionLocation = [
    {
        country: "中国内地"
    },
    {
        country: "Cambodia"
    },
    {
        country: "Indonesia"
    },
    {
        country: "Lao People's Democratic Republic"
    },
    {
        country: "Thailand"
    },
    {
        country: "Viet Nam"
    },
];
const top7OptionTitle = [
    {
        name: "Miss."
    },
    {
        name: "Mr."
    },
    {
        name: "Mrs."
    },
    {
        name: "Ms."
    },
    {
        name: "Dr."
    },
    {
        name: "Pr."
    },
    {
        name: "Hon."
    },
];
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
export default UpdatePersonalInformation