import {constants} from '../../_shared/constants.js'
import LobbyController from './controller.js'
import LobbySocketBuilder from './util/lobbySocketBuilder.js'
import View from './view.js'

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/sheep_mutton_animal_avatar-512.png',
  username: 'Paulo Barros ' + Date.now(),
}

const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.lobby,
})

const dependencies = {
  socketBuilder,
  user,
  view: View,
}

await LobbyController.initialize(dependencies)
