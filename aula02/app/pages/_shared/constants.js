export const constants = {
  socketUrl: 'http://localhost:3000',
  socketNamespaces: {
    room: 'room',
    lobby: 'lobby',
  },
  events: {
    USER_CONNECTED: 'userConnection',
    USER_DISCONNECTED: 'userDisconection',
    JOIN_ROOM: 'joinRoom',
    LOBBY_UPDATED: 'lobbyUpdated',
    UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
  },
}
