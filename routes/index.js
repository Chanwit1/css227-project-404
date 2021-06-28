const { Router } = require('express');

var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
    Movie   = require('../models/movie'),
    Theater = require('../models/theater'),
    Buy     = require('../models/buy')
    multer  = require('multer'),
    path    = require('path'), 
    middleware = require('../middleware'),
    storage = multer.diskStorage({
                destination: function(req, file, callback){
                    callback(null,'./public/uploads/');
                },
                filename: function(req, file, callback){
                    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                }
            }),
    imageFilter = function (req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
            return callback(new Error('Only JPG, jpeg, PNGm and GIF image files are allowed!'), false);
        }
        callback(null, true);
    },
    upload  = multer({storage: storage, fileFilter: imageFilter}),  
    passport=  require('passport');

    router.get('/', function(req, res){
        Movie.find().sort({imdb:-1}).limit(4).exec(function(err,sortedMovie){
            if(err){
                console.log(err);
            }else{
                res.render('home.ejs', {movie: sortedMovie});
            }
        })
    });


router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', upload.single('profileImage'), function(req, res){
    req.body.profileImage = '/uploads/'+ req.file.filename;
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profileImage: req.body.profileImage
    });
    if(req.body.adminCode === 'topsecret') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to CW movies ' + user.username);
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true,
        successFlash: 'Successfully log in',
        failureFlash: 'Invalid username or password'
    }), function(res, res){       
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged you out successfully');
    res.redirect('/');
});

router.get('/user/:id', function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash('error', 'There is somethin wrong');
            return res.redirect('/');
        }
        Movie.find().where('author.id').equals(foundUser._id).exec(function(err, foundMovie){
            if(err){
                req.flash('error', 'There is somethin wrong');
                return res.redirect('/');
            }
            Buy.find({},function(err,ticket){
                res.render('user/show.ejs', {user: foundUser, movies:  foundMovie ,buy: ticket}); 
            })
           
        });
    });
});

router.get('/buy/:id',middleware.isLoggedIn, function(req, res){
    Movie.findById(req.params.id, function(err, allMovies){
        if(err){
            console.log(err);
        } else {
            res.render('buy/buy.ejs', {movie: allMovies});
        }
    });
});
 
router.post('/ticket/:id',middleware.isLoggedIn,function(req, res){
    var tname = req.user.username
    req.body.buy.name = tname
    Buy.create(req.body.buy, function(err, newlyCreated){
        if(err){
        console.log(err);
        } else{
            Movie.findById(req.params.id, function(err, allMovies){
                if(err){
                    console.log(err);
                } else {
                    req.flash('success', 'Your ticket is created.');
                    res.render('buy/ticket.ejs', {movie: allMovies,ticket:newlyCreated});
                }
            });
        
       } 
    })  
});



module.exports = router;