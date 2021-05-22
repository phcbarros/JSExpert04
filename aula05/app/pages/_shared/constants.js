export const constants = {
  socketUrl: 'http://localhost:3000',
  socketNamespaces: {
    room: 'room',
    lobby: 'lobby',
  },
  peerConfig: Object.values({
    id: undefined,
    // config: {
    //     port: 9000,
    //     host: 'localhost',
    //     path: '/'
    // }
  }),
  pages: {
    lobby: '/pages/lobby',
    login: '/pages/login',
  },
  events: {
    USER_CONNECTED: 'userConnection',
    USER_DISCONNECTED: 'userDisconnection',

    JOIN_ROOM: 'joinRoom',
    LOBBY_UPDATED: 'lobbyUpdated',
    UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
    SPEAK_REQUEST: 'speakRequest',
    SPEAK_ANSWER: 'speakAnswer',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyBVnTsFiN0d1b3VgBC6UYFcdAX5cVx4ihs',
    authDomain: 'semana-js-expert-04-7a90d.firebaseapp.com',
    projectId: 'semana-js-expert-04-7a90d',
    storageBucket: 'semana-js-expert-04-7a90d.appspot.com',
    messagingSenderId: '639868064100',
    appId: '1:639868064100:web:4863835367a2b5a81aaa71',
    measurementId: 'G-RGJ9RYM8QG',
  },
  storageKey: 'jsexpert:storage:key',
}
