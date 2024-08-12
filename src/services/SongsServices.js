const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { songResource } = require("../resources/songResource");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    const optQuery = [];
    const values = [];

    if (performer) {
      optQuery.push(`performer ILIKE $${values.length + 1}`)
      values.push('%'+performer.toLowerCase()+'%');
    }

    if (title) {
      optQuery.push(`title ILIKE $${values.length + 1}`)
      values.push('%'+title.toLowerCase()+'%');
    }

    const query = {
      text: `SELECT * FROM songs ${values.length > 0 ? `WHERE ${optQuery.join(" AND ")}` : ""}`,
      values,
    };

    const result = await this._pool.query(query);

    return result.rows.map(songResource);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updateValues = [id, title, year, genre, performer];
    const optionalQuery = [];

    if (duration) {
      optionalQuery.push(`duration = $${updateValues.length + 1}`)
      updateValues.push(duration);
    }

    if (albumId) {
      optionalQuery.push(`albumId = $${updateValues.length + 1}`)
      updateValues.push(albumId);
    }

    const query = {
      text: `UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, ${optionalQuery.join(", ")} WHERE id = $1 RETURNING id`,
      values: updateValues,
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongsService;
