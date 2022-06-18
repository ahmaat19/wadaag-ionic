import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
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
      <IonContent fullscreen color='primary' className='ion-padding'>
        <div className='d-flex justify-content-center align-items-center flex-column h-100 text-light'>
          <h1 className='text-center display-4 fw-bold ion-color-primary'>
            Signup
          </h1>
          <p className='text-center'>
            Please enter your details to create an account
          </p>
          <form onSubmit={handleSubmit} className='w-100 '>
            <IonList className='rounded-3 w-100 mb-1 bg-transparent'>
              <IonRadioGroup
                value={selected}
                onIonChange={(e) => setSelected(e.detail.value!)}
              >
                <IonListHeader className='bg-light rounded-top'>
                  <IonLabel className='fs-5'>Who are you?</IonLabel>
                </IonListHeader>

                <IonItem>
                  <IonLabel>Rider</IonLabel>
                  <IonRadio slot='start' value='rider' />
                </IonItem>

                <IonItem className='rounded-bottom'>
                  <IonLabel>Driver</IonLabel>
                  <IonRadio slot='start' value='driver' />
                </IonItem>
              </IonRadioGroup>

              <IonItem className='w-100 rounded-3 my-1'>
                <IonLabel position='fixed'>Name </IonLabel>
                <IonInput
                  style={{ marginLeft: -30 }}
                  type='text'
                  inputMode='text'
                  placeholder='enter name'
                  value={name}
                  onIonChange={(e) => setName(e.detail.value!)}
                />
              </IonItem>

              <IonItem className='w-100 rounded-3 my-1'>
                <IonLabel position='fixed'>Mobile </IonLabel>
                <IonInput
                  style={{ marginLeft: -30 }}
                  inputMode='numeric'
                  type='number'
                  placeholder='enter mobile number'
                  value={mobile}
                  onIonChange={(e) => setMobile(e.detail.value!)}
                />
              </IonItem>
              {selected === 'driver' && (
                <>
                  <IonItem className='w-100 rounded-3 my-1'>
                    <IonLabel position='fixed'>Plate </IonLabel>
                    <IonInput
                      style={{ marginLeft: -30 }}
                      inputMode='text'
                      type='text'
                      placeholder='enter plate number'
                      value={plate}
                      onIonChange={(e) => setPlate(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem className='w-100 rounded-3 my-1'>
                    <IonLabel position='fixed'>License </IonLabel>
                    <IonInput
                      style={{ marginLeft: -30 }}
                      inputMode='text'
                      type='text'
                      placeholder='enter license number'
                      value={license}
                      onIonChange={(e) => setLicense(e.detail.value!)}
                    />
                  </IonItem>
                </>
              )}

              <IonButton
                onClick={(e) => handleSubmit(e as any)}
                type='submit'
                color='light'
                className='w-100 mt-4'
              >
                Signup
              </IonButton>
            </IonList>
          </form>

          <div className='position-fixed bottom-0 w-100 ion-padding'>
            <Link
              to='/login'
              className='fw-bold fs-5 float-end text-light text-decoration-none'
            >
              Login
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default SignUp
