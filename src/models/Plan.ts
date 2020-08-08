import { Model } from 'objection'
import User from './Account'

export default class Plan extends Model {
  id!: number
  name?: string

  // Table name is the only required property.
  static tableName = 'plans'
}