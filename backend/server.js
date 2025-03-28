const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const TEST_SERVER = 'http://20.244.56.144/test';

// Add your authentication token here
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzMTU2MDg0LCJpYXQiOjE3NDMxNTU3ODQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMzNTc0Y2UxLWRjY2UtNDhhZS05NTk1LTFhNTM1Mjg4NmRiYiIsInN1YiI6ImUua2FydGhpY2tyYWphMjAwNEBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJnb01hcnQiLCJjbGllbnRJRCI6IjMzNTc0Y2UxLWRjY2UtNDhhZS05NTk1LTFhNTM1Mjg4NmRiYiIsImNsaWVudFNlY3JldCI6InhURmpHcUp4d1FBWW5aZmQiLCJvd25lck5hbWUiOiJSYWh1bCIsIm93bmVyRW1haWwiOiJlLmthcnRoaWNrcmFqYTIwMDRAZ21haWwuY29tIiwicm9sbE5vIjoiNzEzNTIyQU0wNDEifQ.VQVk6-GXVo2bzBgILUS74P_1pyuihOEKUbkwY3nwXco';

// Configure axios with default headers
const api = axios.create({
    baseURL: TEST_SERVER,
    headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

app.use(cors());
app.use(express.json());

// Helper function to fetch user posts
async function fetchUserPosts(userId) {
    try {
        const response = await api.get(`/users/${userId}/posts`);
        return response.data;
    } catch (err) {
        console.error(`Error fetching posts for user ${userId}:`, err);
        return [];
    }
}

// Get top users endpoint
app.get('/users', async (req, res) => {
    try {
        const response = await api.get('/users');
        // Transform users object into array format
        const users = Object.entries(response.data.users || {}).map(([id, name]) => ({
            id: parseInt(id),
            name
        }));
        
        // Rest of the code remains the same
        const usersWithPosts = await Promise.all(
            users.map(async (user) => {
                const posts = await fetchUserPosts(user.id);
                return {
                    ...user,
                    post_count: posts.length
                };
            })
        );

        const topUsers = usersWithPosts
            .sort((a, b) => b.post_count - a.post_count)
            .slice(0, 5);

        res.json(topUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        console.error('Response data:', err.response?.data);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get top/latest posts endpoint
app.get('/posts', async (req, res) => {
    try {
        const { type = 'latest' } = req.query;
        
        // Fetch all users first
        const usersResponse = await api.get('/users');
        // Transform users object into array format
        const users = Object.entries(usersResponse.data.users || {}).map(([id, name]) => ({
            id: parseInt(id),
            name
        }));

        // Rest of the code remains the same...
        const allPosts = [];
        for (const user of users) {
            const posts = await fetchUserPosts(user.id);
            allPosts.push(...posts.map(post => ({
                id: post.id,
                userid: post.user_id,
                content: post.content
            })));
        }

        let result;
        if (type === 'popular') {
            result = allPosts
                .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
            
            const maxComments = result[0]?.comments?.length || 0;
            result = result.filter(post => (post.comments?.length || 0) === maxComments);
            
        } else if (type === 'latest') {
            result = allPosts
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5);
        } else {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }
        
        const formattedResponse = {
            posts: result.map(post => ({
                id: post.id,
                userid: post.userid,
                content: post.content
            }))
        };
        
        res.json(formattedResponse);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});