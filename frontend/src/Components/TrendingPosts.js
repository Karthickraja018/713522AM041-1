// src/components/TrendingPosts.js
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getPosts, getComments } from '../Services/api';
import PostCard from './PostCard';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      const posts = await getPosts();
      // Fetch comments for each post and calculate comment count
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          const comments = await getComments(post.id);
          return { ...post, commentCount: comments.length };
        })
      );
      // Sort by comment count and take the top posts
      const sortedPosts = postsWithComments.sort((a, b) => b.commentCount - a.commentCount).slice(0, 5);
      setTrendingPosts(sortedPosts);
    };
    fetchTrendingPosts();
  }, []);

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h5" gutterBottom>
        Trending Posts
      </Typography>
      {trendingPosts.map((post) => (
        <PostCard key={post.id} post={post} user={{ name: 'Unknown' }} commentCount={post.commentCount} />
      ))}
    </Box>
  );
};

export default TrendingPosts;