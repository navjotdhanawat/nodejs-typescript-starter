"use strict";

import { Response, Request, NextFunction } from "express";
import User from '../models/Account'


/**
 * List of API examples.
 * @route POST /user
 */
export const createUser = async (req: Request, res: Response) => {
    const insertedGraph = await User.transaction(async trx => {
        const insertedGraph = await User.query(trx)
          // For security reasons, limit the relations that can be inserted.
          .insertGraph(req.body)

        return insertedGraph
      })

    res.send(insertedGraph);
};