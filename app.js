const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        flash           = require('connect-flash'),
        methodOverride  = require('method-override'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        Theater         = require('./models/theater'),
        Movie           = require('./models/movie'),
        Comment         = require('./models/comment'),
        User            = require('./models/user'),
        seedDB          =  require('./seeds');

var movieRoutes         = require('./routes/movies'),
    commentRoutes       = require('./routes/comments'),
    indexRoutes         = require('./routes/index'),
    theaterRoutes       = require('./routes/theaters');

mongoose.connect('mongodb://localhost/cwmovies');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.use(flash());
 //seedDB();

app.use(require('express-session')({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/movie', movieRoutes);
app.use('/movie/:id/comments', commentRoutes);
app.use('/theater', theaterRoutes);


app.listen(3000, function(){
    console.log('Server is started.');
});    