const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const knex = require("knex");
require('dotenv').config(); // Load environment variables

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Configure Knex
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:mHKjXUMtzJwZknGJyyamACMhgyOoKJhw@postgres.railway.internal:5432/railway", // Use DATABASE_URL from environment variables
    ssl: {
      rejectUnauthorized: false, // Necessary for some hosting environments like Railway
    },
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000, // 30 seconds
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
});

// Serve static files from the "Public" directory
app.use(express.static(path.join(__dirname, "Public")));

// Route: Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route: Favorite Posts
app.get("/api/Favposts", async (req, res) => {
  try {
    const posts = await db('posts')
      .select("*")
      .whereIn("id", [16, 9, 13, 15])
      .orderByRaw("CASE id WHEN 16 THEN 1 WHEN 9 THEN 2 WHEN 13 THEN 3 WHEN 15 THEN 4 END")
      .limit(4);

    res.json(posts);
  } catch (error) {
    console.error("Error fetching favorite posts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route: Latest Posts
app.get("/api/latestPosts", async (req, res) => {
  try {
    const posts = await db('posts')
      .select("*")
      .orderBy("created_at", "desc") // Changed to 'desc' to get latest posts
      .limit(6);

    const formattedPosts = posts.map(post => ({
      ...post,
      created_at: post.created_at.toISOString().split('T')[0]
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route: About Page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

// Route: Posts Page
app.get("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "posts.html"));
});

// Route: All Posts API
app.get("/posts/api", async (req, res) => {
  try {
    const posts = await db('posts').select("*");

    const formattedPosts = posts.map(post => ({
      ...post,
      created_at: post.created_at.toISOString().split('T')[0]
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route: Single Post Page
app.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "postView.html"));
});

// Route: Single Post API with Comments
app.get("/post/api/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post
    const post = await db('posts')
      .select("*")
      .where({ id: postId })
      .first();

    if (!post) {
      return res.status(404).send("Post not found");
    }
    const comments = await db('comments')
      .select("*")
      .where({ post_id: postId })
      .orderBy("created_at", "asc");
    const formattedComments = comments.map(comment => ({
      ...comment,
      created_at: comment.created_at ? comment.created_at.toISOString().split('T')[0] : null
    }));

    res.json({
      ...post,
      comments: formattedComments
    });
  } catch (error) {
    console.error("Error fetching post and comments:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route: Admin Page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Route: Create New Post (Admin)
app.post('/admin/newPost', async (req, res) => {
  const { title, image_url, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  try {
    await db.transaction(async (trx) => {
      await trx('posts').insert({
        title,
        content,
        image_url
      });
    });

    res.status(201).send('Post created successfully!');
  } catch (err) {
    console.error("Error creating new post:", err);
    res.status(500).send('Error creating post.');
  }
});

// Route: Create New Comment
app.post('/api/comments', async (req, res) => {
  const { post_id, name, comment } = req.body;

  // Validate input
  if (!post_id || !name || !comment) {
    return res.status(400).json({ error: "post_id, name, and comment are required." });
  }

  try {
    await db.transaction(async (trx) => {
      // Optional: Check if the post exists
      const postExists = await trx('posts').where({ id: post_id }).first();
      if (!postExists) {
        throw new Error("Post does not exist.");
      }

      await trx('comments').insert({ 
        post_id, 
        name, 
        comment 
      });
    });

    res.status(201).json({ name, comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Contact Page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Use backticks for template literals
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing database connection.');
  db.destroy()
    .then(() => {
      console.log('Database connection closed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error closing database connection:', err);
      process.exit(1);
    });
});
