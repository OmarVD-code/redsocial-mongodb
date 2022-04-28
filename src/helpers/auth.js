const helpers = {}

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/users/signin');

}

helpers.isNotAuthenticated = (req, res, next) => {
  if(!req.isAuthenticated()){
    return next();
  }
    res.redirect('/');
}

module.exports = helpers;
