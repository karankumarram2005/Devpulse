import mongoose from 'mongoose';

const cacheSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true, // e.g., "github:torvalds" or "leetcode:neal_wu"
        },
        data: {
            type: Object,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600, // TTL Index: Auto-delete documents after 1 hour
        },
    },
    { timestamps: true }
);

export const Cache = mongoose.model('Cache', cacheSchema);