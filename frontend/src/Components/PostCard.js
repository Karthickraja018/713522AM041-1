// src/components/PostCard.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const PostCard = ({ post, user, commentCount }) => {
  // Use a random placeholder image for each post
  const randomImage = `https://picsum.photos/seed/${post.id}/300/200`;

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardMedia component="img" height="140" image={randomImage} alt="Post image" />
      <CardContent>
        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Posted by: {user?.name || 'Unknown User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comments: {commentCount}
        </Typography>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;