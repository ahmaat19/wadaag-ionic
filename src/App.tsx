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
import { golfOutline, home, square } from 'ionicons/icons'
import Home from './pages/Home'
import StartTrip from './pages/StartTrip'
import Tab3 from './pages/Tab3'

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

setupIonicReact()

const App: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<boolean>()
  const [geoLocation, setGeoLocation] = useState<any>()

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

    check()
      .then((res) => {
        setGeoLocation(res.location)
      })
      .catch((err) => {
        setGeoLocation('not granted')
      })
  }, [geoLocation])

  const geoRequestPermission = async () => {
    await Geolocation.requestPermissions()
  }

  useEffect(() => {
    if (geoLocation !== 'granted') {
      geoRequestPermission()
    }
  }, [geoLocation])

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
            <Route exact path='/start-trip'>
              <StartTrip />
            </Route>
            <Route path='/tab3'>
              <Tab3 />
            </Route>
            {/* <Route exact path='/'>
            <Redirect to='/tab1' />
          </Route> */}
          </IonRouterOutlet>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='home' href='/'>
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab='StartTrip' href='/start-trip'>
              <IonIcon icon={golfOutline} />
              <IonLabel>Start Trip</IonLabel>
            </IonTabButton>
            <IonTabButton tab='tab3' href='/tab3'>
              <IonIcon icon={square} />
              <IonLabel>Tab 3</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
