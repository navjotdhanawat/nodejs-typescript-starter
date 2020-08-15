import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { User } from '../models/User';
const JWT_SECRET = 'secret';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err: any, user: User) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(undefined, false, {
          message: `Email ${email} not found.`,
        });
      }
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(undefined, user);
        }
        return done(undefined, false, {
          message: 'Invalid username or password.',
        });
      });
    });
  }),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    function(jwtToken: any, done: any) {
      User.findOne({ email: jwtToken.email }, function(err: any, user: User) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(undefined, user, jwtToken);
        } else {
          return done(undefined, false);
        }
      });
    },
  ),
);
