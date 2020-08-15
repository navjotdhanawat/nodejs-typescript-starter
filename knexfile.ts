export = {
  // development: {
  //   client: 'sqlite3',
  //   useNullAsDefault: true,
  //   connection: {
  //     filename: './example.db'
  //   },
  //   pool: {
  //     afterCreate: (conn: any, cb: any) => {
  //       conn.run('PRAGMA foreign_keys = ON', cb)
  //     }
  //   }
  // },
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root', // replace with your mysql username
      password: 'root', // replace with your mysql password
      database: 'objection',
    },
    debug: true,
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'example',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
