const { playlistActivitiesResource } = require("./playlistActivitiesResource");

const playlistsActivitiesCollection = (playlistActivities) =>
  playlistActivities.map(playlistActivitiesResource);

module.exports = { playlistsActivitiesCollection };
