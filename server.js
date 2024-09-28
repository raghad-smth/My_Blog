const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "Iaminlovewithjoy<3.",
    database: "my_blog",
  },
});



app.use(express.static(path.join(__dirname, "Public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/Favposts", (req, res) => {
  knex
  .select("*")
  .from("posts")
  .whereIn("id", [16, 9, 13, 15])
  .orderByRaw("CASE id WHEN 16 THEN 1 WHEN 9 THEN 2 WHEN 13 THEN 3 WHEN 15 THEN 4 END")
  .limit(4)
  .then((posts) => {
    res.json(posts);
  })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/api/latestPosts", (req, res) => {
  knex
    .select("*")
    .from("posts")
    .limit(6)
    .orderBy("created_at")
    .then((posts) => {
      posts.forEach(post => {
        post.created_at = post.created_at.toISOString().split('T')[0] 
      });
      res.json(posts);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "posts.html"));
});

app.get("/posts/api", (req, res) => {
    knex
    .select("*")
    .from("posts")
    .then((posts) => {
      posts.forEach(post => {
        post.created_at = post.created_at.toISOString().split('T')[0] 
      });
    res.json(posts);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      res.status(500).send("Internal Server Error");
    });
})

app.get("/post", (req, res) => {
    res.sendFile(path.join(__dirname, "postView.html"));
  });

app.get("/post/api/:id", (req, res) => {
  const postId = req.params.id;

  knex('posts')
      .select('posts.*') 
      .leftJoin('comments', 'posts.id', 'comments.post_id') 
      .where({ 'posts.id': postId }) // Adjust 'id' if your primary key is named differently
      .first()
      .then((post) => {
          if (post) {
              // Fetch comments separately
              return knex('comments')
                  .where({ post_id: postId })
                  .then((comments) => {
                      // Return the post along with its comments
                      return {
                          ...post,
                          comments // Include the comments array
                      };
                  });
          } else {
              res.status(404).send("Post not found");
          }
      })
      .then((postWithComments) => {
          if (postWithComments) {
              res.json(postWithComments);
          }
      })
      .catch((error) => {
          console.error("Error fetching post:", error);
          res.status(500).send("Internal Server Error");
      });
  
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.post('/admin/newPost', async (req, res) => {
  const { title, image_url, content} = req.body;
  try {
    await knex('posts').insert({
      title: title,
      content: content,
      image_url: image_url
  });
    res.status(201).send('Post created successfully!');
} catch (err) {
    console.error(err);
    res.status(500).send('Error creating post.');
}
});


app.post('/api/comments', async (req, res) => {
  const { post_id, name, comment } = req.body;

  try {
      await knex('comments').insert({ 
        post_id: post_id, 
        name: name, 
        comment: comment });
      res.status(201).json({ name, comment});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});


app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
