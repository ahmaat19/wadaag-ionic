import { Redirect, Route } from 'react-router-dom'

import { Network } from '@capacitor/network'
import { Geolocation } from '@capacitor/geolocation'
import { useEffect, useState } from 'react'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonButton,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { car, golf, home, person } from 'ionicons/icons'
import StartTrip from './pages/StartTrip'
import Entry from './pages/Entry'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import Login from './pages/Login'
import Splash from './pages/Splash'
import OTP from './pages/OTP'
import Profile from './pages/Profile'
import SignUp from './pages/Signup'
import FindSharedRide from './pages/FindSharedRide'
import ProtectedRoute from './components/PotectedRoute'
import { useDispatch } from 'react-redux'
import PublicRoute from './components/PublicRoute'
import { Storage } from '@capacitor/storage'
import { setUser } from './redux/userSlice'
import Chat from './pages/Chat'

setupIonicReact()

const App: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<boolean>(true)
  const dispatch = useDispatch()

  Network.addListener('networkStatusChange', (status) => {
    setNetworkStatus(status.connected)
  })

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus()
    setNetworkStatus(status.connected)
  }

  useEffect(() => {
    logCurrentNetworkStatus()
  }, [networkStatus])

  useEffect(() => {
    const check = async () => {
      const status = await Geolocation.checkPermissions()
      return status
    }

    const checkPermissions = async () => {
      const status = await check()
      if (status.location !== 'granted') {
        await Geolocation.requestPermissions()
      }
    }
    checkPermissions()
  }, [])

  if (!networkStatus) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
        className='ion-text-center ion-padding text-light'
      >
        <IonButton expand='block' color='danger'>
          No network connection
        </IonButton>

        <h1>No internet connection</h1>
        <IonLabel>
          Please check your internet connection and try again.
        </IonLabel>
      </div>
    )
  }

  const getAuth = async () => {
    const { value } = await Storage.get({ key: 'auth' })
    const res = JSON.parse(value as string)

    return res
  }
  getAuth().then((res) => {
    if (res) {
      dispatch(setUser(res))
    }
  })

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <ProtectedRoute exact component={Entry} path='/home' />
            <ProtectedRoute exact component={StartTrip} path='/trip' />
            <ProtectedRoute exact component={FindSharedRide} path='/search' />
            <ProtectedRoute exact component={Profile} path='/profile' />
            <ProtectedRoute exact component={Chat} path='/chat/:id' />

            <Route exact path='/'>
              <Redirect to='/home' />
            </Route>

            <PublicRoute exact component={Login} path='/login' />
            <PublicRoute exact component={Splash} path='/splash' />
            <PublicRoute exact component={OTP} path='/otp' />
            <PublicRoute exact component={SignUp} path='/signup' />
          </IonRouterOutlet>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='entry' href='/home'>
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab='trip' href='/trip'>
              <IonIcon icon={golf} />
              <IonLabel>Start Trip</IonLabel>
            </IonTabButton>

            <IonTabButton tab='search' href='/search'>
              <IonIcon icon={car} />
              <IonLabel>Ride</IonLabel>
            </IonTabButton>

            <IonTabButton tab='profile' href='/profile'>
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
