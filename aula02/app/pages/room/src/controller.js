import {constants} from '../../_shared/constants.js'
import Attendee from './entities/attendee.js'

export default class RoomController {
  constructor({roomInfo, socketBuilder, view}) {
    this.roomInfo = roomInfo
    this.socketBuilder = socketBuilder
    this.view = view
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize()
  }

  async _initialize() {
    this._setupViewEvents()
    const socket = this._setupSocket()

    socket.emit(constants.events.JOIN_ROOM, this.roomInfo)
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user)
    this.view.updateRoomTopic(this.roomInfo.room)
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .build()
  }

  onUserProfileUpgrade() {
    return (data) => {
      const attendee = new Attendee(data)
      console.log(`${attendee.id} onUserProfileUpgrade!`)
      if (attendee.isSpeaker) {
        this.view.addAttendeeOnGrid(attendee, true)
      }
    }
  }

  onUserConnected() {
    return (data) => {
      const attendee = new Attendee(data)
      console.log('user connected', attendee)
      this.view.addAttendeeOnGrid(attendee)
    }
  }

  onUserDisconnected() {
    return (data) => {
      const attendee = new Attendee(data)
      this.view.removeItemFromGrid(attendee.id)
      console.log(`${attendee.username} disconnected!`)
    }
  }

  onRoomUpdated() {
    return (room) => {
      this.view.updateAttendeesOnGrid(room)
      console.log('room list', room)
    }
  }
}
