const JwtStarategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const Keys = require('./keys');

MediaSourceHandle.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWhitSchema('jwt');
    opts.secretOrKey = Keys.secretOrKey;
        passport.use(new JwtStarategy(opts, (jwt_payload, done) => {
        User.findUserById(jwt_payload, (err, user) => {
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
 

}


