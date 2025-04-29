import mongoose, { Schema, Document } from 'mongoose';

export interface IRepo {
  name: string;
  url: string;
  description?: string;
  stars?: number;
  language?: string;
}

export interface IUser extends Document {
  githubId: string;
  username: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
  bio?: string;
  tagline?: string;
  languages: string[];
  repos: IRepo[];
  activityLevel: 'high' | 'medium' | 'low';
  interests: string[];
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    email: { type: String },
    name: { type: String },
    bio: { type: String },
    tagline: { type: String },
    languages: { type: [String], default: [] },
    repos: { 
      type: [{ 
        name: String, 
        url: String, 
        description: String,
        stars: Number,
        language: String
      }], 
      default: [] 
    },
    activityLevel: { 
      type: String, 
      enum: ['high', 'medium', 'low'], 
      default: 'medium' 
    },
    interests: { type: [String], default: [] },
    location: { type: String }
  },
  { 
    timestamps: true 
  }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;