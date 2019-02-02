const db = require('./dbConfig');

const User = require('./models/User')

let DBHelper = class DBHelper {

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

    async userAddFavorite(userId, dataId, tipo) {

        let data = await User.findOne()
            .where('id', userId)
            .where('favorites.' + tipo, dataId)
            .exec();

        if (data) {
            console.log('Impossivel adicionar aos favoritos, já existe: [' + tipo + '] ' + dataId)
            console.log(data.favorites[tipo]);
            return false;
        }

        if (!data) {
            data = await User.findOne()
                .where('id', userId)
                .exec();
            data.favorites[tipo].push(dataId);
            data = await data.save();
        }

        if (data) {
            console.log('Adicionado aos Favoritos: [' + tipo + '] ' + dataId)
            console.log(data.favorites[tipo]);
            return true
        }
    }

    async userRemoveFavorite(userId, dataId, tipo) {

        let data = await User.findOne()
            .where('id', userId)
            .where('favorites.' + tipo, dataId)
            .exec();

        if (!data) {
            console.log('Impossivel remover dos favoritos, não existe: [' + tipo + '] ' + dataId)
            console.log(data.favorites[tipo]);
            return false;
        }

        if (data) {
            data.favorites[tipo].pull(dataId)
            data = await data.save();
        }

        if (data) {
            console.log('Removido dos Favoritos: [' + tipo + '] ' + dataId)
            console.log(data.favorites[tipo]);
            return true
        }
    }
}

module.exports = DBHelper;