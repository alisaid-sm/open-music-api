const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { playlistsCollection } = require("../resources/playlistsCollection");
const AuthorizationError = require("../exceptions/AuthorizationError");
const { playlistWithSongsCollection } = require("../resources/playlistWithSongsCollection");

class PlaylistsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songService = songsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const queryPlaylists = {
      text: `SELECT 
      "playlists"."id", 
      "playlists"."name", 
      "users"."username" 
      FROM 
      "playlists" 
      INNER JOIN 
      "users" ON "users"."id" = "playlists"."owner" 
      WHERE 
      "playlists"."owner" = $1`,
      values: [owner],
    };

    const playlists = await this._pool.query(queryPlaylists);

    return playlistsCollection(playlists.rows);
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async addPlaylistSong({ songId, playlistId }) {
    const id = `playlist-song-${nanoid(16)}`;

    await this._songService.getSongById(songId);

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylistSongsById(id) {
    const queryPlaylist = {
      text: `SELECT 
      "playlists"."id", 
      "playlists"."name", 
      "users"."username" 
      FROM 
      "playlists" 
      INNER JOIN 
      "users" ON "users"."id" = "playlists"."owner" 
      WHERE 
      "playlists"."id" = $1`,
      values: [id],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    if (!resultPlaylist.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const querySongs = {
      text: `SELECT 
      "songs"."id", 
      "songs"."title", 
      "songs"."performer" 
      FROM 
      "playlist_songs" 
      INNER JOIN 
      "songs" ON "songs"."id" = "playlist_songs"."song_id" 
      WHERE 
      "playlist_songs"."playlist_id" = $1`,
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    resultPlaylist.rows[0].songs = resultSongs.rows;

    return playlistWithSongsCollection(resultPlaylist.rows[0]);
  }

  async deletePlaylistSongById(id, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist song gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Resource yang Anda minta tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = PlaylistsService;
