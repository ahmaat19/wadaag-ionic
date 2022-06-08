import { IonContent, IonImg, IonPage } from '@ionic/react'

const Entry: React.FC = () => {
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
            // clipPath: 'polygon(0 1%, 100% 0, 0 41%, 0 15%);',
          }}
        >
          <h1 className='text-center display-3 fw-bold ion-color-primary ion-padding'>
            How do you ride your <span className='text-warning'>WADAAG</span>?
          </h1>
          <p className='text-center ion-padding'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            sequi atque quisquam fuga neque.
          </p>

          <div className='row ion-padding'>
            <div className='col-4'>
              <div className='card border-0 shadow p-2'>
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
              </div>
            </div>
            <div className='col-4'>
              <div className='card border-0 shadow p-2'>
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
              </div>
            </div>
            <div className='col-4'>
              <div className='card border-0 shadow p-2'>
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
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Entry
