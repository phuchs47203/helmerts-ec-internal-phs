import React, { useState } from 'react'
import './UserItem.css';
import UpdateUser from '../UpdateUser/UpdateUser';
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete';

const UserItem = ({ User, localToken }) => {
    const [toggleUpdate, settoggleUpdate] = useState(false);
    const handleUpdate = () => {
        settoggleUpdate(true);
    }
    const [toggleDelete, settoggleDelete] = useState(false);
    const URL_DELETE = "http://localhost:8000/api/users/" + User.id;

    return (
        <div className='app-helmerts-internal-user_item-box scale-in'>
            {
                <div className='app-helmerts-internal-user_item'>
                    <div className='app-helmerts-internal-user_item-content'>
                        <div className='app-helmerts-internal-user_item-content-img'>
                            <img src={User.imgurl} alt="not support image" />
                        </div>
                        <div className='app-helmerts-internal-user_item-content-information'>
                            <h3>{User.last_name}&nbsp;{User.first_name}</h3>
                            <p>{User.phone_number}</p>
                            <p>{User.email}</p>
                            <p>{User.country}</p>
                        </div>
                    </div>
                    <div className='app-helmerts-internal-user_item-button'>
                        <button className='btn-transition button_update' onClick={() => settoggleUpdate(true)}>Update</button>
                        <button className='btn-transition button_delete' onClick={() => settoggleDelete(true)}>Delete</button>
                    </div>
                </div>
            }
            {toggleDelete &&
                <ConfirmDelete settoggleDelete={settoggleDelete} localToken={localToken} linkURLReqeust={URL_DELETE} />
            }
            {toggleUpdate &&
                <div className='app-helmerts-internal-user_item-update fall-in-down'>
                    <div className='app-helmerts-internal-user_item-update-back'
                    >
                        <div
                            onClick={() => settoggleUpdate(false)}
                            className='app-helmerts-internal-user_item-update-back-button'>
                            <HiOutlineArrowNarrowLeft className='svg_back' />
                            <p className='back_'>Back</p>
                        </div>
                    </div>
                    <div className='app-helmerts-internal-user_item-update-content'>
                        <UpdateUser User_Details={User} localToken={localToken} />
                    </div>
                </div>
            }
        </div>
    )
}

export default UserItem