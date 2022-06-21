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
  IonPage,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { chatbubbleEllipses, home, person } from 'ionicons/icons'

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
import HomeScreen from './pages/HomeScreen'
import RiderOneScreen from './pages/RiderOneScreen'
import RiderTwoScreen from './pages/RiderTwoScreen'
import RideWaiting from './pages/RideWaiting'

import { LocalNotifications } from '@capacitor/local-notifications'

import { RootState } from './redux/store'
import { io } from 'socket.io-client'
import { defaultUrl } from './config/url'
import Chat from './pages/Chat'
import { setChat } from './redux/chatSlice'
import ChatInfo from './pages/ChatInfo'

setupIonicReact()

let socket = io(defaultUrl)

const App: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<boolean>(true)
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user._id)

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
    const checkPermissions = async () => {
      const status = await Geolocation.checkPermissions()
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

  const notification = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'New Notification',
          body: 'You have a ride request',
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
    socket.on(`${user.toString()}1`, async (data) => {
      notification()
      dispatch(
        setChat({
          _id: data._id,
          riderOneId: data.riderOneId,
          riderOneName: data.riderOneName,
          riderOneAvatar: data.riderOneAvatar,
          riderOneMobile: data.riderOneMobile,

          riderTwoId: data.riderTwoId,
          riderTwoName: data.riderTwoName,
          riderTwoAvatar: data.riderTwoAvatar,
          riderTwoMobile: data.riderTwoMobile,

          price: data.price,
          message: data.message,
          createdAt: data.createdAt,
        })
      )

      return null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    socket.on(`${user.toString()}2`, async (data) => {
      notification()
      dispatch(
        setChat({
          _id: data._id,
          riderOneId: data.riderOneId,
          riderOneName: data.riderOneName,
          riderOneAvatar: data.riderOneAvatar,
          riderOneMobile: data.riderOneMobile,

          riderTwoId: data.riderTwoId,
          riderTwoName: data.riderTwoName,
          riderTwoAvatar: data.riderTwoAvatar,
          riderTwoMobile: data.riderTwoMobile,

          price: data.price,
          message: data.message,
          createdAt: data.createdAt,
        })
      )

      return null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    socket.on(`${user.toString()}message1`, async (data) => {
      notification()
      dispatch(
        setChat({
          _id: data._id,
          riderOneId: data.riderOneId,
          riderOneName: data.riderOneName,
          riderOneAvatar: data.riderOneAvatar,
          riderOneMobile: data.riderOneMobile,

          riderTwoId: data.riderTwoId,
          riderTwoName: data.riderTwoName,
          riderTwoAvatar: data.riderTwoAvatar,
          riderTwoMobile: data.riderTwoMobile,

          price: data.price,
          message: data.message,
          createdAt: data.createdAt,
        })
      )

      return null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    socket.on(`${user.toString()}message2`, async (data) => {
      notification()
      dispatch(
        setChat({
          _id: data._id,
          riderOneId: data.riderOneId,
          riderOneName: data.riderOneName,
          riderOneAvatar: data.riderOneAvatar,
          riderOneMobile: data.riderOneMobile,

          riderTwoId: data.riderTwoId,
          riderTwoName: data.riderTwoName,
          riderTwoAvatar: data.riderTwoAvatar,
          riderTwoMobile: data.riderTwoMobile,

          price: data.price,
          message: data.message,
          createdAt: data.createdAt,
        })
      )

      return null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!networkStatus) {
    return (
      <IonApp>
        <IonPage>
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
        </IonPage>
      </IonApp>
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
            <ProtectedRoute exact component={Chat} path='/chat' />
            <ProtectedRoute exact component={Profile} path='/profile' />
            <ProtectedRoute
              exact
              component={ChatInfo}
              path='/chat/:id/details'
            />
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

            <IonTabButton tab='chat' href='/chat'>
              <IonIcon icon={chatbubbleEllipses} />
              <IonLabel>Chat</IonLabel>
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
