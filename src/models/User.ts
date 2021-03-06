import { Model, QueryBuilder, SingleQueryBuilder, Page, Id } from 'objection';
import bcrypt from 'bcryptjs';
import Plan from './Plan';

class MyQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  ArrayQueryBuilderType!: MyQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: MyQueryBuilder<M, M>;
  NumberQueryBuilderType!: MyQueryBuilder<M, number>;
  PageQueryBuilderType!: MyQueryBuilder<M, Page<M>>;

  findByEmailId(email: string): SingleQueryBuilder<this> {
    return this.findOne({ email });
  }
}
export class User extends Model {
  id!: Id;
  firstname!: string;
  lastname!: string;
  password!: string;
  email!: string;
  plan?: Plan;
  tokens?: Array<string>;

  QueryBuilderType!: MyQueryBuilder<this>;
  static QueryBuilder = MyQueryBuilder;

  // Table name is the only required property.
  static tableName = 'users';
  constructor() {
    super()

  }
  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings = () => ({
    plan: {
      relation: Model.BelongsToOneRelation,
      modelClass: Plan,
      join: {
        to: 'users.planId',
        from: 'plans.id',
      },
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

  comparePassword(password: string, cb: any) {
    return cb(null, bcrypt.compareSync(password, this.password));
  }

  static async findOne(arg: any, cb: any) {
    try {
      let user = await this.query().findOne(arg);
      cb(null, user)
    } catch(err) {
      cb(err)
    }
  }
}
