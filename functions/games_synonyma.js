var db = require('../lib/db.js');
var resultModel = require('../lib/models/result.js');
var synonyma = require('../lib/games/synonyma');

var LEVELS = {
    easy:   1,
    normal: 2,
    hard:   3
}

// return request number of questions
exports.getQuestion = function(req, res){

    var level = req.params.level;
    var count = req.params.count;

    req.user = {result : {user_id : 1} };

    var user_id = req.user.result.user_id;

    if(!count || count < 0 || count > 25)
        res.send(500, new resultModel.result(false, {}, ['Count is invalid.']));

    else if(!level || !LEVELS[level])
        res.send(500, new resultModel.result(false, {}, ['Level is invalid.']));

    else {

        db.execute('SELECT * FROM word_lookup WHERE user_id = ?', [user_id], function(err, result){
            if(err)
                res.send(500, new resultModel.result(false, {}, ['Error while generating words!]']));

            else {
                synonyma.generate(req.user.result, level, count, result, function(result, questions){
                    if(result)
                        res.send(new resultModel.result(true, questions));
                    else
                        res.send(new resultModel.result(false, {}, ['Error while generating words!]']));
                });
            }
        });
    }
};