import { Model, Modifiers, Id } from 'objection';
import Plan from './Plan';

export default class User extends Model {
  id!: number;
  firstName!: string;
  lastName!: string;
  password!: string;
  plan?: Plan

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
}
