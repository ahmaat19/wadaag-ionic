import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  useIonToast,
} from '@ionic/react'
import { mail } from 'ionicons/icons'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setUser } from '../redux/userSlice'

const OTP: React.FC = () => {
  const history = useHistory()
  const [OTP, setOTP] = useState<number>()
  const [present, dismiss] = useIonToast()

  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Number(OTP) === 1234) {
      dispatch(
        setUser({
          _id: '1',
          name: 'Ahmed Ibrahim',
          avatar: 'https://github.com/ahmaat19.png',
          userType: 'Driver',
          mobile: 123456789,
          points: 100,
          expiration: 17,
          level: 24,
          isAuth: true,
        })
      )

      setTimeout(() => {
        history.replace('/profile')
      }, 1000)
    } else {
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Invalid OTP',
        color: 'danger',
        position: 'top',
        duration: 5000,
      })
    }
  }
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
            <IonInput
              value={OTP}
              onIonChange={(e) => setOTP(e.target.value as number)}
              type='number'
              placeholder='******'
              inputMode='numeric'
            />
          </IonItem>
          <IonButton
            type='submit'
            onClick={(e) => handleSubmit(e as any)}
            color='light'
            className='w-100 mt-4'
          >
            Confirm
          </IonButton>

          <div className='position-fixed bottom-0 w-100 ion-padding'>
            <Link
              to='/signup'
              className='fw-bold fs-5 float-end text-light text-decoration-none'
            >
              Sign Up
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default OTP
