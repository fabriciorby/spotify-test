const db = require('./dbConfig');

const User = require('./models/User')

let DBHelper = class DBHelper {

    constructor(){};

    async setOrUpdateUser(spotifyUser) {

        let query = { id: { $eq: spotifyUser.id } };
        let update = { last_seen: new Date() };
        let options = { new: true, returnNewDocument: true }

        //check if user already exists, if so then update last_seen
        let userInfo = await User.findOneAndUpdate(query, update, options,
            (err, data) => {
                if (err) throw err;
                return data;
            });

        //else, create new User on DB
        if (!userInfo) {
            userInfo = new User(spotifyUser);
            await userInfo.save((err) => {
                if (err) throw err;
            })
        }

        console.log(userInfo);
        
        return userInfo;
    }
}

module.exports = DBHelper;