import React, { useEffect, useState } from 'react'
import './ManageOrder.css'
import axios from 'axios';
import { Order } from '../../Components';

const ManageOrder = () => {
    const [localToken, setlocalToken] = useState(null);
    const [topOptionShipper, settopOptionShipper] = useState([]);
    const [isLoadedData, setisLoadedData] = useState(false);
    const [waiting, setwaiting] = useState(false);

    const isTokenValid = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
            const parsedAccessToken = JSON.parse(storedAccessToken);
            const expirationTime = new Date(parsedAccessToken.expiration_time);
            setlocalToken(parsedAccessToken);
            console.log("Minutes: ", (expirationTime.getTime() - Date.now()) / 60000);
            return Date.now() < expirationTime.getTime();
        }
        return false;
    }
    const [PermitUsers, setPermitUsers] = useState(false);
    useEffect(() => {
        const isLoggedIn = isTokenValid();
        if (isLoggedIn) {
            setPermitUsers(true);
        }
        else {
            setPermitUsers(false);
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                getData();

                // await new Promise(resolve => setTimeout(resolve, 5000));
                const URL_REQUEST_SHIPPER = "http://localhost:8000/api/users-shipper";

                const ShipperResponse = await axios.get(URL_REQUEST_SHIPPER, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localToken.token}`
                    }
                });
                settopOptionShipper(ShipperResponse.data);
                setwaiting(true);
                await new Promise(resolve => setTimeout(resolve, 4000));
                setwaiting(false);
                setisLoadedData(true);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [localToken]);

    const URL_REQUEST_ORDER_UDER = "http://localhost:8000/api/orders";
    const [valueOrders, setvalueOrders] = useState([]);
    const getData = () => {

        const fetchData = async () => {
            try {
                const response = await axios.get(URL_REQUEST_ORDER_UDER, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localToken.token}`
                    }
                });
                setvalueOrders(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(URL_REQUEST_ORDER_UDER, {
    //                 headers: {
    //                     Accept: "application/json",
    //                     Authorization: `Bearer ${localToken.token}`
    //                 }
    //             });
    //             setvalueOrders(response.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    const [valueOrderFilter, setvalueOrderFilter] = useState([]);
    const setvalueFilterFunction = (value) => {
        valueOrderFilter.splice(0, valueOrderFilter.length);
        if (value === "All") {
            setisFilter(false);
            return;
        }
        const filteredOrders = valueOrders.filter(element => element.status === value);

        setvalueOrderFilter(filteredOrders);
        setisFilter(true);
    }
    const [isFilter, setisFilter] = useState(false);
    return (
        <div className='app-helmerts-list_order'>
            <div className='app-helmerts-list_order-filter'>
                <div className='app-helmerts-list_order-filter-item'>
                    <button
                        onClick={() => setvalueFilterFunction("All")}
                    >All</button>
                </div>
                <div className='app-helmerts-list_order-filter-item'>
                    <button
                        onClick={() => setvalueFilterFunction("Pending")}
                    >Pending</button>
                </div>
                <div className='app-helmerts-list_order-filter-item'>
                    <button
                        onClick={() => setvalueFilterFunction("Shipped")}
                    >Shipped</button>
                </div>
                <div className='app-helmerts-list_order-filter-item'>
                    <button
                        onClick={() => setvalueFilterFunction("Completed")}
                    >Completed</button>
                </div>
            </div>
            <div className='app-helmerts-list_order-content'>
                {!isFilter &&
                    <div className='app-helmerts-list_order-content-item'>
                        {isLoadedData && valueOrders.map((item, index) => (
                            <Order OrderInfor={item} localToken={localToken} topOptionShipper={topOptionShipper} key={item.id} />
                        ))
                        }
                    </div>

                }
                {waiting &&
                    <div className='app-helmerts-home-main-box-waiting'>
                        <p className='color-change'>
                            Please wait a few seconds
                        </p>
                    </div>
                }
                {isFilter &&
                    <div className='app-helmerts-list_order-content-item'>
                        {valueOrderFilter.map((item, index) => (
                            <Order OrderInfor={item} topOptionShipper={topOptionShipper} localToken={localToken} key={item.id} />
                        ))
                        }
                    </div>
                }
            </div>

        </div>
    )
}

export default ManageOrder