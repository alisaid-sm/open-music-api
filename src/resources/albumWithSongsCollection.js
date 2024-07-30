const { albumResource } = require("./albumResource");
const { songResource } = require("./songResource");

const albumWithSongsCollection = ({ id, name, year, songs }) => {
    const optionalResource = {};

    if (songs) {
        optionalResource.songs = songs.map(songResource);
    }

    return albumResource({ id, name, year }, optionalResource);
}

module.exports = { albumWithSongsCollection };
