import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router"
import { useAuth } from "../hooks/useAuth";
import { MdDeleteForever, MdReply } from "react-icons/md";
import SkeletonBlogDetail from "../components/SkeletonBlogDetail";
import { CgSpinner } from "react-icons/cg";

interface Comment {
    _id: string,
    user: {
        _id: string,
        name: string
    };
    content: string,
    parentComment: string,
    replies: Comment[]
}

interface Blog {
    _id: number;
    image: string,
    title: string;
    content: string;
    slug: string;
    likes: [{ _id: string, name: string }];
    comments: Comment[];
}

export default function BlogDetail() {

    const [blog, setBlog] = useState<Blog>();
    const [loading, setLoading] = useState(true);
    const [isAddComment, setIsAddComment] = useState(false);
    const [isAddReply, setIsAddReply] = useState<string | null>(null);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const { user } = useAuth();

    const { slug } = useParams();

    const [comment, setComment] = useState("");
    const [reply, setReply] = useState("");

    const fetchBlog = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/${slug}`);
            setBlog(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching blog");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }
        
        setSubmittingComment(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/${blog?._id}/comments`, {
                content: comment
            },
            {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            await fetchBlog();
            setIsAddComment(false);
            setComment("");
            toast.success("Comment added");
        } catch (err) {
            console.log(err);
            toast.error("Error adding comment");
        } finally {
            setSubmittingComment(false);
        }
    }

    if (loading) {
        return <SkeletonBlogDetail />
    }

    const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }

    const handleReplyInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReply(e.target.value);
    }

    const handleAddReply = async (e: React.FormEvent<HTMLFormElement>, commentId: string) => {
        e.preventDefault();
        if (!reply.trim()) {
            toast.error("Reply cannot be empty");
            return;
        }
        
        setSubmittingReply(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/${blog?._id}/comments/${commentId}/replies`,
                { content: reply },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                }
            );
            toast.success("Reply added");
            await fetchBlog();
            setIsAddReply(null);
            setReply("");
        } catch (error: any) {
            toast.error(error);
        } finally {
            setSubmittingReply(false);
        }
    }

    const handleDelete = async (commentId: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/blog/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            await fetchBlog();
            toast.success("Comment successfully deleted");
        } catch (error: any) {
            toast.error(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 rounded-xl overflow-hidden shadow-neumorphic dark:shadow-dark-neumorphic">
                    <img
                        src={blog?.image}
                        alt={blog?.slug}
                        className="w-full h-96 object-cover"
                    />
                </div>

                <article className="mb-12">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-300">{blog?.title}</h1>
                    <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                        {blog?.content}
                    </div>
                </article>

                <section className="dark:bg-gray-800 p-6 rounded-lg shadow-neumorphic dark:shadow-dark-neumorphic">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
                            Comments ({blog?.comments.length})
                        </h3>
                        <button
                            onClick={() => setIsAddComment(true)}
                            className="px-4 py-2 rounded-lg 
                        shadow-neumorphic dark:shadow-dark-neumorphic
                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                        text-blue-500 transition-shadow duration-300"
                        >
                            Add Comment
                        </button>
                    </div>

                    {/* add comment */}
                    {isAddComment && (
                        <form onSubmit={handleAddComment} className="mb-8">
                            <textarea
                                value={comment}
                                onChange={handleCommentInputChange}
                                placeholder="Write your comment..."
                                className="w-full p-4 rounded-lg
                            bg-gray-100 dark:bg-gray-800
                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                            text-gray-600 dark:text-gray-300
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                            />
                            <div className="flex justify-end mt-4 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddComment(false);
                                        setComment("");
                                    }}
                                    className="px-4 py-2 rounded-lg
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300
                                text-gray-600 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingComment}
                                    className="px-4 py-2 rounded-lg
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300
                                 text-blue-500 disabled:opacity-70
                                flex items-center gap-2"
                                >
                                    {submittingComment ? (
                                        <>
                                            <CgSpinner fontSize={24} className="animate-spin dark:text-gray-200" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* comments list */}
                    <div className="space-y-6">
                        {blog?.comments.map((comment) => (
                            <div key={comment._id} className="rounded-lg bg-gray-100 dark:bg-gray-800 shadow-neumorphic dark:shadow-dark-neumorphic">
                                <div className="p-4">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-medium text-gray-800 dark:text-gray-300">
                                            {comment.user.name}
                                        </h4>
                                        
                                        {user?.id === comment.user._id && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <MdDeleteForever size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {comment.content}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        {user?.id && (
                                            <button
                                                onClick={() => setIsAddReply(comment._id)}
                                                className="text-blue-500 flex items-center gap-1"
                                            >
                                                <MdReply />
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* reply form */}
                                {isAddReply === comment._id && (
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                        <form onSubmit={(e) => handleAddReply(e, comment._id)}>
                                            <textarea
                                                value={reply}
                                                onChange={handleReplyInputChange}
                                                placeholder="Write your reply..."
                                                className="w-full p-3 rounded-lg
                                            bg-gray-100 dark:bg-gray-800
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                            text-gray-600 dark:text-gray-300
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={3}
                                            />
                                            <div className="flex justify-end mt-3 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsAddReply(null);
                                                        setReply("");
                                                    }}
                                                    className="px-3 py-1 rounded-lg
                                                shadow-neumorphic dark:shadow-dark-neumorphic
                                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                transition-shadow duration-300
                                                text-gray-600 dark:text-gray-300 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={submittingReply}
                                                    className="px-3 py-1 rounded-lg
                                                shadow-neumorphic dark:shadow-dark-neumorphic
                                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                transition-shadow duration-300
                                                 text-blue-500 text-sm disabled:opacity-70
                                                flex items-center gap-2"
                                                >
                                                    {submittingReply ? (
                                                        <>
                                                            <CgSpinner className="animate-spin dark:text-gray-200" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        "Submit Reply"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="pl-8 pr-4 pb-4 space-y-4">
                                        {comment.replies.map((reply) => (
                                            <div key={reply._id} className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm">
                                                <div className="flex justify-between mb-1">
                                                    <h5 className="font-medium text-gray-800 dark:text-gray-300 text-sm">
                                                        {reply.user.name}
                                                    </h5>
                                                    
                                                    {user?.id === reply.user._id && (
                                                        <button
                                                            onClick={() => handleDelete(reply._id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <MdDeleteForever size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {reply.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {blog?.comments.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No comments yet. Be the first to comment!
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}