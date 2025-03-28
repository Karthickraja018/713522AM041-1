// src/components/Feed.js
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getPosts, getComments } from '../Services/api';
import PostCard from './PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const data = await getPosts();
    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      data.map(async (post) => {
        const comments = await getComments(post.id);
        return { ...post, commentCount: comments.length };
      })
    );
    // Sort by date (newest first)
    const sortedPosts = postsWithComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(sortedPosts);
  };

  useEffect(() => {
    fetchPosts();
    // Poll for new posts every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Feed
      </Typography>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} user={{ name: 'Unknown' }} commentCount={post.commentCount} />
      ))}
    </Box>
  );
};

export default Feed;