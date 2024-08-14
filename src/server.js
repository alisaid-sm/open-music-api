require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require('@hapi/jwt');

const ClientError = require("./exceptions/ClientError");
const AlbumsService = require("./services/AlbumsServices");
const albums = require("./api/albums");
const AlbumsValidator = require("./validator/albums");
const SongsService = require("./services/SongsServices");
const songs = require("./api/songs");
const SongsValidator = require("./validator/songs");
const UsersService = require("./services/UsersServices");
const users = require("./api/users");
const UsersValidator = require("./validator/users");
const AuthenticationsService = require("./services/AuthenticationsService");
const authentications = require("./api/authentications");
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require("./tokenize/TokenManager");
const PlaylistsService = require("./services/PlaylistsServices");
const playlists = require("./api/playlists");
const PlaylistsValidator = require("./validator/playlists");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistsService(songsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('open_music_app_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistsValidator,
      },
    },
  ]);

  await server.start();

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    } else if (response instanceof Error) {
      console.log(response);
    }

    return h.continue;
  });

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
