exports.up = (knex: any) => {
  return knex.schema
    .createTable('users', (table: any) => {
      table.increments('id').primary();

      table
        .integer('planId')
        .unsigned()
        .references('id')
        .inTable('plans')
        .onDelete('SET NULL')
        .index()

      table.string('firstName');
      table.string('lastName');
      table.string('username');
      table.string('email');
      table.string('password');
    })
    .createTable('plans', (table: any) => {
      table.increments('id').primary();
      table.string('name');
    });
};

exports.down = (knex: any) => {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('plans')
};
