import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchCart = (userEmail) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.post("http://localhost:4400/api/user/cartdata", { email: userEmail });
                setCart(response.data.cart);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchCart();

        // Clean up function to abort the fetch if the component unmounts
        return () => {
            // Abort the fetch or perform any cleanup here if needed
        };
    }, [userEmail,setCart]);

    return { cart, loading, error };
};
