/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addConstraint(
      "playlists",
      "fk_playlist.user.id",
      `FOREIGN KEY("owner") REFERENCES users(id) ON DELETE CASCADE`
    );
  };
  
  /**
   * @param pgm {import('node-pg-migrate').MigrationBuilder}
   * @param run {() => void | undefined}
   * @returns {Promise<void> | void}
   */
  exports.down = (pgm) => {
    pgm.dropConstraint("playlists", "fk_playlist.user.id");
  };
