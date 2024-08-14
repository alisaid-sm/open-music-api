const { playlistResource } = require("./playlistResource");

const playlistsCollection = playlists => playlists.map(playlistResource);

module.exports = { playlistsCollection };
