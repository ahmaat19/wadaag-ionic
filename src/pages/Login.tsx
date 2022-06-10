import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  useIonToast,
} from '@ionic/react'
import { call } from 'ionicons/icons'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { Storage } from '@capacitor/storage'
import { useEffect, useState } from 'react'

const Login: React.FC = () => {
  const history = useHistory()
  const [mobile, setMobile] = useState<number>()
  const [present, dismiss] = useIonToast()

  const getAuth = async () => {
    const { value } = await Storage.get({ key: 'auth' })
    return JSON.parse(value as string)
  }

  useEffect(() => {
    getAuth()
      .then((auth) => {
        if (auth) return history.replace('/profile')
      })
      .catch((err) => {
        console.log(err)
      })
  }, [history])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Number(mobile) === 123456) {
      history.replace('/otp')
    } else {
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Invalid Mobile Number',
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
            Login
          </h1>
          <p className='text-center'>
            Please login with your mobile number if you have an account.
          </p>

          <IonItem className='w-100 rounded-3'>
            <IonIcon slot='start' icon={call} color='primary' />
            <IonInput
              value={mobile}
              onIonChange={(e) => setMobile(e.target.value as number)}
              inputMode='numeric'
              type='number'
              placeholder='e.g. 615301507'
            />
          </IonItem>
          <IonButton
            type='submit'
            onClick={(e) => handleSubmit(e as any)}
            color='light'
            className='w-100 mt-4'
          >
            Login
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

export default Login
