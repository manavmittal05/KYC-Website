module.exports.isLoggedIn = (req, res, next) => {
    if(!res.locals.currentUser) {
        req.flash('error', 'You must be signed in to do that!');
        return res.redirect('/login');
    }
    next()
}