import {constants} from '../../_shared/constants.js'
import RoomSocketBuilder from '../util/roomSocket.js'

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
})

const socket = socketBuilder
  .setOnUserConnected((user) => console.log('user connected', user))
  .setOnUserDisconnected((user) => console.log('user disconnected', user))
  .setOnRoomUpdated((room) => console.log('room list', room))
  .build()

const room = {
  id: '0001',
  topic: 'JS Expert',
}

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/sheep_mutton_animal_avatar-512.png',
  username: 'Paulo Barros ' + Date.now(),
}

socket.emit(constants.events.JOIN_ROOM, {
  user,
  room,
})
