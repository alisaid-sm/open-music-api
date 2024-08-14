/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO albums(id, name, year) VALUES ('old_album', 'old_album', 2024)"
  );

  pgm.sql(`UPDATE songs SET "album_id" = 'old_album' WHERE "album_id" IS NULL`);

  pgm.addConstraint(
    "songs",
    "fk_songs.album.id",
    `FOREIGN KEY("album_id") REFERENCES albums(id) ON DELETE CASCADE`
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("songs", "fk_songs.album.id");

  pgm.sql(`UPDATE songs SET "album_id" = NULL WHERE "album_id" = 'old_album'`);

  pgm.sql("DELETE FROM albums WHERE id = 'old_album'");
};
