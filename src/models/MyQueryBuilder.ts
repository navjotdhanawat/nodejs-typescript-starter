// MyQueryBuilder.js
const { QueryBuilder } = require('objection');

class MyQueryBuilder extends QueryBuilder {
  myCustomMethod() {
    this.doSomething();
    return this;
  }

  doSomething() {
    console.log('------------Custome');
  }
}