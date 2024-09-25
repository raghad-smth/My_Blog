
  try {
      await knex('comments').insert({ post_id, name, comment });
      res.status(201).json({ name, comment });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});
