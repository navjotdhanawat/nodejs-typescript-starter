import { v4 as uuidv4 } from 'uuid';

exports.up = (knex: any) => {
  return knex.schema
    .createTable('users', (table: any) => {
      table.uuid('id').primary();
      table.string('firstname');
      table.string('lastname');
      table.string('email').unique();
      table.string('password');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('plans', (table: any) => {
      table.uuid('id').primary();
      table.string('name');
      table.string('code');
      table.string('currency');
      table.integer('price');
    })
    .alterTable('users', (table: any) => {
      table
        .uuid('planId')
        .references('id')
        .inTable('plans')
        .onDelete('SET NULL')
        .index();
    })
    .then(() => {
      let plans = [
        {
          name: 'Starter',
          code: 'STARTER_15',
          price: 15,
          currency: 'USD',
          id: uuidv4()
        },
        {
          name: 'Advance',
          price: 20,
          code: 'ADVANCE_25',
          currency: 'USD',
          id: uuidv4()
        },
      ];
      return knex('plans').insert(plans);
    });
};

exports.down = (knex: any) => {
  return knex.schema.dropTableIfExists('users').dropTableIfExists('plans');
};
