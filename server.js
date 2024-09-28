const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const knex = require("knex");
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined')); // HTTP request logger for better visibility

// Configure Knex with optimized pool settings
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "raghoodi-production.up.railway.app",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Iaminlovewithjoy<3.",
    database: process.env.DB_NAME || "my_blog",
    ssl: {
      rejectUnauthorized: false, // Adjust based on your setup; necessary for some hosted databases
    },
  },
  pool: {
    min: 2, // Minimum number of connections
    max: 10, // Adjusted maximum number of connections based on typical Railway limits
    acquireTimeoutMillis: 30000, // 30 seconds timeout
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 30000,
  },
  acquireConnectionTimeout: 30000, // 30 seconds
});

// Optional: Log pool events for debugging
// Note: Knex doesn't emit 'createRequest', 'acquireConnection', 'releaseConnection' by default.
// To monitor connection pool events, consider using the `pg` library's events or external monitoring tools.

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
      .select("id", "title", "image_url", "created_at") // Select only necessary columns
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
      .select("id", "title", "image_url", "created_at") // Select only necessary columns
      .orderBy("created_at", "desc")
      .limit(6);

    const formattedPosts = posts.map(post => ({
      ...post,
      created_at: post.created_at.toISOString().split('T')[0],
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
    const posts = await db('posts').select("id", "title", "image_url", "created_at");

    const formattedPosts = posts.map(post => ({
      ...post,
      created_at: post.created_at.toISOString().split('T')[0],
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
      .select("id", "title", "content", "image_url", "created_at")
      .where({ id: postId })
      .first();

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Fetch comments associated with the post
    const comments = await db('comments')
      .select("id", "post_id", "name", "comment", "created_at")
      .where({ post_id: postId })
      .orderBy("created_at", "asc");

    // Format dates if necessary
    const formattedComments = comments.map(comment => ({
      ...comment,
      created_at: comment.created_at ? comment.created_at.toISOString().split('T')[0] : null,
    }));

    res.json({
      ...post,
      comments: formattedComments,
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
      await trx('posts')
        .transacting(trx) // Explicitly bind to transaction
        .insert({
          title,
          content,
          image_url,
          created_at: new Date(), // Ensure created_at is set
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
      const postExists = await trx('posts')
        .transacting(trx) // Explicitly bind to transaction
        .where({ id: post_id })
        .first();

      if (!postExists) {
        throw new Error("Post does not exist.");
      }

      await trx('comments')
        .transacting(trx) // Explicitly bind to transaction
        .insert({
          post_id,
          name,
          comment,
          created_at: new Date(), // Ensure created_at is set
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
  console.log(`Server is running on port ${PORT}`);
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
