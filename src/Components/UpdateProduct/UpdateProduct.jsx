import React, { useState, useEffect } from 'react'
import './UpdateProduct.css'
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
import { Description } from '@mui/icons-material';
import SizeItem from '../SizeItem/SizeItem';

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

const UpdateProduct = ({ Product }) => {
    const URL_REQUEST = "http://localhost:8000/api/products/update/" + Product.id;
    const defaultProps = {
        options: top7OptionCategory,
        getOptionLabel: (option) => option.name,
    };
    const flatProps = {
        options: top7OptionCategory.map((option) => option.name),
    };
    const defaultPropsDiscount = {
        options: top80OptionDiscount,
        getOptionLabel: (option) => option.value.toString(),
    };
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = React.useState(null);

    //general information
    const [productName, setproductName] = useState(Product.name);
    const [productBrand, setproductBrand] = useState(Product.brand);
    const [DesignBy, setDesignBy] = useState('Phuc Handsome');


    // detailed information
    const [productDescription, setproductDescription] = useState(Product.description);
    const [productColor, setproductColor] = useState(Product.color);
    const [productCategory, setproductCategory] = useState(null);
    const [fileURL, setfileURL] = useState(Product.imgurl);

    //sale information
    const [origionalPrice, setorigionalPrice] = useState(Product.origional_price);
    const [productDiscount, setproductDiscount] = useState(null);
    const [available, setavailable] = useState(Product.available);
    const [sold, setsold] = useState(Product.sold);

    const [cattegoryName, setcattegoryName] = useState("");

    const [imgChange, setimgChange] = useState(false);
    const [listSize, setlistSize] = useState([]);
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        setSelectedFile(file);
        if (file) {
            // console.log("has file");

            reader.readAsDataURL(file);
            reader.onload = () => {
                setfileURL(reader.result);
                setimgChange(true);
                // console.log(selectedFile);
            }
        }
    }



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
        top7OptionCategory.forEach(element => {
            if (element.cat_id === Product.cat_id) {
                setcattegoryName(element.name);
            }
        });
        if (isLoggedIn) {

            setPermitUsers(true);
        }
        else {
            setPermitUsers(false);
        }
    }, []);
    const CommitSizeChange = () => {
        window.location.reload();
    }
    const updateProduct = () => {
        // return;


        // console.log("GENERAL information");
        // console.log(productName);
        // console.log(productBrand);
        // console.log(DesignBy);

        // console.log("DETAIL information");



        // console.log(productDescription);
        // console.log(productColor);

        // console.log("SALE information");

        // console.log(origionalPrice);


        // console.log(available);
        // console.log(sold);

        // console.log((1 - productDiscount.value) * origionalPrice);
        // console.log("id:", userInfor.id);
        console.log(URL_REQUEST);
        const formData = new FormData();
        setpleaseWait('Please Wait ...!');
        seterrorEmail('');
        setregisterSuccess('');

        formData.append('name', productName);
        formData.append('brand', productBrand);
        formData.append('description', productDescription);
        formData.append('color', productColor);
        formData.append('origional_price', origionalPrice);

        if (productDiscount != null) {
            formData.append('sale_price', (1 - productDiscount.value) * origionalPrice);
            formData.append('discount', productDiscount.value);
        }
        formData.append('available', available);
        formData.append('sold', sold);
        if (productCategory != null) {
            formData.append('cat_id', productCategory.cat_id);
        }
        if (imgChange) {
            formData.append('imgurl', selectedFile);
        }

        formData.append('update_by', userInfor.id);


        axios
            .post(URL_REQUEST, formData,
                {
                    headers: { Accept: "application/json" },
                })
            .then((response) => {
                console.log(response.data);

                setregisterSuccess('Update Product Successfully!');

                setpleaseWait('');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                seterrorEmail('The Fields Can Be Not Empty!');

            });
    };
    useEffect(() => {
        seterrorEmail('');
        setpleaseWait('');

    }, [registerSuccess]);
    useEffect(() => {
        setpleaseWait('');
    }, [errorEmail]);
    const URL_REQUEST_USER = "http://localhost:8000/api/product-list-size/" + Product.id;
    useEffect(() => {
        try {
            axios.get(URL_REQUEST_USER, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    // console.log(response.data);
                    setlistSize(response.data);
                })
                .catch(error => {
                    console.log(error);
                });

        } catch (err) {
            console.log(err);
        }

    }, []);
    return (
        <div id='create-product' className='app-helmerts-update_protuct-box'>
            <div className='app-helmerts-update_protuct'>
                <div className='app-helmerts-update_protuct-heading'>
                    <h1>Update product</h1>
                    <p>
                        By updating an product, you agree to accept the&nbsp;
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
                <div className='app-helmerts-update_protuct-content'>
                    <div className='app-helmerts-update_protuct-content-attribute'>
                        <div className='app-helmerts-update_protuct-content-attribute-left'>
                            <div className='app-helmerts-update_protuct-content-attribute-left-general_information'>
                                <div className='app-helmerts-update_protuct-content-attribute-left-general_information-title'>
                                    <h1>
                                        General INFORMATION
                                    </h1>
                                    <p>
                                        * Required information
                                    </p>
                                </div>
                                <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content'>
                                    <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content-email'>
                                        <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content-email-input'>

                                            <TextField
                                                required
                                                id="productname"
                                                label="Product Name"
                                                // variant="outlined"
                                                value={productName}
                                                onChange={(e) => setproductName(e.target.value)}
                                                type='text'
                                                autoComplete="on"
                                                style={commonTextFieldStyle}
                                                InputLabelProps={{
                                                    classes: commonInputLabelStyle,
                                                }}
                                                InputProps={{
                                                    style: commonInputPropsStyle,
                                                    classes: commonInputClasses,
                                                }} />

                                        </div>
                                    </div>
                                    <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content-password'>
                                        <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content-password-input'>
                                            <TextField
                                                required
                                                id="brand"
                                                label="Brand"
                                                // variant="outlined"
                                                value={productBrand}
                                                onChange={(e) => setproductBrand(e.target.value)}
                                                type='text'
                                                autoComplete="on"
                                                style={commonTextFieldStyle}
                                                InputLabelProps={{
                                                    classes: commonInputLabelStyle,
                                                }}
                                                InputProps={{
                                                    style: commonInputPropsStyle,
                                                    classes: commonInputClasses,
                                                }} />
                                        </div>

                                    </div>
                                    <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content-email'>
                                        <div className='app-helmerts-update_protuct-content-attribute-left-general_information-content-email-input'>

                                            <TextField
                                                required
                                                id="designer"
                                                label="Besign By"
                                                // variant="outlined"
                                                value={DesignBy}
                                                onChange={(e) => setDesignBy(e.target.value)}
                                                type='text'
                                                autoComplete="on"
                                                style={commonTextFieldStyle}
                                                InputLabelProps={{
                                                    classes: commonInputLabelStyle,
                                                }}
                                                InputProps={{
                                                    style: commonInputPropsStyle,
                                                    classes: commonInputClasses,
                                                }} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='app-helmerts-update_protuct-content-attribute-left-detail_information'>
                                <div className='app-helmerts-update_protuct-content-attribute-left-detail_information-title'>
                                    <h1>
                                        DETAILED INFORMATION
                                    </h1>
                                </div>
                                <div className='app-helmerts-update_protuct-content-attribute-left-detail_information-content'>
                                    <div className='app-helmerts-update_protuct-content-attribute-left-detail_information-content-item-2'>
                                        <p>{cattegoryName}</p>

                                        <Autocomplete
                                            {...defaultProps}
                                            id="disable-clearable"
                                            disableClearable
                                            value={productCategory}
                                            onChange={(event, newValue) => {
                                                setproductCategory(newValue);
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
                                                    label="New Category"

                                                    variant="standard" />
                                            )}
                                        />
                                    </div>
                                    <div className='app-helmerts-update_protuct-content-attribute-left-detail_information-content-item'>
                                        <TextField
                                            required
                                            id="brand"
                                            label="Description"
                                            // variant="outlined"
                                            value={productDescription}
                                            onChange={(e) => setproductDescription(e.target.value)}
                                            type='text'
                                            autoComplete="on"
                                            style={commonTextFieldStyle}
                                            InputLabelProps={{
                                                classes: commonInputLabelStyle,
                                            }}
                                            InputProps={{
                                                style: commonInputPropsStyle,
                                                classes: commonInputClasses,
                                            }} />

                                    </div>
                                    <div className='app-helmerts-update_protuct-content-attribute-left-detail_information-content-item'>

                                        <TextField
                                            required
                                            id="color"
                                            label="Color"
                                            variant="outlined"
                                            value={productColor}
                                            onChange={(e) => {
                                                setproductColor(e.target.value);
                                            }}
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
                                    <div className='app-helmerts-update_protuct-content-attribute-left-detail_information-content-item-img'>
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
                                            Choose image product *
                                            <VisuallyHiddenInput
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {fileURL && (
                                            <img src={fileURL} className='image-style' alt="no image" />
                                        )

                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='app-helmerts-update_protuct-content-attribute-right-sale_information'>
                            <div className='app-helmerts-update_protuct-content-attribute-right-sale_information-title'>
                                <h1>
                                    SALE INFORMATION
                                </h1>
                            </div>
                            <div className='app-helmerts-update_protuct-content-attribute-right-sale_information-content'>
                                <div className='app-helmerts-update_protuct-content-attribute-right-sale_information-content-item'>
                                    <TextField
                                        required
                                        id="price"
                                        label="Origional Price"
                                        variant="outlined"
                                        value={origionalPrice}
                                        onChange={(e) => {
                                            setorigionalPrice(e.target.value);
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
                                <div className='app-helmerts-update_protuct-content-attribute-right-sale_information-content-item-2'>
                                    <p>-{Math.round(Product.discount * 100)}%</p>
                                    <Autocomplete
                                        {...defaultPropsDiscount}
                                        id="disable-clearable"
                                        disableClearable
                                        value={productDiscount}
                                        onChange={(event, newValue) => {
                                            setproductDiscount(newValue);
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
                                            <TextField {...params} required label="New Discount" variant="standard" />
                                        )}
                                    />

                                </div>


                                <div className='app-helmerts-update_protuct-content-attribute-right-sale_information-content-item'>
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
                                <div className='app-helmerts-update_protuct-content-attribute-right-sale_information-content-item'>
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
                    </div>

                    <div className='app-helmerts-update_protuct-content-confirm'>
                        <div className='line_' />
                        <div className='app-helmerts-update_protuct-content-confirm-content'>
                            <div className='app-helmerts-update_protuct-content-confirm-content-svg'>
                                <FormControlLabel control={<Checkbox />} />
                            </div>
                            <div className='app-helmerts-update_protuct-content-confirm-content-p'>
                                <p>
                                    I agree to receive information by email about offers, services, products and events from Hermes or other group companies, in accordance with
                                    the&nbsp;<Link to='/information' className='link_'>Privacy Policy</Link>
                                    .
                                </p>
                            </div>
                        </div>
                        {pleaseWait &&
                            <div className='app-helmerts-update_protuct-content-wait'>
                                <p>
                                    {pleaseWait}
                                </p>
                            </div>
                        }
                        {errorEmail &&
                            <div className='app-helmerts-update_protuct-content-error'>
                                <p>
                                    {errorEmail}
                                </p>
                            </div>
                        }
                        {registerSuccess &&
                            <div className='app-helmerts-update_protuct-content-success'>
                                <p>
                                    {registerSuccess}
                                </p>
                            </div>
                        }
                        <div className='app-helmerts-update_protuct-content-confirm-button'>
                            <button
                                className='btn-transition button_default'
                                onClick={updateProduct}
                            >Update Product Changes</button>
                        </div>
                        <div className='app-helmerts-update_protuct-content-list_size'>
                            <div className='app-helmerts-update_protuct-content-list_size-title'>
                                <h1>List Size</h1>
                                <p>Edit Product Size Here or Update Amount of Product!</p>
                            </div>
                            <div className='app-helmerts-update_protuct-content-list_size-table'>
                                {listSize.map((item, index) => (
                                    <div className='app-helmerts-update_protuct-content-list_size-table-box'>
                                        <SizeItem Product_size={item} key={item.id} />
                                    </div>
                                ))
                                }
                            </div>
                            <div className='app-helmerts-update_protuct-content-list_size-commit'>
                                <button
                                    className='btn-transition button_default'
                                    onClick={CommitSizeChange}
                                >Commit All Size Changes</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
const top7OptionCategory = [
    {
        name: "Full Face",
        cat_id: 1
    },
    {
        name: "Half Face",
        cat_id: 2
    },
    {
        name: "Open Face",
        cat_id: 3
    },
    {
        name: "Modular",
        cat_id: 4
    },
    {
        name: "Bicycle Helmet",
        cat_id: 5
    },
    {
        name: "Children's Helmet",
        cat_id: 6
    },
    {
        name: "Accessory Helmet",
        cat_id: 7
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


const top80OptionDiscount = [
    { value: 0.00 }, { value: 0.01 }, { value: 0.02 }, { value: 0.03 }, { value: 0.04 }, { value: 0.05 }, { value: 0.06 },
    { value: 0.07 }, { value: 0.08 }, { value: 0.09 }, { value: 0.10 }, { value: 0.11 }, { value: 0.12 }, { value: 0.13 },
    { value: 0.14 }, { value: 0.15 }, { value: 0.16 }, { value: 0.17 }, { value: 0.18 }, { value: 0.19 }, { value: 0.20 },
    { value: 0.21 }, { value: 0.22 }, { value: 0.23 }, { value: 0.24 }, { value: 0.25 }, { value: 0.26 }, { value: 0.27 },
    { value: 0.28 }, { value: 0.29 }, { value: 0.30 }, { value: 0.31 }, { value: 0.32 }, { value: 0.33 }, { value: 0.34 },
    { value: 0.35 }, { value: 0.36 }, { value: 0.37 }, { value: 0.38 }, { value: 0.39 }, { value: 0.40 }, { value: 0.41 },
    { value: 0.42 }, { value: 0.43 }, { value: 0.44 }, { value: 0.45 }, { value: 0.46 }, { value: 0.47 }, { value: 0.48 },
    { value: 0.49 }, { value: 0.50 }, { value: 0.51 }, { value: 0.52 }, { value: 0.53 }, { value: 0.54 }, { value: 0.55 },
    { value: 0.56 }, { value: 0.57 }, { value: 0.58 }, { value: 0.59 }, { value: 0.60 }, { value: 0.61 }, { value: 0.62 },
    { value: 0.63 }, { value: 0.64 }, { value: 0.65 }, { value: 0.66 }, { value: 0.67 }, { value: 0.68 }, { value: 0.69 },
    { value: 0.70 }, { value: 0.71 }, { value: 0.72 }, { value: 0.73 }, { value: 0.74 }, { value: 0.75 }, { value: 0.76 },
    { value: 0.77 }, { value: 0.78 }, { value: 0.79 }, { value: 0.80 }, { value: 0.81 }, { value: 0.82 }, { value: 0.83 },
    { value: 0.84 }, { value: 0.85 }, { value: 0.86 }, { value: 0.87 }, { value: 0.88 }, { value: 0.89 }, { value: 0.90 },
];
export default UpdateProduct