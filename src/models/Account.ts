import { Model, Modifiers, Id, QueryBuilder, Page, SingleQueryBuilder } from 'objection';
import bcrypt from 'bcryptjs';
import Plan from './Plan';
import { any } from 'bluebird';
// const { QueryBuilder } = require('objection');

class MyQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  // These are necessary. You can just copy-paste them and change the
  // name of the query builder class.
  ArrayQueryBuilderType!: MyQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: MyQueryBuilder<M, M>;
  NumberQueryBuilderType!: MyQueryBuilder<M, number>;
  PageQueryBuilderType!: MyQueryBuilder<M, Page<M>>;

  findByEmail(email: string): this {
    return this.where('email', email);
  }

  findOneByEmail(email: string): SingleQueryBuilder<any> {
    return this.where('email', email).first()
  }
}


export default class User extends Model {
  id!: number;
  firstName!: string;
  lastName!: string;
  password!: string;
  username!: string;
  email!: string;
  plan?: Plan;

  QueryBuilderType!: MyQueryBuilder<this>;
  static QueryBuilder = MyQueryBuilder;

  // Table name is the only required property.
  static tableName = 'users';

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings = () => ({
    plan: {
      relation: Model.BelongsToOneRelation,
      modelClass: Plan,
      join: {
        to: 'users.planId',
        from: 'plans.id',
      }
    },
  });

  async $beforeInsert(queryContext: any) {
    await super.$beforeInsert(queryContext);
    return this.generateHash();
  }

  async generateHash() {
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
