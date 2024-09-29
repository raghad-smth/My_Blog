exports.up = function(knex) {
    return knex.schema.createTable('comments', function(table) {
      table.increments('id').primary();
      table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE');
      table.string('name').notNullable();
      table.text('comment').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comments');
  };
  