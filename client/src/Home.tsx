import React, { useEffect, useState } from 'react';
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { User, Carousel } from './interfaces'; 
import { Link } from "react-router-dom";

interface HomeProps {
    user: User | null;
    handleLogout: () => void;
}

function Home({ user, handleLogout }: HomeProps) {
    const [carousels, setCarousels] = useState<Carousel[]>([]);
    const navigate = useNavigate();

    // Update carousels state when user changes
    useEffect(() => {
        if (user) {
            setCarousels(user.carousels || []); // Set carousels to user?.carousels
        } else {
            setCarousels([]); // Reset to empty if no user
        }
    }, [user]); // Dependency on user

    const handleEdit = (id: string) => {
        navigate(`/config/${id}`);
    };

    const handleDelete = async (carouselId: string) => {
        if (!user || !user.id) return; // Ensure we have the user ID
    
        try {
            const response = await fetch('http://localhost:3000/deleteCarousel', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    carouselId: carouselId,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete carousel');
            }
    
            // Remove the deleted carousel from the state
            setCarousels(carousels.filter(carousel => carousel.id !== carouselId));
        } catch (error) {
            console.error('Error deleting carousel:', error);
            // You can also set an error state here to display an error message to the user
        }
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-700">Your Carousels</h1>
                        <Link to="/config/new">
                            <button
                                className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Create New
                            </button>
                        </Link>
                    </div>

                    {/* Carousel List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {carousels.length > 0 ? (
                            carousels.map((carousel) => (
                                <div
                                    key={carousel.id}
                                    className="bg-white p-4 shadow rounded-lg flex flex-col justify-between"
                                >
                                
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{carousel.title}</h2>
                                        <p className="text-gray-400 text-sm">Created: {new Date(carousel.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <Link to={`/config/${carousel.id}`} className="text-blue-500 hover:text-blue-700 focus:outline-none">
                                            <button
                                                onClick={() => handleEdit(carousel.id)}
                                                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(carousel.id)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-center">No carousels found. Create a new one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
