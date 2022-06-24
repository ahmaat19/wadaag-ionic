import {
  IonCard,
  IonCol,
  IonContent,
  IonLabel,
  IonPage,
  IonRow,
} from '@ionic/react'
import Header from '../components/Header'
import { style } from '../components/Style'

const HomeScreen: React.FC = () => {
  return (
    <IonPage>
      <Header profile={true} nativeBack={true} />
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
                  className='text-center bg-transparents shadow-lg mx-auto d-flex justify-content-center align-items-center'
                  style={{ width: '60%', height: '80%', ...style.bg_purple }}
                >
                  <IonLabel className='fs-5 fw-light'>FIRST RIDE</IonLabel>
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
                  <IonLabel className='fs-5 fw-light'>SECOND RIDE</IonLabel>
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
