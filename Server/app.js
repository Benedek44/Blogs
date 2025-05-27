import express from "express";
import cors from 'cors';
import * as db from './Util/database.js';

const PORT = 8080;
const app = express();
app.use(cors());   
app.use(express.json());



app.get('/users', (req, res) => {
    try {
        const users = db.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.get('/users/:id', (req, res) => {
    try {
        const user = db.getUser(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.post('/users', (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ message: 'Invalid credentials!' });

        const user = db.saveUser(name);
        if (user.changes != 1)
            return res.status(501).json({ message: 'User save failed!' });

        res.status(201).json({ id: user.lastInsertRowid, name });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.put('/users/:id', (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ message: 'Invalid credentials!' });

        const user = db.updateUser(req.params.id, name);
        if (user.changes != 1)
            return res.status(501).json({ message: 'User update failed!' });

        res.status(200).json({ id: req.params.id, name });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.delete('/users/:id', (req, res) => {
    try {
        const user = db.deleteUser(req.params.id);
        if (user.changes != 1)
            return res.status(501).json({ message: 'User delete failed!' });

        res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});


app.get('/blogs', (req, res) => {
    try {
        const blogs = db.getBlogs();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.get('/blogs/:id', (req, res) => {
    try {
        const blog = db.getBlog(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found!' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.post('/blogs', (req, res) => {
    try {
        const { authorId, title, category, content } = req.body;
        if (!authorId || !title || !category || !content)
            return res.status(400).json({ message: 'Invalid blog data!' });

        const now = new Date().toISOString();
        const result = db.saveBlog(authorId, title, category, content, now, now);
        if (result.changes != 1)
            return res.status(501).json({ message: 'Blog save failed!' });

        res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.put('/blogs/:id', (req, res) => {
    try {
        const { authorId, title, category, content } = req.body;
        if (!authorId || !title || !category || !content)
            return res.status(400).json({ message: 'Invalid blog data!' });

        const blog = db.getBlog(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found!' });

        const updated = new Date().toISOString();
        const result = db.updateBlog(req.params.id, authorId, title, category, content, blog.created_at, updated);
        if (result.changes != 1)
            return res.status(501).json({ message: 'Blog update failed!' });

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.delete('/blogs/:id', (req, res) => {
    try {
        const result = db.deleteBlog(req.params.id);
        if (result.changes != 1)
            return res.status(501).json({ message: 'Blog delete failed!' });

        res.status(200).json({ message: 'Blog deleted!' });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server runs on port ${PORT}`);
});
