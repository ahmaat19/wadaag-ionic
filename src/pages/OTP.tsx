import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
} from '@ionic/react'
import { mail } from 'ionicons/icons'

const OTP: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        <div className='d-flex justify-content-center align-items-center flex-column h-100 text-light'>
          <h1 className='text-center display-4 fw-bold ion-color-primary'>
            OTP Confirmation
          </h1>
          <p className='text-center'>
            We sent you an OTP on your registered mobile number. Please enter
            the OTP
          </p>

          <IonItem className='w-100 rounded-3'>
            <IonIcon slot='start' icon={mail} color='primary' />
            <IonInput type='number' placeholder='******' />
          </IonItem>
          <IonButton color='light' routerLink='/entry' className='w-100 mt-4'>
            Confirm
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

export default OTP
