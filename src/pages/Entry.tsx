import {
  IonCard,
  IonCol,
  IonContent,
  IonImg,
  IonPage,
  IonRow,
} from '@ionic/react'

const Entry: React.FC = () => {
  const ride1 = '/assets/images/ride1.svg'
  const ride2 = '/assets/images/ride2.svg'
  const driver = '/assets/images/driver.svg'

  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding' color='primary'>
        <div className='d-flex justify-content-center align-items-center flex-column h-100 text-light'>
          <h1 className='text-center display-3 fw-bold ion-color-primary'>
            How do you ride your <span className='text-warning'>WADAAG</span>?
          </h1>
          <p className='text-center'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            sequi atque quisquam fuga neque.
          </p>

          <IonRow>
            <IonCol>
              <IonCard routerLink='/' className='text-center m-0'>
                <IonImg
                  src={ride1}
                  className='img-fluid w-100 mx-auto card-image-top'
                />
                <span
                  className='text-center fw-bold'
                  style={{ color: 'purple' }}
                >
                  1<sup>st</sup> Ride
                </span>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard
                routerLink='/find-shared-ride'
                className='text-center m-0'
              >
                <IonImg
                  src={ride2}
                  className='img-fluid w-100 mx-auto card-image-top'
                />
                <span
                  className='text-center fw-bold'
                  style={{ color: 'purple' }}
                >
                  2<sup>nd</sup> Ride
                </span>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard routerLink='/profile' className='text-center m-0'>
                <IonImg
                  src={driver}
                  className='img-fluid w-100 mx-auto card-image-top'
                />
                <span
                  className='text-center fw-bold'
                  style={{ color: 'purple' }}
                >
                  Driver
                </span>
              </IonCard>
            </IonCol>
          </IonRow>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Entry
