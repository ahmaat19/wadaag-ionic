import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Geolocation } from '@capacitor/geolocation'
import { useState } from 'react'

const Home: React.FC = () => {
  const [state, setState] = useState({
    latitude: 0,
    longitude: 0,
  })
  const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition()

    setState({
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding' color='primary'>
        <div className='container'>
          <IonButton onClick={printCurrentPosition}>Current Position</IonButton>
          <br />
          <IonButton color='success'>
            {state?.latitude}, {state?.longitude}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home
