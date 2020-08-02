import { Model } from 'objection'
import User from './Account'

export default class Plan extends Model {
  id!: number
  name!: string

  // Table name is the only required property.
  static tableName = 'plans'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 }
    }
  }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings = () => ({
    user: {
      relation: Model.HasManyRelation,

      // The related model.
      modelClass: User,

      join: {
        from: 'plans.id',
        to: 'users.planId'
      }
    }
  })
}