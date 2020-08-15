'use strict';

import { Response, Request, NextFunction } from 'express';
import { IVerifyOptions } from "passport-local";
import passport from "passport";
import { v4 as uuidv4 } from 'uuid';
import * as jwt from "jsonwebtoken";

import { User } from '../models/User';
import Plan from '../models/Plan';
const JWT_SECRET = 'secret';

export class UserController {
  constructor() {}


  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    //DB operation to insert user data
    let {
      firstname,
      lastname,
      email,
      password
    } = req.body;

    User.findOne({email}, async (err: Error, userExist: User) => {
      if (err) { return next(err); }
      if (userExist) {
        return res.status(500).send({ message: "Account with that email address already exists."});
      }
      const user = await User.query().insertAndFetch({
        id: uuidv4(),
        firstname,
        lastname,
        password,
        email
      });

      const plan = await Plan.query().findByPlanCode('STARTER_15'); //Default plan for new user
      await user.$relatedQuery('plan').relate(plan)

      res.send(user);
    })
  };

  public login = async (req: Request, res: Response , next: NextFunction) => {
    passport.authenticate("local",  (err: Error, user: User, info: IVerifyOptions) => {
      // no async/await because passport works only with callback ..
      if (err) { return next(err); }
      if (!user) {
          return res.send({msg: info.message});
      }
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
      res.status(200).send({ token: token });
    })(req, res, next);
  };


  /**
   * Log out.
   * @route GET /logout
   */
  public logout = (req: Request, res: Response) => {
    req.logout();
    res.send(true);
  };
}