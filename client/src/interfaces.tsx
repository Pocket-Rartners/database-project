export interface Carousel {
    id: string;
    title: string;
    slides: Slide[];
    createdAt: Date;
    active: boolean
}

export interface User{
    id:string;
    userName: string;
    carousels: Carousel[];
    activeCarousel: Carousel | null;
}

export interface Slide {
    url: string;
    transitionType: string;
    transitionInterval: number;
    isCollapsed?: boolean;
}