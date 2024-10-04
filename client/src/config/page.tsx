"use client";
import CarrouselForm from "../carousel-form/CarouselForm.tsx";
import BackButton from "../carousel-form/BackButton.tsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { User, Carousel } from '../interfaces.tsx';

interface ConfigProps {
    carousels?: Carousel[]; 
    user: User | null; 
    setUser: (user: User | null) => void; // Add type for setUser
}

const generateUniqueId = () => {
    const timestamp = Date.now(); // Get the current timestamp
    const randomNum = Math.floor(Math.random() * 10000); // Generate a random number
    return `carousel-${timestamp}-${randomNum}`; // Combine them into a unique ID
};

const Config: React.FC<ConfigProps> = ({ carousels = [], user, setUser }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [carrouselData, setCarrouselData] = useState<Carousel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const updateUser = async () => {
        if (!user || !user.id) return; // Ensure we have a user ID
    
        try {
            const response = await fetch(`http://localhost:3000/getUser/${user.id}`, {
                method: 'GET',
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch updated user data');
            }
    
            const updatedUserData = await response.json();
            console.log(JSON.stringify(updatedUserData));
            setUser(updatedUserData.user); 
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchCarrousel = async () => {
            if (id && id !== 'new') {
                // Find the carousel by ID
                const foundCarousel = carousels.find(carousel => carousel.id === id);
                if (foundCarousel) {
                    setCarrouselData(foundCarousel);
                } else {
                    setError("Carousel not found");
                }
            }
            setLoading(false);
        };
        
        fetchCarrousel();
    }, [id, carousels]); 

    const handleSave = async (data: Carousel) => {
        const userId = user?.id; // Ensure you have the user ID available
        const isNewCarousel = !id || id === 'new'; // Check if it's a new carousel
    
        const url = isNewCarousel ? 'http://localhost:3000/NewCarousel' : 'http://localhost:3000/updateCarousel';
        const payload = {
            userId: userId,
            ...(isNewCarousel
                ? { carouselData: { ...data, id: generateUniqueId() } } // For new carousel, generate a unique ID
                : { carouselId: id, updatedCarouselData: data } // For existing carousel, use the existing ID
            ),
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error('Failed to save carousel');
            }
    
            const result = await response.json();
            console.log(result.message); 

            await updateUser();
            navigate('/home'); 
        } catch (err) {
            setError(err.message); 
        }
    };
    

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex justify-center items-center text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <BackButton />
            <CarrouselForm 
                initialData={carrouselData || undefined}
                onSubmit={handleSave} 
            />
        </div>
    );
};

export default Config;
