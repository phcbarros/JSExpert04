import {constants} from '../../_shared/constants.js'
import UserDb from '../../_shared/userDb.js'

function redirectToLobby() {
  window.location = constants.pages.lobby
}

function onLoginWithRedirectResult({provider, firebase}) {
  return () => {
    try {
      firebase.auth().signInWithRedirect(provider)
    } catch (error) {
      alert(JSON.stringify(error))
      console.log('error', error)
    }
  }
}

function onLoginWithRedirect({firebase}) {
  return async () => {
    try {
      const result = await firebase.auth().getRedirectResult()
      const {user} = result
      const userData = {
        img: user.photoURL,
        username: user.displayName,
      }

      UserDb.insert(userData)
      redirectToLobby()
    } catch (error) {
      alert(JSON.stringify(error))
      console.log('error', error)
    }
  }
}

function onLoginWithPopup({provider, firebase}) {
  return async () => {
    try {
      const result = await firebase.auth().signInWithPopup(provider)
      const {user} = result
      const userData = {
        img: user.photoURL,
        username: user.displayName,
      }

      UserDb.insert(userData)
      redirectToLobby()
    } catch (error) {
      alert(JSON.stringify(error))
      console.log('error', error)
    }
  }
}

const currentUser = UserDb.get()
if (Object.keys(currentUser).length) {
  redirectToLobby()
}

const {firebaseConfig} = constants
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

const provider = new firebase.auth.GithubAuthProvider()
provider.addScope('read:user')

const btnLogin = document.getElementById('btnLogin')
// Login withPopup
btnLogin.addEventListener('click', onLoginWithPopup({provider, firebase}))

// Login with Redirect
//btnLogin.addEventListener('click', onLoginWithRedirect({firebase}))
//onLoginWithRedirectResult({provider, firebase})
