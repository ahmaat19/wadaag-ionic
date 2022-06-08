import { IonButton, IonContent, IonImg, IonLabel, IonPage } from '@ionic/react'

const Splash: React.FC = () => {
  const ride1 = '/assets/images/ride1.svg'
  const ride2 = '/assets/images/ride2.svg'
  const driver = '/assets/images/driver.svg'

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className='d-flex justify-content-center align-items-center flex-column h-100 text-light'
          style={{
            backgroundColor: 'purple',
          }}
        >
          <h1 className='text-center display-4 fw-bold ion-color-primary ion-padding'>
            Welcome to <span className='text-warning'>WADAAG</span> Ride Sharing
          </h1>
          <p className='text-center ion-padding'>
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
