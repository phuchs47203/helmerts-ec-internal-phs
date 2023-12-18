import React, { useEffect, useState } from 'react'
import './OrderDetail.css'
import { IoIosClose } from "react-icons/io";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { images } from '../../Constants';
import { useNavigate } from 'react-router-dom';

const OrderDetail = ({ orderDetails }) => {
    const [error, seterror] = useState('');
    const [quantityChange, setquantityChange] = useState(orderDetails.quantity);
    const navigate = useNavigate();
    const handleClickProduct = () => {
        // navigate('/product/' + orderDetails.product_id);
    }
    return (
        <div className='app-helmerts-order_detials'>
            <div
                onClick={handleClickProduct}
                className='app-helmerts-order_detials-box'>
                <div
                    className='app-helmerts-order_detials-left'>
                    <div className='app-helmerts-order_detials-left-main'>
                        <div className='app-helmerts-order_detials-left-main-img'
                        >
                            <img src={orderDetails.imgurl} alt="" />
                        </div>
                        <div className='app-helmerts-order_detials-left-main-content'>
                            <div className='app-helmerts-order_detials-left-main-content-name'>
                                <h1>
                                    {orderDetails.name}
                                </h1>
                            </div>
                            <div className='app-helmerts-order_detials-left-main-content-description'>
                                <div className='app-helmerts-order_detials-left-main-content-description-text'>
                                    <p>Color: {orderDetails.color}</p>
                                    <p>Size: {orderDetails.size_name}</p>
                                </div>
                                <div className='app-helmerts-order_detials-left-main-content-description-quantity'>
                                    <div className='app-helmerts-order_detials-left-main-content-description-quantity-box'>
                                        <h4>Quantity: </h4>
                                        <p>{quantityChange}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='app-helmerts-order_detials-right'>
                    <p>₫ {(orderDetails.sale_price).toLocaleString()}</p>
                </div>
            </div>
            {

            }
        </div>
    )
}

export default OrderDetail