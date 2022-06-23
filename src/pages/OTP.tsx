import {
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  useIonToast,
} from '@ionic/react'
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setUser } from '../redux/userSlice'
import useAuthHook from '../api/auth'
import { style } from '../components/Style'

const OTP: React.FC = () => {
  const history = useHistory()
  const [one, setOne] = useState<number>()
  const [two, setTwo] = useState<number>()
  const [three, setThree] = useState<number>()
  const [four, setFour] = useState<number>()

  const [present, dismiss] = useIonToast()

  const { postOTP } = useAuthHook()

  const { isLoading, isError, error, mutateAsync, isSuccess, data } = postOTP

  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setUser({
          _id: data._id,
          name: data.name,
          avatar: data.avatar,
          userType: data.userType,
          mobile: data.mobile,
          points: data.points,
          expiration: data.expiration,
          level: data.level,
          isAuth: true,
          token: data.token,
        })
      )
      setTimeout(() => {
        history.replace('/home')
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: error as string,
        color: 'danger',
        position: 'top',
        duration: 5000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  useEffect(() => {
    if (one && two && three && four) {
      mutateAsync({ otp: `${one}${two}${three}${four}` } as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four])

  if (isLoading) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <div className='d-flex justify-content-center flex-column h-100'>
            <div>
              <h2 className='fw-light ion-color-primary'> OTP VERIFICATION</h2>
              <IonLabel>
                We have sent the OTP verification to your mobile number
              </IonLabel>

              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonInput
                      inputMode='numeric'
                      value={one}
                      onIonChange={(e: any) => setOne(e.detail.value!)}
                      className='border text-center'
                    />
                  </IonCol>
                  <IonCol>
                    <IonInput
                      inputMode='numeric'
                      value={two}
                      onIonChange={(e: any) => setTwo(e.detail.value!)}
                      className='border text-center'
                      autofocus
                    />
                  </IonCol>
                  <IonCol>
                    <IonInput
                      inputMode='numeric'
                      value={three}
                      onIonChange={(e: any) => setThree(e.detail.value!)}
                      className='border text-center'
                    />
                  </IonCol>
                  <IonCol>
                    <IonInput
                      inputMode='numeric'
                      value={four}
                      onIonChange={(e: any) => setFour(e.detail.value!)}
                      className='border text-center'
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default OTP
