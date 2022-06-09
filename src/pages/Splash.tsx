import { IonButton, IonContent, IonPage } from '@ionic/react'

const Splash: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        <div className='d-flex justify-content-center align-items-center flex-column h-100 text-light'>
          <h1 className='text-center display-4 fw-bold ion-color-primary'>
            Welcome to <span className='text-warning'>WADAAG</span> Ride Sharing
          </h1>
          <p className='text-center'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            sequi atque quisquam fuga neque.
          </p>

          <div className='position-fixed bottom-0 w-100 ion-padding'>
            <IonButton routerLink='/login' color='light' className='w-100'>
              Log In
            </IonButton>
            <IonButton routerLink='/signup' color='light' className='w-100'>
              Sign Up
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Splash
