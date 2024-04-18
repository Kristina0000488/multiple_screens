const Screen = require('../models/screen');

module.exports = (request, reply, done) => {
    Screen.countDocuments({}, (err, count) => {
        if (err) {
            console.error(err);
            reply.code(500).send('Error!');
        }

        reply.header('Content-Range', `screens 0-10}/${count}`);
        done();
    });
};