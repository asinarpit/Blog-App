import slugify from "slugify";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newBlog = new Blog({
      title,
      content,
      category,
      author: req.user.userId,
      image: req.file?.url || null,
      slug: slugify(title, { lower: true }),
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created",
      blog: newBlog,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const filter = {};
    
    if (!req.user || req.user.role !== 'admin') {
      filter.status = "published";
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.author) {
      filter.author = req.query.author;
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .populate({
        path: "comments",
        select: "_id",
      })
      .lean();

    const formattedBlogs = blogs.map((blog) => ({
      ...blog,
      commentsCount: blog.comments.length,
      likesCount: blog.likes.length,
    }));

    console.log(`Returning ${formattedBlogs.length} blogs for ${req.user?.role || 'non-authenticated'} user`);
    
    res.status(200).json(formattedBlogs);
  } catch (error) {
    console.error("Error in getBlogs:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name")
      .populate("likes", "name")
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: "name",
          },
          {
            path: "replies",
            populate: {
              path: "user",
              select: "name",
            },
          },
        ],
      });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name")
      .populate("likes", "name")
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: "name",
          },
          {
            path: "replies",
            populate: {
              path: "user",
              select: "name",
            },
          },
        ],
      });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.body.status && Object.keys(req.body).length === 1 && req.user.role === 'admin') {
      blog.status = status;
      await blog.save();
      return res.status(200).json({
        message: "Blog status updated",
        blog,
      });
    }

    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (status) blog.status = status;
    if (title) blog.slug = slugify(title, { lower: true });

    await blog.save();
    res.status(200).json({
      message: "Blog updated",
      blog,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user.role !== 'admin' && blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access Denied" });
    }

    await Comment.deleteMany({ blog: blog._id });

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(400).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    console.log(blog);
    const userId = req.user.userId;
    const index = blog.likes.indexOf(userId);

    if (index === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const { content } = req.body;

    const comment = new Comment({
      blog: blog._id,
      user: req.user.userId,
      content,
      depth: 0,
    });

    await comment.save();

    blog.comments.push(comment._id);
    await blog.save();

    const populatedComment = await Comment.populate(comment, {
      path: "user",
      select: "name",
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


export const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const userId = req.user.userId;

    const index = comment.likes.indexOf(userId);

    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    res.status(200).json(comment.likes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const parentComment = await Comment.findById(req.params.commentId);
    const { content } = req.body;

    const reply = new Comment({
      blog: parentComment.blog,
      user: req.user.userId,
      content,
      parentComment: parentComment._id,
      depth: parentComment.depth + 1,
    });

    await reply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    const populatedReply = await Comment.populate(reply, {
      path: "user",
      select: "name",
    });

    res.status(201).json(populatedReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate("user", "id")
      .populate("blog", "id");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user._id.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment and its replies deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
