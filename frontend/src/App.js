// src/App.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import TopUsers from './Components/TopUser';
import TrendingPosts from './Components/TrendingPosts';
import Feed from './Components/Feed';

function App() {
  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Social Media Analytics
      </Typography>
      <TopUsers />
      <TrendingPosts />
      <Feed />
    </Container>
  );
}

export default App;