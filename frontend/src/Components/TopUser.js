// src/components/TopUsers.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { getTopUsers } from '../Services/api';

const TopUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const data = await getTopUsers();
      // Sort users by post count and take the top 3
      const sortedUsers = data.sort((a, b) => b.postCount - a.postCount).slice(0, 3);
      setUsers(sortedUsers);
    };
    fetchTopUsers();
  }, []);

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h5" gutterBottom>
        Top Users
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar src={`https://picsum.photos/seed/${user.id}/50`} />
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={`Posts: ${user.postCount}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TopUsers;