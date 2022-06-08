import {
  // Redirect,
  Route,
} from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
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

const App: React.FC = () => (
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

export default App
