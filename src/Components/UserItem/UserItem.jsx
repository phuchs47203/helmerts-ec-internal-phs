import React, { useState } from 'react'
import './UserItem.css';
import UpdateUser from '../UpdateUser/UpdateUser';
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const UserItem = ({ User }) => {
    const [toggleUpdate, settoggleUpdate] = useState(false);
    const handleUpdate = () => {
        settoggleUpdate(true);
    }
    return (
        <div className='app-helmerts-internal-user_item-box scale-in'>
            {
                <div className='app-helmerts-internal-user_item'>
                    <div className='app-helmerts-internal-user_item-content'>
                        <div className='app-helmerts-internal-user_item-content-img'>
                            <img src={User.imgurl} alt="not support image" />
                        </div>
                        <div className='app-helmerts-internal-user_item-content-information'>
                            <h3>{User.first_name}&nbsp;{User.last_name}</h3>
                            <p>{User.phone_number}</p>
                            <p>{User.email}</p>
                            <p>{User.country}</p>
                        </div>
                    </div>
                    <div className='app-helmerts-internal-user_item-button'>
                        <button className='btn-transition button_update' onClick={() => settoggleUpdate(true)}>Update</button>
                        <button className='btn-transition button_delete'>Delete</button>
                    </div>
                </div>
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
                        <UpdateUser User_Details={User} />
                    </div>
                </div>
            }
        </div>
    )
}

export default UserItem