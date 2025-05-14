import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import HeroSection from '../components/HeroSection';
import SkeletonBlogCard from '../components/SkeletonBlogCard';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Blog } from '../types/blog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(API_BASE_URL);

interface CategorySection {
    id: string;
    title: string;
    subtitle: string;
    blogs: Blog[];
}

const Home: React.FC = () => {
    const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
    const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
    const [popularBlogs, setPopularBlogs] = useState<Blog[]>([]);
    const [sections, setSections] = useState<CategorySection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        
        window.addEventListener('resize', checkIfMobile);
        
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleUpdatedBlog = (updatedBlog: Blog) => {
        setFeaturedBlogs(prev => prev.map(blog => 
            blog._id === updatedBlog._id ? updatedBlog : blog
          ));

        setLatestBlogs(prev => prev.map(blog => 
            blog._id === updatedBlog._id ? updatedBlog : blog
        ));
        
        setPopularBlogs(prev => prev.map(blog => 
            blog._id === updatedBlog._id ? updatedBlog : blog
        ));
    };

    console.log(featuredBlogs);

    useEffect(() => {
        axios.get<Blog[]>(`${API_BASE_URL}/blog`)
            .then((response) => {
                const allBlogs = response.data;
                setFeaturedBlogs(allBlogs);
                
                const techBlogs = allBlogs.filter(blog => blog.category === 'tech');
                const lifestyleBlogs = allBlogs.filter(blog => blog.category === 'lifestyle');
                const educationBlogs = allBlogs.filter(blog => blog.category === 'education');
                const healthBlogs = allBlogs.filter(blog => blog.category === 'health');
                
                const categorySections = [
                    {
                        id: 'tech',
                        title: 'Technology',
                        subtitle: 'Latest news and insights from the tech world',
                        blogs: techBlogs.slice(0, 8)
                    },
                    {
                        id: 'lifestyle',
                        title: 'Lifestyle',
                        subtitle: 'Tips and trends for modern living',
                        blogs: lifestyleBlogs.slice(0, 8)
                    },
                    {
                        id: 'education',
                        title: 'Education',
                        subtitle: 'Learning resources and educational content',
                        blogs: educationBlogs.slice(0, 8)
                    },
                    {
                        id: 'health',
                        title: 'Health & Wellness',
                        subtitle: 'Stay healthy with our expert advice',
                        blogs: healthBlogs.slice(0, 8)
                    }
                ].filter(section => section.blogs.length > 0);
                
                setSections(categorySections);
                
                const sortedByDate = [...allBlogs].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setLatestBlogs(sortedByDate.slice(0, 8));
                
                const sortedByLikes = [...allBlogs].sort((a, b) => b.likes.length - a.likes.length);
                setPopularBlogs(sortedByLikes.slice(0, 8));
                
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching blogs: ", error);
                setError("Failed to load blogs");
                setLoading(false);
            });
    }, []);

    const renderSkeletonSection = () => {
        return (
            <div className="mb-8 sm:mb-12">
                <div className="animate-pulse mb-4 sm:mb-6">
                    <div className="h-6 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded w-36 sm:w-48 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64"></div>
                </div>
                {isMobile ? (
                    <div className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="w-[280px] flex-shrink-0">
                                <SkeletonBlogCard />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <SkeletonBlogCard key={index} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderSkeletonLoaders = () => {
        return (
            <div className="space-y-10 sm:space-y-16">
                {[...Array(3)].map((_, index) => (
                    <div key={index}>{renderSkeletonSection()}</div>
                ))}
            </div>
        );
    };

    const getSwiperBreakpoints = () => {
        return {
            320: {
                slidesPerView: 1.2,
                spaceBetween: 15
            },
            480: {
                slidesPerView: 1.5,
                spaceBetween: 15
            },
            640: {
                slidesPerView: 2.2,
                spaceBetween: 20
            }
        };
    };

    const renderSectionContent = (sectionBlogs: Blog[]) => {
        if (isMobile) {
            return (
                <div className="neumorphic-swiper-container mb-4 px-4">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                        breakpoints={getSwiperBreakpoints()}
                    >
                        {sectionBlogs.map((blog) => (
                            <SwiperSlide key={blog._id}>
                                <BlogCard blog={blog} onLike={handleUpdatedBlog} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            );
        }
        
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {sectionBlogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} onLike={handleUpdatedBlog} />
                ))}
            </div>
        );
    };

    const renderSection = (section: CategorySection) => {
        if (section.blogs.length === 0) return null;
        
        return (
            <section key={section.id} className="mb-10 sm:mb-16 px-0 sm:px-0">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 px-4">
                    <div className="mb-3 sm:mb-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            {section.title}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            {section.subtitle}
                        </p>
                    </div>
                    <Link 
                        to={`/blogs?category=${section.id}`}
                        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
                            shadow-neumorphic dark:shadow-dark-neumorphic
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            transition-shadow duration-300
                            bg-gray-100 dark:bg-gray-800 
                            text-gray-600 dark:text-gray-300
                            text-sm sm:text-base"
                    >
                        View All <FaArrowRight className="text-xs sm:text-sm" />
                    </Link>
                </div>
                {renderSectionContent(section.blogs)}
            </section>
        );
    };

    return (
        <div className="min-h-screen max-w-screen-xl mx-auto px-0 sm:px-4 overflow-hidden">
            <HeroSection />

            {loading ? (
                renderSkeletonLoaders()
            ) : (
                <div className="mt-8 sm:mt-12">
                    <section className="mb-10 sm:mb-16 px-0 sm:px-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 px-4">
                            <div className="mb-3 sm:mb-0">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                    Latest Articles
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    Stay updated with our most recent content
                                </p>
                            </div>
                            <Link 
                                to="/blogs?sort=newest"
                                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
                                    shadow-neumorphic dark:shadow-dark-neumorphic
                                    hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                    transition-shadow duration-300
                                    bg-gray-100 dark:bg-gray-800 
                                    text-gray-600 dark:text-gray-300
                                    text-sm sm:text-base"
                            >
                                View All <FaArrowRight className="text-xs sm:text-sm" />
                            </Link>
                        </div>
                        {renderSectionContent(latestBlogs)}
                    </section>

                    <section className="mb-10 sm:mb-16 px-0 sm:px-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 px-4">
                            <div className="mb-3 sm:mb-0">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                    Popular Articles
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    Our most liked and discussed content
                                </p>
                            </div>
                            <Link 
                                to="/blogs?sort=popular"
                                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
                                    shadow-neumorphic dark:shadow-dark-neumorphic
                                    hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                    transition-shadow duration-300
                                    bg-gray-100 dark:bg-gray-800 
                                    text-gray-600 dark:text-gray-300
                                    text-sm sm:text-base"
                            >
                                View All <FaArrowRight className="text-xs sm:text-sm" />
                            </Link>
                        </div>
                        {renderSectionContent(popularBlogs)}
                    </section>

                    {/* Category Sections */}
                    {sections.map(section => renderSection(section))}
                </div>
            )}
        </div>
    );
};

export default Home;
