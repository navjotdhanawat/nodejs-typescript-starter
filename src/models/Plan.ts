import { Model, SingleQueryBuilder, QueryBuilder, Page, Id } from 'objection'

class MyQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  // These are necessary. You can just copy-paste them and change the
  // name of the query builder class.
  ArrayQueryBuilderType!: MyQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: MyQueryBuilder<M, M>;
  NumberQueryBuilderType!: MyQueryBuilder<M, number>;
  PageQueryBuilderType!: MyQueryBuilder<M, Page<M>>;

  findByPlanCode(code: string): SingleQueryBuilder<this> {
    return this.findOne({ code });
  }
}

export default class Plan extends Model {
  QueryBuilderType!: MyQueryBuilder<this>;
  static QueryBuilder = MyQueryBuilder;
  id!: Id
  code?: string
  price?: number
  name!: string

  // Table name is the only required property.
  static tableName = 'plans'

  myMethod() {
    return true;
  }
}