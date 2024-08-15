/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.addConstraint(
    "collaborations",
    "fk_playlists.users.id",
    `FOREIGN KEY("playlist_id") REFERENCES playlists(id) ON DELETE CASCADE`
  );

  pgm.addConstraint(
    "collaborations",
    "fk_users.playlist.id",
    `FOREIGN KEY("user_id") REFERENCES users(id) ON DELETE CASCADE`
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("collaborations", "fk_playlists.users.id");
  pgm.dropConstraint("collaborations", "fk_users.playlist.id");
};
