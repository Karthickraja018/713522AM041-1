// src/services/api.js
import axios from 'axios';

const BASE_URL = ''; // Replace with the actual backend API URL
const AUTH_TOKEN = 'your-auth-token'; // Replace with the actual token

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

// Get top 3 users with the highest number of posts
export const getTopUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching top users:', error);
    return [];
  }
};

// Get posts (for trending and feed)
export const getPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Get comments for a specific post
export const getComments = async (postId) => {
  try {
    const response = await api.get(`/comments?postId=${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};