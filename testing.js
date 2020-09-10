var distance = require('google-distance');

distance.apiKey = 'AIzaSyBj1Jt7lZarIkV7kFj9zepz3E2P1UdWFek';

distance.get(
    {
        index: 1,
        origin: '-5.2942881,105.1907781',
        destination: '-5.376452,105.257772'
    },
    function(err, data) {
        if (err) return console.log(err);
        console.log(data);
    });
