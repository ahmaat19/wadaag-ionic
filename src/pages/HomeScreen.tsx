import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react'
import { personCircle } from 'ionicons/icons'
import { style } from '../components/Style'

const HomeScreen: React.FC = () => {
  return (
    <IonPage>
      <IonHeader collapse='fade' translucent className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/' />
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton routerLink='/profile'>
              <IonIcon slot='icon-only' icon={personCircle} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <div className='d-flex justify-content-center flex-column h-100 '>
            <IonRow>
              <IonCol
                size='10'
                style={{ width: '200px', height: '200px' }}
                className='mx-auto'
              >
                <IonCard
                  routerLink='/rider-one-screen'
                  className='text-center bg-transparent shadow-lg mx-auto d-flex justify-content-center align-items-center'
                  style={{ width: '60%', height: '80%' }}
                >
                  <IonLabel className='fs-3 fw-light'>FIRST RIDE</IonLabel>
                </IonCard>
              </IonCol>
              <IonCol
                size='10'
                style={{ width: '200px', height: '200px' }}
                className='mx-auto'
              >
                <IonCard
                  routerLink='/rider-two-screen'
                  className='text-center bg-transparent shadow-lg mx-auto d-flex justify-content-center align-items-center'
                  style={{ width: '60%', height: '80%' }}
                >
                  <IonLabel className='fs-3 fw-light'>SECOND RIDE</IonLabel>
                </IonCard>
              </IonCol>
            </IonRow>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default HomeScreen
