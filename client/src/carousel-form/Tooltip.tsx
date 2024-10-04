import React, { ReactNode, useState, useEffect, useRef } from 'react';

interface TooltipProps {
    content: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({
                                             content,
                                             placement = 'bottom',
                                             className = '',
                                             children
                                         }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const targetRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = targetRef.current;
        const tooltip = tooltipRef.current;

        if (target && tooltip) {
            const targetRect = target.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let x, y;
            switch (placement) {
                case 'top':
                    x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
                    y = targetRect.top - tooltipRect.height - 8;
                    break;
                case 'bottom':
                    x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
                    y = targetRect.bottom + 8;
                    break;
                case 'left':
                    x = targetRect.left - tooltipRect.width - 8;
                    y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
                    break;
                case 'right':
                    x = targetRect.right + 8;
                    y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
                    break;
            }

            setPosition({ x, y });
        }
    }, [isVisible, placement]);

    return (
        <div ref={targetRef} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`fixed z-50 bg-gray-800 text-white px-2 py-1 rounded-md text-sm ${className}`}
                    style={{ left: position.x, top: position.y }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;