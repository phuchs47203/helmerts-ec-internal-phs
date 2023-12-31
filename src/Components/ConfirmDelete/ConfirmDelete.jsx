import React, { useEffect, useState } from 'react'
import './ConfirmDelete.css'
import TextField from '@mui/material/TextField';
import 'react-phone-input-2/lib/style.css'
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
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
const ConfirmDelete = ({ localToken, linkURLReqeust, settoggleDelete }) => {
    const [valueShipper, setvalueShipper] = useState(null);

    const handleClickDiscard = () => {
        settoggleDelete(false);
    }
    const [pleaseWait, setpleaseWait] = useState('');

    const ConfirmRequestByManger = () => {
        const fetchData = async () => {
            try {
                const updateResponse = axios.delete(linkURLReqeust, null, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localToken.token}`
                    }
                });
                console.log(updateResponse.data);
                setpleaseWait('Please Wait');
                setTimeout(() => {
                    window.location.reload();
                    setpleaseWait('');
                    settoggleDelete(false);
                }, 1200);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();

    }
    const handleClickConfirm = () => {
        ConfirmRequestByManger();
    }

    return (
        <div className='app-helmerts-confirm_order'>
            <div className='app-helmerts-confirm_order-box'>
                <div className='app-helmerts-confirm_order-heading'>
                    <h1>Do you want to delete?</h1>
                </div>
                <div className='app-helmerts-confirm_order-content'>
                    {pleaseWait &&
                        <div className='app-helmerts-confirm_order-content-wait'>
                            <p>{pleaseWait}</p>
                        </div>
                    }

                    <div className='app-helmerts-confirm_order-content-btn'>
                        <button className='button_default btn-transition'
                            onClick={handleClickDiscard}>
                            Discard
                        </button>
                        <button className='button_confirm btn-transition'
                            onClick={handleClickConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete