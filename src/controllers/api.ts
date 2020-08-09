'use strict';

import { Response, Request, NextFunction } from 'express';
import { IVerifyOptions } from "passport-local";
import passport from "passport";

import User from '../models/Account';
import Plan from '../models/Plan';

/**
 * List of API examples.
 * @route POST /plan
 */

export const createPlan = async (req: Request, res: Response) => {
  let { name } = req.body;
  const insertedGraph = await Plan.transaction(async trx => {
    const insertedGraph = await Plan.query(trx)
      // For security reasons, limit the relations that can be inserted.
      .insertGraph({
        name,
      });

    return insertedGraph;
  });

  res.send(insertedGraph);
};

export const createUser = async (req: Request, res: Response) => {
  let {
    firstname,
    lastname,
    password,
    plan: { id: planId },
  } = req.body;
  const insertedGraph = await User.transaction(async trx => {
    const insertedGraph = await User.query(trx)
      // For security reasons, limit the relations that can be inserted.
      .insertGraph({
        firstname,
        lastname,
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

export const getAllPlans = async (req: Request, res: Response) => {
  const plan = await Plan.query().myCustomMethod(1);
  res.send(plan);
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
  //DB operation to insert user data
  let {
    firstname,
    lastname,
    username,
    email,
    password,
    plan: { id: planId },
  } = req.body;
  const user = await User.query().insertGraph({
    firstname,
    lastname,
    password,
    username: username || email,
    email,
    plan: { '#dbRef': planId },
  });

  res.send(user);
};

export const login = async (req: Request, res: Response , next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: User, info: IVerifyOptions) => {
    if (err) { return next(err); }
    if (!user) {
        return res.send({msg: info.message});
    }
    req.logIn(user, (err) => {
        if (err) { return next(err); }
        res.send({ msg: "Success! You are logged in." });
    });
  })(req, res, next);
};


/**
 * Log out.
 * @route GET /logout
 */
export const logout = (req: Request, res: Response) => {
  req.logout();
  res.send(true);
};