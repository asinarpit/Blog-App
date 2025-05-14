import mongoose from "mongoose";
import Blog from "./Blog.js";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    depth: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// removing all the replies also when parent comment is deleted

commentSchema.pre("remove", async (next) => {
  try {
    await Comment.deleteMany({ parentComment: this._id });

    await Blog.findByIdAndUpdate(this.blog, {
      $pull: { comments: this._id },
    });

    // removing reply
    if (this.parentComment) {
      await Comment.findByIdAndUpdate(this.parentComment, {
        $pull: { replies: this._id },
      });
    }

    next();
  } catch (error) {
    next(error)
  }
});

export default mongoose.model("Comment", commentSchema);
