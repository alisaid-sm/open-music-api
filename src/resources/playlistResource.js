const playlistResource = ({ id, name, username }, {...optionalResource}) => ({
  id,
  name,
  username,
  ...optionalResource,
});

module.exports = { playlistResource };
