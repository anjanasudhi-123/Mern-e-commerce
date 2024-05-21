import { useState, useEffect } from "react";
import axios from 'axios';

export const useFetchLike = (userEmail) => {
    const [like, setLike] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLike = async () => {
            try {
                const response = await axios.post("http://localhost:4400/api/user/likedata", { email: userEmail });
                setLike(response.data.like);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchLike();

        // No cleanup is needed here

    }, [userEmail,setLike]);

    return { like, loading, error };
};
