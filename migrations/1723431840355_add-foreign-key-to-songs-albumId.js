/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO albums(id, name, year) VALUES ('old_album', 'old_album', 2024)"
  );

  // mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql(`UPDATE songs SET "albumId" = 'old_album' WHERE "albumId" IS NULL`);

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint(
    "songs",
    "fk_songs.album.id",
    `FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE`
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint("songs", "fk_songs.album.id");

  // mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql(`UPDATE songs SET "albumId" = NULL WHERE "albumId" = 'old_album'`);

  // menghapus user baru.
  pgm.sql("DELETE FROM albums WHERE id = 'old_album'");
};
