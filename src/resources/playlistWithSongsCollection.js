const { playlistResource } = require("./playlistResource");
const { songResource } = require("./songResource");

const playlistWithSongsCollection = ({ id, name, username, songs }) => {
    const optionalResource = {};

    if (songs) {
        optionalResource.songs = songs.map(songResource);
    }

    return playlistResource({ id, name, username }, optionalResource);
}

module.exports = { playlistWithSongsCollection };
