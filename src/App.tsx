import {
  // Redirect,
  Route,
} from 'react-router-dom'
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
import { golfOutline, home, person, square } from 'ionicons/icons'
import Home from './pages/Home'
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

setupIonicReact()

const App: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<boolean>()

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
        className='ion-text-center ion-padding'
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

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/start-trip'>
              <StartTrip />
            </Route>
            <Route path='/entry'>
              <Entry />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/splash'>
              <Splash />
            </Route>
            <Route path='/otp'>
              <OTP />
            </Route>
            <Route path='/profile'>
              <Profile />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='Home' href='/'>
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab='StartTrip' href='/start-trip'>
              <IonIcon icon={golfOutline} />
              <IonLabel>Start Trip</IonLabel>
            </IonTabButton>

            <IonTabButton tab='Splash' href='/splash'>
              <IonIcon icon={square} />
              <IonLabel>Splash</IonLabel>
            </IonTabButton>
            <IonTabButton tab='Profile' href='/profile'>
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
