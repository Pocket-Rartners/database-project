// CarouselName.tsx
import React from 'react';

interface CarouselNameProps {
    title: string;
    setTitle: (name: string) => void;
}

const CarouselName: React.FC<CarouselNameProps> = ({ title, setTitle }) => {
    return (
        <div className="space-y-2 p-4 bg-blue-100 rounded transition-transform duration-300">
            <label className="block text-gray-700 font-medium">Carousel Name</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter carousel name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
        </div>
    );
};

export default CarouselName;
