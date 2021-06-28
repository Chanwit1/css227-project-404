var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    imdb: Number,
    category: String,
    teaser:String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Movie', movieSchema);