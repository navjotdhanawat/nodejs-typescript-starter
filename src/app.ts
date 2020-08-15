import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import cors from 'cors';
import lusca from 'lusca';
import flash from 'express-flash';
import passport from 'passport';
import errorHandler from 'errorhandler';

import Knex from 'knex';
import knexConfig from '../knexfile';
import { Model, ForeignKeyViolationError, ValidationError } from 'objection';
// import "./config/passport.config";

// Controllers (route handlers)
import {UserController} from './controllers/user';
import {AuthController} from './controllers/auth';
import {HomeController} from './controllers/home';
// API keys and Passport configuration

export class Server {
  public app: express.Application;
  public userController: UserController = new UserController();
  public homeController: HomeController = new HomeController();
  public authController: AuthController = new AuthController();

  constructor(port: string) {
    this.app = express();
    this.app.set('port', port);
    this.initDB();
    this.config();
    this.routes();
  }

  public config(): void {
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(lusca.xframe('SAMEORIGIN'));
    this.app.use(lusca.xssProtection(true));
    this.app.use(errorHandler())
    this.app.use(cors());
  }

  public initDB(): void {
    // Initialize knex.
    const knex = Knex(knexConfig.development);
    Model.knex(knex);
  }

  public routes(): void {
    this.app.post('/user', this.authController.authenticateJWT, this.homeController.createUser);
    this.app.get('/user', this.authController.authenticateJWT, this.homeController.getAllUser);
    this.app.post('/plan', this.authController.authenticateJWT, this.homeController.createPlan);
    this.app.get('/plan', this.authController.authenticateJWT, this.homeController.getAllPlans);
    this.app.post('/login', this.userController.login);
    this.app.post('/signup', this.userController.signup);
    this.app.get('/logout', this.userController.logout);
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log(
        '  API is running at http://localhost:%d',
        this.app.get('port'),
      );
    });
  }
}