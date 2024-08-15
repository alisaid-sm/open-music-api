const playlistActivitiesResource = ({ username, title, action, time }, {...optionalResource}) => ({
  username,
  title,
  action,
  time,
  ...optionalResource,
});

module.exports = { playlistActivitiesResource };
