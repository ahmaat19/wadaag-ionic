import { IonButton, IonContent, IonPage } from '@ionic/react'
import { style } from '../components/Style'

const Splash: React.FC = () => {
  const logo = 'assets/icon/icon.png'

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <div className='d-flex justify-content-center align-items-center flex-column h-100'>
            <div className='text-center'>
              <img src={logo} alt='logo' className='w-25 img-fluid rounded-5' />
            </div>
            <h2
              color='primary'
              className='text-center fw-light ion-text-primary fs-1 text-uppercase'
            >
              Welcome to <span className='fw-bold'>wadaag</span>
            </h2>

            <div className='position-fixed bottom-0 w-100 ion-padding'>
              <IonButton
                fill='outline'
                routerLink='/login'
                className='w-100 m-auto'
              >
                GET STARTED
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Splash
