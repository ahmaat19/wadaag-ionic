import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from '@ionic/react'
import { call } from 'ionicons/icons'

const Login: React.FC = () => {
  const ride1 = '/assets/images/ride1.svg'
  const ride2 = '/assets/images/ride2.svg'
  const driver = '/assets/images/driver.svg'

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className='d-flex justify-content-center align-items-center flex-column h-100 text-light ion-padding'
          style={{
            backgroundColor: 'purple',
            // clipPath: 'polygon(0 1%, 100% 0, 0 41%, 0 15%);',
          }}
        >
          <h1 className='text-center display-4 fw-bold ion-color-primary ion-padding'>
            Login
          </h1>
          <p className='text-center ion-padding'>
            Please login with your mobile number if you have an account.
          </p>

          <IonItem className='w-100'>
            <IonIcon slot='start' icon={call} color='primary' />
            <IonInput type='text' placeholder='e.g. 615301507' />
          </IonItem>
          <IonButton routerLink='/entry' className='w-100'>
            Login
          </IonButton>

          <div className='position-fixed bottom-0 w-100 ion-padding'>
            <IonButton routerLink='/signup' color='light' className='w-100'>
              Sign Up
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
