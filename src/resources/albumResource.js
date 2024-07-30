const albumResource = ({ id, name, year }, {...optionalResource}) => ({
  id,
  name,
  year,
  ...optionalResource,
});

module.exports = { albumResource };
