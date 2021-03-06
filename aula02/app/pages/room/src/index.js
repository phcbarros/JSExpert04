import {constants} from '../../_shared/constants.js'
import RoomSocketBuilder from './util/roomSocket.js'
import RoomController from './controller.js'
import View from './view.js'

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
})

const urlParams = new URLSearchParams(window.location.search)
const keys = ['id', 'topic']

const urlData = keys.map((key) => [key, urlParams.get(key)])

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/sheep_mutton_animal_avatar-512.png',
  username: 'Paulo Barros ' + Date.now(),
}

const roomInfo = {
  room: {...Object.fromEntries(urlData)},
  user,
}

const dependencies = {
  view: View,
  socketBuilder,
  roomInfo,
}

const roomController = RoomController.initialize(dependencies)
