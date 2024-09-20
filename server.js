const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());

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

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/Favposts", (req, res) => {
  knex
    .select("*")
    .from("posts")
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
        .where({ id: postId })
        .select('*')
        .then((post) => {
            if (post) {
                res.json(post);
            } else {
                res.status(404).send("Post not found");
            }
        })
        .catch((error) => {
            console.error("Error fetching post:", error);
            res.status(500).send("Internal Server Error");
        });
});


app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
