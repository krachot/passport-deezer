# Passport-Deezer

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Deezer](http://www.deezer.com/) using the OAuth 2.0 API.

This module lets you authenticate using Deezer in your Node.js applications.
By plugging into Passport, Deezer authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-deezer

## Usage

#### Configure Strategy

The Deezer authentication strategy authenticates users using a Deezer
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new DeezerStrategy({
        clientID: DEEZER_CLIENT_ID,
        clientSecret: DEEZER_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/deezer/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ deezerId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'deezer'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/deezer',
      passport.authenticate('deezer'));

    app.get('/auth/deezer/callback',
      passport.authenticate('deezer', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/krachot/passport-deezer/tree/master/examples/login).

## Tests

Tests not yet provided

## Release History

* 0.2.0 Handle permissions
* 0.1.0 Initial release

## Credits

  - [Matthieu Bozec](http://github.com/krachot)

This strategy is based on Jared Hanson's GitHub strategy for passport: [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Matthieu Bozec <[http://matthieu.bozec.org/](http://matthieu.bozec.org/)>
