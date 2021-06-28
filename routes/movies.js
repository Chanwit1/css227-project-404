var express = require('express'),
    router  = express.Router(),
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
    Movie  = require('../models/movie');

router.get('/', function(req, res){
    Movie.find({}, function(err, allMovies){
        if(err){
            console.log(err);
        } else {
            res.render('movies/index.ejs', {movie: allMovies});
        }
    });
});

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
    console.log(req.file);
    req.body.movie.image = '/uploads/'+ req.file.filename;
    req.body.movie.author = {
        id: req.user._id,
        username: req.user.username
    };
    // var newCollection = {name:name, image:image, desc: desc, author: author};
    Movie.create(req.body.movie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            req.flash('success', 'Your movie is created.');
            res.redirect('/movie');
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req,res){
    res.render('movies/new.ejs');
});

router.get("/:id", function(req, res){
    Movie.findById(req.params.id).populate('comments').exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            res.render("movies/show.ejs", {movie: foundMovie});
        }
    });
});

router.post('/search', function (req, res) {
    var name = req.body.search;
    res.redirect('/movie/search/'+name);

});

router.get('/search/:name', function (req, res,) {
    Movie.find({ name: new RegExp(req.params.name, 'i')}, function (err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('movies/index.ejs',{movie: foundMovie, sort: req.params.category});
        }
    });
});

router.get('/genre/:category', function (req, res,) {
    Movie.find({ category: new RegExp(req.params.category, 'i')}, function (err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('movies/index.ejs',{movie: foundMovie, sort: req.params.category});
        }
    });
});

router.get('/:id/edit', middleware.checkMovieOwner, function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            res.render('movies/edit.ejs', {movie: foundMovie})
        }
    });
});

router.put('/:id', upload.single('image'), function(req, res){
    if(req.file){
        req.body.movie.image = '/uploads/'+ req.file.filename;
    }
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie){
        if(err){
            res.redirect('/movie/');
        } else {
            res.redirect('/movie/'+req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkMovieOwner, function(req, res){
    Movie.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/movie/');
        } else {
            req.flash('success', 'You delete your movie.');
            res.redirect('/movie/');
        }
    });
});




module.exports = router;