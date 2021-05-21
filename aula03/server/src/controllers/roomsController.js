import Attendee from '../entities/attendee.js'
import Room from '../entities/room.js'
import {constants} from '../util/constants.js'
import CustomMap from '../util/customMap.js'

export default class RoomsController {
  #users = new Map()
  constructor({roomsPubSub}) {
    this.roomsPubSub = roomsPubSub
    this.rooms = new CustomMap({
      observer: this.#roomObserver(),
      customMapper: this.#mapRoom.bind(this),
    })
  }

  #roomObserver() {
    return {
      notify: (rooms) => this.notifyRoomSubscribers(rooms),
    }
  }

  notifyRoomSubscribers(rooms) {
    const event = constants.event.LOBBY_UPDATED
    this.roomsPubSub.emit(event, [...rooms.values()])
  }

  onNewConnection(socket) {
    const {id} = socket
    console.log('connection stablished', id)

    this.#updateGlobarUserData(id)
  }

  disconnect(socket) {
    console.log('disconnect!', socket.id)
    this.#logoutUser(socket)
  }

  #logoutUser(socket) {
    const userId = socket.id
    const user = this.#users.get(userId)
    const roomId = user.roomId

    // remover user da lista de usuários ativos
    this.#users.delete(userId)

    // caso seja um usuário sujeiro que estava em uma sala que não existe mais
    if (!this.rooms.has(roomId)) {
      return
    }

    const room = this.rooms.get(roomId)
    const toBeRemoved = [...room.users].find(({id}) => id === userId)

    // removemos o usuário da sala
    room.users.delete(toBeRemoved)

    // se não tiver mais nenhum usuário na sala, matamos a sala
    if (!room.users.size) {
      this.rooms.delete(roomId)
      return
    }

    const disconnectedUserWasAnOnwer = userId === room.owner.id
    const onlyOneUserLeft = room.users.size === 1

    // validar se tem somente um usuário ou se o usuário era o dono da sala
    if (onlyOneUserLeft || disconnectedUserWasAnOnwer) {
      console.log('aqui')
      room.owner = this.#getNewRoomOnwer(room, socket)
    }

    // atualiza a sala com o usuário removido
    this.rooms.set(roomId, room)

    // notifica a sala que o usuário se desconectou
    socket.to(roomId).emit(constants.event.USER_DISCONNECTED, user)
  }

  #notifyUserProfileUpgrade(socket, roomId, user) {
    socket.to(roomId).emit(constants.event.UPGRADE_USER_PERMISSION, user)
  }

  #getNewRoomOnwer(room, socket) {
    const users = [...room.users.values()]
    const activeSpeakers = users.find((user) => user.isSpeaker)
    // se quem desconectou era o dono passa a liderança para o próximo
    // se não houver speakers ele pega o atttendee mais antigo (primeira posição)
    const [newOwner] = activeSpeakers ? [activeSpeakers] : users
    newOwner.isSpeaker = true

    const outdatedUser = this.#users.get(newOwner.id)
    const updatedUser = new Attendee({
      ...outdatedUser,
      ...newOwner,
    })

    this.#users.set(newOwner.id, updatedUser)

    this.#notifyUserProfileUpgrade(socket, room.id, newOwner)

    return newOwner
  }

  joinRoom(socket, {user, room}) {
    user.id = socket.id
    const userId = user.id
    const roomId = room.id

    const updatedUserData = this.#updateGlobarUserData(userId, user, roomId)
    const updatedRoom = this.#joinUserRoom(socket, updatedUserData, room)
    console.log(updatedRoom)

    this.#notifyUsersOnRoom(socket, roomId, updatedUserData)
    this.#replyWithActiveUsers(socket, updatedRoom.users)
  }

  #replyWithActiveUsers(socket, users) {
    const event = constants.event.LOBBY_UPDATED
    socket.emit(event, [...users.values()])
  }
  #notifyUsersOnRoom(socket, roomId, user) {
    const event = constants.event.USER_CONNECTED
    socket.to(roomId).emit(event, user)
  }

  #joinUserRoom(socket, user, room) {
    const roomId = room.id
    const existingRoom = this.rooms.has(roomId)
    const currentRoom = existingRoom ? this.rooms.get(roomId) : {}
    const currentUser = new Attendee({
      ...user,
      roomId,
    })

    // definir quem é o dono da sala
    const [owner, users] = existingRoom
      ? [currentRoom.owner, currentRoom.users]
      : [currentUser, new Set()]

    const updatedRoom = this.#mapRoom({
      ...currentRoom,
      ...room,
      owner,
      users: new Set([...users, ...[currentUser]]),
    })

    this.rooms.set(roomId, updatedRoom)

    socket.join(roomId)

    return this.rooms.get(roomId)
  }

  #mapRoom(room) {
    const users = [...room.users.values()]
    const speakersCount = users.filter((user) => user.isSpeaker).length
    const featuredAttendees = users.slice(0, 3)

    const mappedRoom = new Room({
      ...room,
      featuredAttendees,
      speakersCount,
      attendeesCount: room.users.size,
    })

    return mappedRoom
  }

  #updateGlobarUserData(userId, userData = {}, roomId = '') {
    const user = this.#users.get(userId) ?? {}
    const existingRoom = this.rooms.has(roomId)

    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // ser for o único na sala
      isSpeaker: !existingRoom,
    })

    this.#users.set(userId, updatedUserData)

    return this.#users.get(userId)
  }

  getEvents() {
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fn) => fn !== 'constructor')
      .map((name) => [name, this[name].bind(this)])

    return new Map(functions)
  }
}
