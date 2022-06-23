import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRadio,
  IonRadioGroup,
  useIonToast,
} from '@ionic/react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { Storage } from '@capacitor/storage'
import useAuthHook from '../api/auth'
import { style } from '../components/Style'

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [mobile, setMobile] = useState<any>('')
  const [plate, setPlate] = useState<string>('')
  const [license, setLicense] = useState<string>('')
  const [selected, setSelected] = useState<string>('rider')
  const [present, dismiss] = useIonToast()

  const { postUser } = useAuthHook()

  const { isLoading, isError, error, mutateAsync, isSuccess } = postUser

  const history = useHistory()

  useEffect(() => {
    if (isSuccess) {
      history.push('/otp')
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

  if (isLoading) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // @ts-ignore
    mutateAsync({ name, mobile, plate, license, selected })
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <div className='d-flex justify-content-center flex-column h-100'>
            <h2 className='fw-light ion-color-primary'>SIGNUP</h2>

            <form onSubmit={handleSubmit}>
              <IonList className='bg-transparent'>
                <IonRadioGroup
                  value={selected}
                  onIonChange={(e) => setSelected(e.detail.value!)}
                >
                  <IonItem className='bg-transparent'>
                    <IonLabel>Rider</IonLabel>
                    <IonRadio slot='end' value='rider' />
                  </IonItem>

                  <IonItem className='bg-transparent'>
                    <IonLabel>Driver</IonLabel>
                    <IonRadio slot='end' value='driver' />
                  </IonItem>
                </IonRadioGroup>

                <IonItem className='bg-transparent'>
                  <IonLabel position='floating'>Name</IonLabel>
                  <IonInput
                    value={name}
                    onIonChange={(e) => setName(e.detail.value!)}
                    inputMode='text'
                    type='text'
                    autofocus
                  />
                </IonItem>

                <IonItem className='bg-transparent'>
                  <IonLabel position='floating'>Mobile</IonLabel>
                  <IonInput
                    value={mobile}
                    onIonChange={(e) => setMobile(e.detail.value!)}
                    inputMode='numeric'
                    type='number'
                  />
                </IonItem>

                {selected === 'driver' && (
                  <>
                    <IonItem className='bg-transparent'>
                      <IonLabel position='floating'>Plate</IonLabel>
                      <IonInput
                        value={plate}
                        onIonChange={(e) => setPlate(e.detail.value!)}
                        inputMode='text'
                        type='text'
                      />
                    </IonItem>
                    <IonItem className='bg-transparent'>
                      <IonLabel position='floating'>License</IonLabel>
                      <IonInput
                        value={license}
                        onIonChange={(e) => setLicense(e.detail.value!)}
                        inputMode='text'
                        type='text'
                      />
                    </IonItem>
                  </>
                )}

                <IonButton
                  type='submit'
                  className='mt-4 m-auto'
                  fill='outline'
                  expand='block'
                >
                  SIGNUP
                </IonButton>
              </IonList>
            </form>

            <div className='position-fixed bottom-0 end-0 pb-3 pe-3'>
              Already have an account?{' '}
              <Link to='/login' className='fw-bold text-decoration-none'>
                Login
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default SignUp
