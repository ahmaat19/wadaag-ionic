import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  useIonToast,
} from '@ionic/react'
import { call } from 'ionicons/icons'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { Storage } from '@capacitor/storage'
import { useEffect, useState } from 'react'

import useAuthHook from '../api/auth'
import { style } from '../components/Style'
// import {useForm} from 'react-hook-form'

const Login: React.FC = () => {
  const history = useHistory()
  const [mobile, setMobile] = useState<number>()
  const [present, dismiss] = useIonToast()

  const { postLogin } = useAuthHook()

  const { isLoading, isError, error, mutateAsync, isSuccess } = postLogin

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

  useEffect(() => {
    if (isSuccess) {
      history.push(`/otp`)
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
    if (mobile) {
      // @ts-ignore
      mutateAsync({ mobileNumber: mobile })
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

  if (isLoading) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <div className='d-flex justify-content-center flex-column h-100'>
            <h2 className='fw-light ion-color-primary'>LOGIN</h2>

            <form onSubmit={handleSubmit}>
              <IonItem className='bg-transparent'>
                <IonLabel position='floating'>
                  <IonIcon icon={call} color='primary' /> Mobile Number
                </IonLabel>
                <IonInput
                  value={mobile}
                  onIonChange={(e: any) => setMobile(e.detail.value)}
                  inputMode='numeric'
                  type='number'
                  autofocus
                />
              </IonItem>
              <IonButton
                type='submit'
                className='mt-4 m-auto'
                fill='outline'
                expand='block'
              >
                LOGIN
              </IonButton>
            </form>

            <div className='position-fixed bottom-0 end-0 pb-3 pe-3'>
              Don't have an account?{' '}
              <Link to='/signup' className='fw-bold text-decoration-none'>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
