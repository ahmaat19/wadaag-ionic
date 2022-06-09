import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
} from '@ionic/react'
import { call } from 'ionicons/icons'

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        <div className='d-flex justify-content-center align-items-center flex-column h-100 text-light'>
          <h1 className='text-center display-4 fw-bold ion-color-primary'>
            Login
          </h1>
          <p className='text-center'>
            Please login with your mobile number if you have an account.
          </p>

          <IonItem className='w-100 rounded-3'>
            <IonIcon slot='start' icon={call} color='primary' />
            <IonInput type='number' placeholder='e.g. 615301507' />
          </IonItem>
          <IonButton color='light' routerLink='/otp' className='w-100 mt-4'>
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
