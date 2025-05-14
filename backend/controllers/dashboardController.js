import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";


export const getDashboardStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    try {
      const [currentUsers, lastMonthUsers] = await Promise.all([
        User.countDocuments().exec(),
        User.countDocuments({ createdAt: { $lt: lastMonth } }).exec()
      ]);
      
      const [currentBlogs, lastMonthBlogs] = await Promise.all([
        Blog.countDocuments().exec(),
        Blog.countDocuments({ createdAt: { $lt: lastMonth } }).exec()
      ]);
      
      const [currentComments, lastMonthComments] = await Promise.all([
        Comment.countDocuments().exec(),
        Comment.countDocuments({ createdAt: { $lt: lastMonth } }).exec()
      ]);

      const calculateChange = (current, last) => {
        if (last === 0) return current > 0 ? 100 : 0;
        return ((current - last) / last) * 100;
      };

      const stats = {
        users: {
          count: currentUsers,
          change: `${calculateChange(currentUsers, lastMonthUsers).toFixed(1)}%`,
          period: 'from last month'
        },
        blogs: {
          count: currentBlogs,
          change: `${calculateChange(currentBlogs, lastMonthBlogs).toFixed(1)}%`,
          period: 'from last month'
        },
        comments: {
          count: currentComments,
          change: `${calculateChange(currentComments, lastMonthComments).toFixed(1)}%`,
          period: 'from last month'
        }
      };

      const blogsByCategory = await Blog.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "comments"
          }
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            totalComments: { $sum: { $size: "$comments" } },
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } }
          }
        },
        {
          $project: {
            category: "$_id",
            count: 1,
            totalComments: 1,
            totalLikes: 1,
            engagement: {
              $add: [
                { $multiply: ["$totalComments", 2] },
                "$totalLikes"
              ]
            }
          }
        },
        { $sort: { engagement: -1 } }
      ]);
      
      const topAuthors = await Blog.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "comments"
          }
        },
        {
          $group: {
            _id: "$author",
            blogCount: { $sum: 1 },
            totalComments: { $sum: { $size: "$comments" } },
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "authorDetails"
          }
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            name: { $arrayElemAt: ["$authorDetails.name", 0] },
            blogCount: 1,
            totalComments: 1,
            totalLikes: 1,
            engagement: {
              $add: [
                { $multiply: ["$totalComments", 2] },
                "$totalLikes"
              ]
            }
          }
        },
        { $sort: { engagement: -1 } },
        { $limit: 5 }
      ]);

      const recentActivity = await Promise.all([
        User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name email role createdAt')
          .lean()
          .then(users => users.map(user => ({
            type: 'user',
            action: 'registered',
            message: `${user.name} joined the platform`,
            details: {
              email: user.email,
              role: user.role
            },
            timestamp: user.createdAt
          }))),
        
        Blog.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('author', 'name')
          .lean()
          .then(blogs => blogs.map(blog => ({
            type: 'blog',
            action: 'created',
            message: `${blog.author?.name || 'Unknown'} published "${blog.title}"`,
            details: {
              category: blog.category,
              status: blog.status
            },
            timestamp: blog.createdAt
          }))),
        
        Comment.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'name')
          .populate('blog', 'title')
          .lean()
          .then(comments => comments.map(comment => ({
            type: 'comment',
            action: 'commented',
            message: `${comment.user?.name || 'Unknown'} commented on "${comment.blog?.title || 'Unknown Blog'}"`,
            details: {
              content: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : "")
            },
            timestamp: comment.createdAt
          })))
      ]).then(results => 
        results.flat()
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 10)
      );

      const popularBlogs = await Blog.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails"
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            category: 1,
            status: 1,
            createdAt: 1,
            authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
            commentCount: { $size: "$comments" },
            likeCount: { $size: { $ifNull: ["$likes", []] } },
            engagement: {
              $add: [
                { $multiply: [{ $size: "$comments" }, 2] },
                { $size: { $ifNull: ["$likes", []] } }
              ]
            }
          }
        },
        { $sort: { engagement: -1 } },
        { $limit: 5 }
      ]);
      
      return res.json({
        success: true,
        stats,
        blogsByCategory,
        topAuthors: topAuthors.filter(author => author.name),
        recentActivity,
        popularBlogs
      });

    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return res.status(500).json({
        success: false,
        error: "Database operation failed",
        details: dbError.message
      });
    }

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Failed to get dashboard statistics",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


export const getRecentActivity = async (req, res) => {
  try {
    const [newUsers, newBlogs, newComments] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name email createdAt"),
      Blog.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title author createdAt")
        .populate("author", "name"),
      Comment.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("content user blog createdAt")
        .populate("user", "name")
        .populate("blog", "title")
    ]);

    const activities = [
      ...newUsers.map(user => ({
        type: "user",
        message: `New user registered: ${user.name}`,
        timestamp: user.createdAt,
        user: { id: user._id, name: user.name }
      })),
      ...newBlogs.filter(blog => blog.author).map(blog => ({
        type: "blog",
        message: `New blog posted: "${blog.title}" by ${blog.author ? blog.author.name : 'Unknown'}`,
        timestamp: blog.createdAt,
        user: { 
          id: blog.author ? blog.author._id : null, 
          name: blog.author ? blog.author.name : 'Unknown' 
        },
        blog: { id: blog._id, title: blog.title }
      })),
      ...newComments.filter(comment => comment.user && comment.blog).map(comment => ({
        type: "comment",
        message: `New comment on "${comment.blog ? comment.blog.title : 'Unknown blog'}" by ${comment.user ? comment.user.name : 'Unknown'}`,
        timestamp: comment.createdAt,
        user: { 
          id: comment.user ? comment.user._id : null, 
          name: comment.user ? comment.user.name : 'Unknown' 
        },
        blog: { 
          id: comment.blog ? comment.blog._id : null, 
          title: comment.blog ? comment.blog.title : 'Unknown blog' 
        }
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    console.error("Recent activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity",
      error: error.message
    });
  }
};


export const getPopularBlogs = async (req, res) => {
  try {
    const popularBlogs = await Blog.find()
      .sort({ likes: -1, views: -1 })
      .limit(5)
      .select("title author likes views createdAt")
      .populate("author", "name");

    const formattedBlogs = popularBlogs.map(blog => ({
      _id: blog._id,
      title: blog.title,
      author: blog.author ? { 
        _id: blog.author._id, 
        name: blog.author.name 
      } : { 
        _id: null, 
        name: 'Unknown' 
      },
      likes: blog.likes ? blog.likes.length : 0,
      views: blog.views || 0,
      createdAt: blog.createdAt
    }));

    res.status(200).json({
      success: true,
      popularBlogs: formattedBlogs
    });
  } catch (error) {
    console.error("Popular blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular blogs",
      error: error.message
    });
  }
}; 