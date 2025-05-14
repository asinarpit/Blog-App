import dotenv from "dotenv"
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';

dotenv.config();


import connectDB from '../config/db.js';

const SAMPLE_IMAGE = "https://picsum.photos/1200/800"; 

const authors = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

const dummyBlogs = [
  {
    title: "The Future of Artificial Intelligence",
    content: "Exploring the latest advancements in AI technology...",
    author: authors[0],
    category: "tech",
    slug: "future-of-artificial-intelligence",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Morning Routine for Productivity",
    content: "Discover the best morning habits for peak performance...",
    author: authors[1],
    category: "lifestyle",
    slug: "morning-routine-productivity",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Modern Teaching Methods",
    content: "Innovative approaches to education in the digital age...",
    author: authors[0],
    category: "education",
    slug: "modern-teaching-methods",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Mental Health Awareness",
    content: "Understanding and managing mental health challenges...",
    author: authors[1],
    category: "health",
    slug: "mental-health-awareness",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Blockchain Technology Explained",
    content: "Comprehensive guide to understanding blockchain...",
    author: authors[0],
    category: "tech",
    slug: "blockchain-technology-explained",
    image: SAMPLE_IMAGE,
    status: "draft"
  },
  {
    title: "Sustainable Living Tips",
    content: "How to reduce your environmental footprint...",
    author: authors[1],
    category: "lifestyle",
    slug: "sustainable-living-tips",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Online Learning Platforms",
    content: "Top platforms for remote education...",
    author: authors[0],
    category: "education",
    slug: "online-learning-platforms",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Nutrition for Athletes",
    content: "Optimal dietary plans for sports performance...",
    author: authors[1],
    category: "health",
    slug: "nutrition-for-athletes",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Cybersecurity Best Practices",
    content: "Essential tips for protecting your digital assets...",
    author: authors[0],
    category: "tech",
    slug: "cybersecurity-best-practices",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Minimalist Lifestyle Benefits",
    content: "Why less might actually be more...",
    author: authors[1],
    category: "lifestyle",
    slug: "minimalist-lifestyle-benefits",
    image: SAMPLE_IMAGE,
    status: "draft"
  },
  {
    title: "Early Childhood Education",
    content: "Key factors in preschool development...",
    author: authors[0],
    category: "education",
    slug: "early-childhood-education",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Yoga for Stress Relief",
    content: "Effective yoga poses for relaxation...",
    author: authors[1],
    category: "health",
    slug: "yoga-for-stress-relief",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "5G Network Technology",
    content: "Understanding the next generation of mobile networks...",
    author: authors[0],
    category: "tech",
    slug: "5g-network-technology",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Urban Gardening Guide",
    content: "Growing your own food in small spaces...",
    author: authors[1],
    category: "lifestyle",
    slug: "urban-gardening-guide",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "STEM Education Importance",
    content: "Why science and technology education matters...",
    author: authors[0],
    category: "education",
    slug: "stem-education-importance",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Sleep Hygiene Tips",
    content: "Improving your sleep quality for better health...",
    author: authors[1],
    category: "health",
    slug: "sleep-hygiene-tips",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Quantum Computing Basics",
    content: "Introduction to the future of computing...",
    author: authors[0],
    category: "tech",
    slug: "quantum-computing-basics",
    image: SAMPLE_IMAGE,
    status: "draft"
  },
  {
    title: "Digital Detox Strategies",
    content: "How to unplug and recharge...",
    author: authors[1],
    category: "lifestyle",
    slug: "digital-detox-strategies",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Language Learning Techniques",
    content: "Effective methods for mastering new languages...",
    author: authors[0],
    category: "education",
    slug: "language-learning-techniques",
    image: SAMPLE_IMAGE,
    status: "published"
  },
  {
    title: "Healthy Aging Tips",
    content: "Maintaining vitality in later years...",
    author: authors[1],
    category: "health",
    slug: "healthy-aging-tips",
    image: SAMPLE_IMAGE,
    status: "published"
  }
];

async function seedBlogs() {
  try {
    await connectDB();

    await Blog.deleteMany();
    console.log("Cleared existing blogs");

    const createdBlogs = await Blog.insertMany(dummyBlogs);
    console.log(`Seeded ${createdBlogs.length} blogs successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
}

seedBlogs();