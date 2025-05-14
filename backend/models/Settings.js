import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: "My Blog"
    },
    siteDescription: {
      type: String,
      default: "A modern blog powered by React and Node.js"
    },
    contactEmail: {
      type: String,
      default: "contact@example.com"
    },
    enableRegistration: {
      type: Boolean,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    footerText: {
      type: String,
      default: "© 2023 My Blog. All rights reserved."
    },
    socialLinks: {
      twitter: {
        type: String,
        default: ""
      },
      facebook: {
        type: String,
        default: ""
      },
      instagram: {
        type: String,
        default: ""
      }
    }
  },
  { timestamps: true }
);

// We'll only have one settings document in the collection
settingsSchema.statics.getSiteSettings = async function() {
  let settings = await this.findOne({});
  
  // If no settings exist, create default settings
  if (!settings) {
    settings = await this.create({});
  }
  
  return settings;
};

export default mongoose.model("Settings", settingsSchema); 