export interface Blog {
    _id: string;
    title: string;
    content: string;
    image?: string;
    category: string;
    slug: string;
    author: {
        _id: string;
        name: string;
    };
    likes: string[];
    comments: string[];
    createdAt: string;
    updatedAt: string;
    status: string;
} 