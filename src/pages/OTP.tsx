import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLoading,
  IonPage,
  useIonToast,
} from '@ionic/react'
import { mail } from 'ionicons/icons'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setUser } from '../redux/userSlice'
import useAuthHook from '../api/auth'

const OTP: React.FC = () => {
  const history = useHistory()
  const [OTP, setOTP] = useState<number>()
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (OTP) {
      // @ts-ignore
      mutateAsync({ otp: OTP })
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

  if (isLoading) {
    return <IonLoading isOpen={true} message={'Loading...'} />
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

          <form onSubmit={handleSubmit} className='w-100 '>
            <IonItem className='rounded-3'>
              <IonIcon slot='start' icon={mail} color='primary' />
              <IonInput
                value={OTP}
                onIonChange={(e) => setOTP(e.target.value as number)}
                type='number'
                placeholder='******'
                inputMode='numeric'
              />
            </IonItem>
            <IonButton type='submit' color='light' className='w-100 mt-4'>
              Confirm
            </IonButton>
          </form>

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
