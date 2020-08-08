'use strict';

import crypto from 'crypto';
import { check, sanitize, validationResult } from 'express-validator';
import { Response, Request, NextFunction } from 'express';
import User from '../models/Account';
import Plan from '../models/Plan';

/**
 * List of API examples.
 * @route POST /user
 */

export const createPlan = async (req: Request, res: Response) => {
  let {
    name
  } = req.body;
  const insertedGraph = await Plan.transaction(async trx => {
    const insertedGraph = await Plan.query(trx)
      // For security reasons, limit the relations that can be inserted.
      .insertGraph({
        name
      });

    return insertedGraph;
  });

  res.send(insertedGraph);
};

export const createUser = async (req: Request, res: Response) => {
  let {
    firstName,
    lastName,
    password,
    plan: { id: planId },
  } = req.body;
  const insertedGraph = await User.transaction(async trx => {
    const insertedGraph = await User.query(trx)
      // For security reasons, limit the relations that can be inserted.
      .insertGraph({
        firstName,
        lastName,
        password,
        plan: { '#dbRef': planId },
      });

    return insertedGraph;
  });

  res.send(insertedGraph);
};

export const getAllUser = async (req: Request, res: Response) => {
  const users = await User.query().findById(1);
  users.plan = await users.$relatedQuery('plan');
  res.send(users);
};

/**
 * Create a new local account.
 * @route POST /signup
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check('email', 'Email is not valid')
    .isEmail()
    .run(req);
  await check('password', 'Password must be at least 4 characters long')
    .isLength({ min: 4 })
    .run(req);
  // await check('confirmPassword', 'Passwords do not match')
  //   .equals(req.body.password)
  //   .run(req);
  // eslint-disable-next-line @typescript-eslint/camelcase
  await sanitize('email')
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send(errors);
  }

  //DB operation to insert user data
  let {
    firstName,
    lastName,
    username,
    email,
    password,
    plan: { id: planId },
  } = req.body;
  const insertedGraph = await User.transaction(async trx => {
    const insertedGraph = await User.query(trx).insertGraph({
      firstName,
      lastName,
      password,
      username: username || email,
      email,
      plan: { '#dbRef': planId },
    });

    return insertedGraph;
  });

  res.send(insertedGraph);
};


export const login = async (req: Request, res: Response) => {
  const user = await User.query().findById(1)
  res.send(user);
};