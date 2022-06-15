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
import ProtectedRoute from './components/PotectedRoute'
import { useDispatch, useSelector } from 'react-redux'
import PublicRoute from './components/PublicRoute'
import { Storage } from '@capacitor/storage'
import { setUser } from './redux/userSlice'
import Chat from './pages/Chat'
import HomeScreen from './pages/HomeScreen'
import RiderOneScreen from './pages/RiderOneScreen'
import RiderTwoScreen from './pages/RiderTwoScreen'
import RideWaiting from './pages/RideWaiting'

import { LocalNotifications } from '@capacitor/local-notifications'
import { RootState } from './redux/store'
import { io } from 'socket.io-client'

setupIonicReact()

let socket = io('http://192.10.11.100:3000')

const App: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<boolean>(true)
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user._id)
  const [response, setResponse] = useState<any>()

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

  useEffect(() => {
    async function init() {
      await LocalNotifications.requestPermissions()
    }

    init()
  }, [])

  const notification = async (d: string) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Ride Request',
          body: `${d} is requesting a ride`,
          id: 1,
          extra: {
            data: 'Press to open',
          },
          iconColor: '#f194ff',
        },
      ],
    })
  }

  useEffect(() => {
    socket.on('response-ride-request', async (data) => {
      if (data.riderTwo === user) {
        console.log('THis is the one')
        notification(data[0].riderTwo)
      }
      return data
      // console.log({ r: data[0].riderTwo, user: user })
    })

    // assign a cont and check thatn one is not already assigned
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
            <ProtectedRoute exact component={HomeScreen} path='/home' />
            <ProtectedRoute
              exact
              component={RiderOneScreen}
              path='/rider-one-screen'
            />
            <ProtectedRoute
              exact
              component={RiderTwoScreen}
              path='/rider-two-screen'
            />
            <ProtectedRoute exact component={Profile} path='/profile' />
            <ProtectedRoute exact component={Chat} path='/chat/:id' />
            <ProtectedRoute
              exact
              component={RideWaiting}
              path='/ride-waiting'
            />

            <Route exact path='/'>
              <Redirect to='/home' />
            </Route>

            <PublicRoute exact component={Login} path='/login' />
            <PublicRoute exact component={Splash} path='/splash' />
            <PublicRoute exact component={OTP} path='/otp' />
            <PublicRoute exact component={SignUp} path='/signup' />
          </IonRouterOutlet>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='home' href='/home'>
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab='riderOne' href='/rider-one-screen'>
              <IonIcon icon={golf} />
              <IonLabel>Rider One</IonLabel>
            </IonTabButton>

            <IonTabButton tab='riderTwo' href='/rider-two-screen'>
              <IonIcon icon={car} />
              <IonLabel>Rider Two</IonLabel>
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
