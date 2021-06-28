var Movie = require('../models/movie'),
    Theater = require('../models/theater'),
    Comment    = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkMovieOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Movie.findById(req.params.id, function(err, foundMovie){
            if(err){
                req.flash('error', 'Movie not found!');
                res.redirect('back');
            } else {
                if(foundMovie.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do this action.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to sign in first!');
        res.redirect('back');
    }
}

middlewareObj.checkTheaterOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Theater.findById(req.params.id, function(err, foundTheater){
            if(err){
                req.flash('error', 'Theater not found!');
                res.redirect('back');
            } else {
                if(foundTheater.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do this action.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to sign in first!');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error', 'Comment not found!');
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do this action.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to sign in first!');
        res.redirect('back');
    }
}



middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in first!');
    res.redirect('/login');
}

module.exports = middlewareObj;