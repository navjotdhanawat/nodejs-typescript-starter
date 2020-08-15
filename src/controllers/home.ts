'use strict';

import { Response, Request, NextFunction } from 'express';
import { User } from '../models/User';
import Plan from '../models/Plan';


export class HomeController {
  constructor() {}

  public createPlan = async (req: Request, res: Response) => {
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

  public createUser = async (req: Request, res: Response) => {
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

  public getAllUser = async (req: Request, res: Response) => {
    const users = await User.query();
    res.send(users);
  };

  public getAllPlans = async (req: Request, res: Response) => {
    const plan = await Plan.query();
    res.send(plan);
  };
}