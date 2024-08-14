/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addConstraint(
      "playlist_songs",
      "fk_playlist.song.id",
      `FOREIGN KEY("playlist_id") REFERENCES playlists(id) ON DELETE CASCADE`
    );

    pgm.addConstraint(
      "playlist_songs",
      "fk_song.playlist.id",
      `FOREIGN KEY("song_id") REFERENCES songs(id) ON DELETE CASCADE`
    );
  };
  
  /**
   * @param pgm {import('node-pg-migrate').MigrationBuilder}
   * @param run {() => void | undefined}
   * @returns {Promise<void> | void}
   */
  exports.down = (pgm) => {
    pgm.dropConstraint("playlist_songs", "fk_playlist.song.id");
    pgm.dropConstraint("playlist_songs", "fk_song.playlist.id");
  };
