import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
} from '@ionic/react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { Storage } from '@capacitor/storage'

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [mobile, setMobile] = useState<any>('')
  const [plate, setPlate] = useState<string>('')
  const [license, setLicense] = useState<string>('')
  const [selected, setSelected] = useState<string>('rider')

  const history = useHistory()
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

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (selected === 'driver') {
      console.log({
        name,
        mobile,
        plate,
        license,
        selected,
      })
    } else {
      console.log({
        name,
        mobile,
      })
    }
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

          <IonList className='w-100 rounded-3 mb-1 bg-transparent'>
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
              type='submit'
              color='light'
              routerLink='/otp'
              className='w-100 mt-4'
              onClick={(e) => handleSubmit(e as any)}
            >
              Signup
            </IonButton>
          </IonList>

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
