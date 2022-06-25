import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react'
import {
  close,
  create,
  filter,
  hourglass,
  logOut,
  // statsChart,
  // swapVertical,
} from 'ionicons/icons'
import { useEffect, useState } from 'react'

import { Camera, CameraResultType } from '@capacitor/camera'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { authLogout, setUser } from '../redux/userSlice'
import useProfilesHook from '../api/profiles'
import usePaymentsHook from '../api/payments'
import useReportsHook from '../api/reports'
import { defaultUrl } from '../config/url'
import { style } from '../components/Style'
import moment from 'moment'

interface ProfilePageProps {
  router: HTMLIonRouterOutletElement | null
}

const Profile: React.FC<ProfilePageProps> = ({ router }) => {
  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    avatar: '',
    userType: '',
    mobile: 0,
    points: 0,
    expiration: 0,
    level: 0,
    _id: '0',
    isAuth: false,
  })

  const [userType, setUserType] = useState('')
  const [plate, setPlate] = useState('')
  const [license, setLicense] = useState('')

  const { getProfile, postProfile } = useProfilesHook()
  const { postPayment } = usePaymentsHook()
  const { getPaymentTransactions } = useReportsHook()

  const [showModal, setShowModal] = useState(false)

  const { isLoading, isError, error, data, refetch } = getProfile
  const { isLoading: isLoadingPayments, data: paymentHistory } =
    getPaymentTransactions

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = postProfile

  const {
    isLoading: isLoadingPayment,
    isError: isErrorPayment,
    error: errorPayment,
    isSuccess: isSuccessPayment,
    mutateAsync: mutateAsyncPayment,
  } = postPayment

  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const [present, dismiss] = useIonToast()
  const [image, setImage] = useState<any>(data && data.image)

  useEffect(() => {
    setState({
      name: user.name,
      avatar: user.avatar,
      userType: user.userType,
      mobile: user.mobile,
      points: user.points,
      expiration: user.expiration,
      level: user.level,
      _id: user._id,
      isAuth: user.isAuth,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isSuccessPayment) {
      refetch()
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Payment Verified Successful',
        color: 'success',
        position: 'top',
        duration: 5000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPayment])

  useEffect(() => {
    if (isSuccessUpdate) {
      setShowModal(false)
      dispatch(
        setUser({
          name: data.name,
          avatar: image,
          userType: userType,
        } as any)
      )
      refetch()
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'User Profile Updated Successful',
        color: 'success',
        position: 'top',
        duration: 5000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdate])

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
    if (isErrorUpdate) {
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: errorUpdate as string,
        color: 'danger',
        position: 'top',
        duration: 5000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  useEffect(() => {
    if (isErrorPayment) {
      present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: errorPayment as string,
        color: 'danger',
        position: 'top',
        duration: 5000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorPayment])

  const uploadImage = async (path: string) => {
    const response = await fetch(path)
    const blob = await response.blob()

    if (blob) {
      const file = new File([blob], 'image.png', { type: 'image/png' })
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${defaultUrl}/api/upload?type=image`, {
        method: 'POST',
        body: formData,
      })
      const json = await response.json()
      if (json) {
        setImage(`${defaultUrl}${json.filePaths[0].path}`)
      }
    }
  }

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    })

    const imageBlob = image?.webPath || image?.path

    const allowedExtensions = ['jpg', 'jpeg', 'png']

    if (!allowedExtensions.includes(image.format)) {
      return present({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Image format not supported.',
        duration: 5000,
        color: 'danger',
      })
    }

    uploadImage(imageBlob as string)
  }
  const logout = async () => {
    dispatch(authLogout())

    history.replace('/login')
    window.location.reload()
  }

  const verifyPayment = () => {
    mutateAsyncPayment()
  }

  const updateUser = () => {
    mutateAsyncUpdate({
      image,
      name: state.name,
      userType,
      plate,
      license,
    } as any)
  }

  // hide ionic tabs bar bottom on profile page
  document.documentElement.style.setProperty('--ion-safe-area-bottom', '0px')

  if (isLoading || isLoadingPayment || isLoadingUpdate || isLoadingPayments) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  // const paymentHistory = [
  //   {
  //     _id: 1,
  //     amount: '1.00',
  //     date: '1 May, 2022',
  //   },
  //   {
  //     _id: 2,
  //     amount: '1.00',
  //     date: '15 April, 2022',
  //   },
  //   {
  //     _id: 3,
  //     amount: '1.00',
  //     date: '21 June, 2022',
  //   },
  // ]

  return (
    <IonPage>
      <IonHeader collapse='fade' translucent className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/' />
          </IonButtons>
          <IonButtons slot='end'>
            <IonChip onClick={logout} className='bg-light fw-light'>
              <IonIcon icon={logOut} color='primary' />
              <IonLabel color='primary'>Logout</IonLabel>
            </IonChip>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <IonGrid>
            <IonRow>
              <IonCol size='4' className='my-auto'>
                <IonAvatar
                  className='bg-light'
                  style={{ width: 80, height: 80 }}
                >
                  <img src={(data && data.image) || image} alt='logo' />
                </IonAvatar>
              </IonCol>
              <IonCol size='6'>
                <span className='fs-6 fw-bold'>
                  {(data && data.name.toUpperCase()) ||
                    state.name.toUpperCase()}
                </span>
                <p>
                  <IonLabel className='fw-light'>{state.mobile}</IonLabel>
                  <br />
                  <IonLabel className='fw-light'>
                    {(data && data.userType.toUpperCase()) ||
                      state.userType.toUpperCase()}
                  </IonLabel>
                </p>
              </IonCol>
              <IonCol
                onClick={() => setShowModal(true)}
                size='1'
                className='my-auto'
              >
                <IonIcon icon={create} size='large' />
              </IonCol>
            </IonRow>
          </IonGrid>
          <hr className='bg-primary' />

          <IonList className='bg-transparent'>
            <IonLabel>
              {' '}
              <IonIcon icon={filter} color='primary' /> Last 3 transactions
            </IonLabel>
            {paymentHistory &&
              paymentHistory.map((history: any) => (
                <IonItem className='bg-transparent' key={history._id}>
                  <IonLabel className='d-flex justify-content-between'>
                    <p>{moment(history.date).format('ll')}</p>
                    <p className='text-success'>${history.amount}</p>
                  </IonLabel>
                </IonItem>
              ))}
          </IonList>

          <IonButton
            color={`${
              data && Number(data.expiration) < 3 ? 'danger' : 'success'
            }`}
            expand='block'
            className='shadow mt-3'
          >
            <IonIcon icon={hourglass} />
            <IonLabel>{data && data.expiration} days remaining</IonLabel>
          </IonButton>

          <div className='position-fixed bottom-0 end-0 pb-3 pe-3 ion-padding'>
            {data && data.expiration === 0 && (
              <div>
                <IonLabel className='fw-light'>
                  Your subscription has expired, please click the bellow button
                  and verify after you send.
                </IonLabel>
                <br />

                <IonButton className='my-3' expand='block' fill='outline'>
                  <a
                    href='tel:*789*638744*1%23'
                    className='fw-bold text-decoration-none'
                  >
                    *789*638744*1#
                  </a>
                </IonButton>
                <IonButton
                  onClick={verifyPayment}
                  color='primary'
                  expand='block'
                >
                  VERIFY PAYMENT
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      <IonModal
        isOpen={showModal}
        // @ts-ignore
        cssClass='my-custom-modal-css'
        canDismiss={true}
        presentingElement={router || undefined}
        onDidDismiss={() => setShowModal(false)}
      >
        <IonHeader collapse='fade' translucent className='ion-no-border'>
          <IonToolbar>
            <IonTitle>Update User Profile</IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon slot='icon-only' icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className='h-100 ion-padding' style={style.background}>
            <IonAvatar
              onClick={takePicture}
              className='bg-light'
              style={{ width: 100, height: 100, margin: 'auto' }}
            >
              <img
                src={image || (data && data.image)}
                className=''
                alt='logo'
              />
            </IonAvatar>

            <IonItem lines='full' className='bg-transparent'>
              <IonLabel position='floating'>Name</IonLabel>
              <IonInput
                type='text'
                value={state.name || (data && data.name)}
                onIonChange={(e) => {
                  setState({ ...state, name: e.detail.value! })
                }}
              />
            </IonItem>
            <IonItem lines='full' className='bg-transparent'>
              <IonLabel position='floating'>User Type</IonLabel>
              <IonSelect
                value={userType || (data && data.userType)}
                onIonChange={(e) => {
                  setUserType(e.detail.value)
                }}
              >
                <IonSelectOption value='rider'>Rider</IonSelectOption>
                <IonSelectOption value='driver'>Driver</IonSelectOption>
              </IonSelect>
            </IonItem>

            {userType === 'driver' && (
              <>
                <IonItem lines='full' className='bg-transparent'>
                  <IonLabel position='floating'>Plate</IonLabel>
                  <IonInput
                    type='text'
                    value={plate || (data && data.plate)}
                    onIonChange={(e) => {
                      setPlate(e.detail.value!)
                    }}
                  />
                </IonItem>

                <IonItem lines='full' className='bg-transparent'>
                  <IonLabel position='floating'>License</IonLabel>
                  <IonInput
                    type='text'
                    value={license || (data && data.license)}
                    onIonChange={(e) => {
                      setLicense(e.detail.value!)
                    }}
                  />
                </IonItem>
              </>
            )}

            <IonButton
              className='mt-3'
              expand='block'
              fill='outline'
              onClick={() => updateUser()}
            >
              UPDATE
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}

export default Profile
