var express = require('express'),
    router  = express.Router(),
    multer  = require('multer'),
    path    = require('path'), 
    Theater = require('../models/theater'),
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
        Theater.find({}, function(err, allTheater){
            if(err){
                console.log(err);
            } else {
                res.render('theaters/tindex.ejs', {theater: allTheater});
            }
        });
    });

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
    console.log(req.file);
    req.body.theater.image = '/uploads/'+ req.file.filename;
    req.body.theater.author = {
        id: req.user._id,
        username: req.user.username
    };
    // var newCollection = {name:name, image:image, desc: desc, author: author};
    Theater.create(req.body.theater, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            req.flash('success', 'Your theater is created.');
            res.redirect('/theater');
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req,res){
    res.render('theaters/new.ejs');
});

router.get("/:id", function(req, res){
    Theater.findById(req.params.id).populate('comments').exec(function(err, foundTheater){
        if(err){
            console.log(err);
        } else {
            res.render("theaters/show.ejs", {theater: foundTheater});
        }
    });
});

router.get('/:id/edit', middleware.checkTheaterOwner, function(req, res){
    Theater.findById(req.params.id, function(err, foundTheater){
        if(err){
            console.log(err);
        } else {
            res.render('theaters/edit.ejs', {theater: foundTheater})
        }
    });
});

router.put('/:id', upload.single('image'), function(req, res){
    if(req.file){
        req.body.theater.image = '/uploads/'+ req.file.filename;
    }
    Theater.findByIdAndUpdate(req.params.id, req.body.theater, function(err, updatedTheater){
        if(err){
            res.redirect('/theater/');
        } else {
            res.redirect('/theater/'+req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkTheaterOwner, function(req, res){
    Theater.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/theater/');
        } else {
            req.flash('success', 'You delete your theater.');
            res.redirect('/theater/');
        }
    });
});

module.exports = router;