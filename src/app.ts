import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import path from "path";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

import Knex from 'knex'
import knexConfig from '../knexfile'
import { Model, ForeignKeyViolationError, ValidationError } from 'objection'

// Initialize knex.
const knex = Knex(knexConfig.development)

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex)

// Controllers (route handlers)
import * as userController from "./controllers/user";


// API keys and Passport configuration
import * as passportConfig from "./config/passport.common";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


/**
 * Primary app routes.
 */
app.post("/user", userController.createUser);
app.get("/user", passportConfig.isAuthenticated, userController.getAllUser);
app.post("/plan", userController.createPlan);
app.get("/plan", userController.getAllPlans);
app.post("/login", userController.login);
app.post("/signup", userController.signup);
app.get("/logout", userController.logout);



export default app;
