/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Deezer authentication strategy authenticates requests by delegating to
 * Deezer using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Deezer application's client id
 *   - `clientSecret`  your Deezer application's client secret
 *   - `callbackURL`   URL to which Deezer will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new InstagramStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/deezer/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://connect.deezer.com/oauth/auth.php';
  options.tokenURL = options.tokenURL || 'https://connect.deezer.com/oauth/access_token.php';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'deezer';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Deezer.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `deezer`
 *   - `id`               the user's Deezer ID
 *   - `username`         the user's Deezer username
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

  this._oauth2.get('https://api.deezer.com/user/me', accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    try {
      var json = JSON.parse(body);
    } catch (ex) {
      return done(new Error("Failed to parse user profile"));
    }

    var profile = {
      provider: 'deezer',
      id: json.id,
      displayName: json.name,
      name: {
        familyName: json.lastname,
        givenName: json.firstname
      },
      emails: [
        {
          value: json.email
        }
      ],
      photos: []
    };

    var formats = ['small', 'medium', 'big'];
    formats.forEach(function(format) {
      profile.photos.push({
        value: json.picture + '?size=' + format
      });
    });

    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
