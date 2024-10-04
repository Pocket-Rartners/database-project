// components/BackButton.js
import React from 'react';
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

const BackButton = () => {
    return (
        <Link to="/home" className="absolute top-4 left-4">
        <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Back</span>
        </button>
    </Link>
    );
};

export default BackButton;
