var mongoose    = require('mongoose'),
    Movie      = require('./models/movie'),
    Theater    = require('./models/theater'),
    Comment     = require('./models/comment');

// var data = [
//     {
//         name:'Iron man mk1', 
//         image: 'https://www.hidefninja.com/community/attachments/7134_press01-001-jpg.104947/',
//         desc: 'XXXXX'
//     },
//     {
//         name:'Iron man mk2', 
//         image: 'http://marveltoynews.com/wp-content/uploads/2014/11/Sideshow-Iron-Man-Mark-II-Maquette-Statue-e1415163580309.jpg',
//         desc: 'XXXXX'
//     },
//     {
//         name:'Iron man mk3', 
//         image: 'https://cq.lnwfile.com/s7fudq.jpg',
//         desc: 'XXXXX'
//     }    
// ];

function seedDB(){
    Movie.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Remove DB completed");
        // data.forEach(function(seed){
        //     Movie.create(seed, function(err, movie){
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log('New data added');
        //         }
        //     });
        // });
    });
}

module.exports = seedDB;