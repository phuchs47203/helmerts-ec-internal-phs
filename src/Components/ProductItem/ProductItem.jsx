import React, { useState, useEffect } from 'react'
import './ProductItem.css'
import UpdateProduct from '../UpdateProduct/UpdateProduct';
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const ProductItem = ({ Product }) => {
    const [toggleUpdate, settoggleUpdate] = useState(false);
    const handleUpdate = () => {
        settoggleUpdate(true);
    }
    return (
        <div className='app-helmerts-internal-product_item-box scale-in'>
            {
                <div className='app-helmerts-internal-product_item'>
                    <div className='app-helmerts-internal-product_item-content'>
                        <div className='app-helmerts-internal-product_item-content-img'>
                            <img src={Product.imgurl} alt="not support image" />
                        </div>
                        <div className='app-helmerts-internal-product_item-content-information'>
                            <h3>{Product.name}</h3>
                            <p>Sale: {Product.sale_price}</p>
                            <p>Available: {Product.available}</p>
                            <p>Sold: {Product.sold}</p>
                        </div>
                    </div>
                    <div className='app-helmerts-internal-product_item-button'>
                        <button className='btn-transition button_update' onClick={() => settoggleUpdate(true)}>Update</button>
                        <button className='btn-transition button_delete'>Delete</button>
                    </div>
                </div>
            }
            {toggleUpdate &&
                <div className='app-helmerts-internal-product_item-update fall-in-down'>
                    <div className='app-helmerts-internal-product_item-update-back'
                    >
                        <div
                            onClick={() => settoggleUpdate(false)}
                            className='app-helmerts-internal-product_item-update-back-button'>
                            <HiOutlineArrowNarrowLeft className='svg_back' />
                            <p className='back_'>Back</p>
                        </div>
                    </div>
                    <div className='app-helmerts-internal-product_item-update-content'>
                        <UpdateProduct Product={Product} />
                    </div>
                </div>
            }
        </div>
    )
}

export default ProductItem