import React, { useRef, useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline'; // Adjust import as needed
import { Slide } from '../interfaces.tsx';

interface SlideItemProps {
    index: number;
    slideData: Slide;
    isActive: boolean;
    onSlideClick: () => void;
    handleSlideChange: (index: number, field: 'url' | 'transitionType' | 'transitionInterval', value: string) => void;
    toggleCollapse: (index: number) => void;
    handleDeleteSlide: (index: number) => void;
}

const SlideItem: React.FC<SlideItemProps> = ({
                                                 index,
                                                 slideData,
                                                 isActive,
                                                 handleSlideChange,
                                                 toggleCollapse,
                                                 handleDeleteSlide,
                                             }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(slideData.isCollapsed ? 0 : contentRef.current.scrollHeight);
        }
    }, [slideData.isCollapsed]);

    useEffect(() => {
        if (isActive && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isActive]);

    return (
        <div
            ref={containerRef}
            className={`space-y-2 p-4 bg-blue-200 rounded relative transition-transform duration-300`}
        >
            <div className="flex justify-between items-center">
                <label className="block text-gray-700 font-medium">Slide {index + 1}</label>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleCollapse(index);
                        }}
                        className={`transform transition-transform ${
                            slideData.isCollapsed ? 'rotate-180' : 'rotate-0'
                        } text-gray-500 focus:outline-none hover:scale-110 hover:text-gray-700`}
                    >
                        {slideData.isCollapsed ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(index);
                        }}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <input
                type="text"
                value={slideData.url}
                onChange={(e) => handleSlideChange(index, 'url', e.target.value)}
                placeholder="Enter URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            <div
                className="slide-content"
                style={{ height: contentHeight }}
                ref={contentRef}
            >
                {!slideData.isCollapsed && (
                    <div className="flex justify-between space-x-2">
                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium">Transition Type</label>
                            <select
                                value={slideData.transitionType}
                                onChange={(e) => handleSlideChange(index, 'transitionType', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                            >
                                <option value="">Select transition</option>
                                <option value="Slide">Slide</option>
                                <option value="Fade">Fade</option>
                                <option value="Zoom">Zoom</option>
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium">Transition Interval</label>
                            <input
                                type="number"
                                value={slideData.transitionInterval}
                                onChange={(e) => handleSlideChange(index, 'transitionInterval', e.target.value)}
                                placeholder="ex: 1.0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlideItem;
