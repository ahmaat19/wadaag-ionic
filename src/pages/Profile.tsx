import {
  IonAvatar,
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
  statsChart,
  swapVertical,
} from 'ionicons/icons'
import { useEffect, useState } from 'react'

import { Camera, CameraResultType } from '@capacitor/camera'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { authLogout, setUser } from '../redux/userSlice'
import useProfilesHook from '../api/profiles'
import usePaymentsHook from '../api/payments'
import { defaultUrl } from '../config/url'

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

  const [showModal, setShowModal] = useState(false)

  const { isLoading, isError, error, data, refetch } = getProfile

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

  if (isLoading || isLoadingPayment || isLoadingUpdate) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding' color='primary'>
        <IonModal
          isOpen={showModal}
          // @ts-ignore
          cssClass='my-custom-modal-css'
          swipeToClose={true}
          presentingElement={router || undefined}
          onDidDismiss={() => setShowModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update User Profile</IonTitle>
              <IonButtons slot='end'>
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon slot='icon-only' icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className='ion-padding'>
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

            <IonItem lines='full'>
              <IonLabel position='floating'>Name</IonLabel>
              <IonInput
                type='text'
                value={state.name || (data && data.name)}
                onIonChange={(e) => {
                  setState({ ...state, name: e.detail.value! })
                }}
              />
            </IonItem>
            <IonItem lines='full'>
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
                <IonItem lines='full'>
                  <IonLabel position='floating'>Plate</IonLabel>
                  <IonInput
                    type='text'
                    value={plate || (data && data.plate)}
                    onIonChange={(e) => {
                      setPlate(e.detail.value!)
                    }}
                  />
                </IonItem>

                <IonItem lines='full'>
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
              onClick={() => updateUser()}
            >
              Update
            </IonButton>
          </IonContent>
        </IonModal>
        <IonGrid>
          <IonRow>
            <IonCol size='4' className='my-auto'>
              <IonAvatar
                onClick={takePicture}
                className='bg-light'
                style={{ width: 80, height: 80 }}
              >
                <img src={(data && data.image) || image} alt='logo' />
              </IonAvatar>
            </IonCol>
            <IonCol size='6'>
              <span className='fs-3 fw-bold'>
                {(data && data.name.toUpperCase()) || state.name.toUpperCase()}
              </span>
              <p>
                <span>{state.mobile}</span> <br />
                <span>
                  {' '}
                  {(data && data.userType.toUpperCase()) ||
                    state.userType.toUpperCase()}
                </span>
              </p>
            </IonCol>
            <IonCol
              // onClick={() => openCardModal()}
              onClick={() => setShowModal(true)}
              size='1'
              className='my-auto'
            >
              <IonIcon icon={create} size='large' />
            </IonCol>
          </IonRow>
        </IonGrid>
        <hr className='bg-light' />
        <IonLabel className='fw-light'>My Status</IonLabel> <br />
        <IonChip className='bg-light fw-bold'>
          <IonIcon icon={statsChart} color='primary' />
          <IonLabel color='primary'>Level {data && data.level}</IonLabel>
        </IonChip>
        <IonChip className='bg-light fw-bold float-end'>
          <IonIcon icon={swapVertical} color='primary' />
          <IonLabel color='primary'>{data && data.points} Points</IonLabel>
        </IonChip>
        <hr className='bg-light' />
        <IonLabel className='fw-light'>Payments</IonLabel> <br />
        <IonChip className='bg-light fw-bold'>
          <IonIcon icon={filter} color='primary' />
          <IonLabel color='primary'>Transactions</IonLabel>
        </IonChip>
        <IonChip className='bg-light fw-bold float-end'>
          <IonIcon icon={hourglass} color='primary' />
          <IonLabel color='primary'>
            {data && data.expiration} days remaining
          </IonLabel>
        </IonChip>
        <div className='mt-5'>
          <IonLabel className='fw-light'>Available payment method</IonLabel>
          <br />

          <IonButton color='light' expand='block'>
            <a
              href='tel:*789*638744*1%23'
              className='fw-bold text-decoration-none'
            >
              *789*638744*1#
            </a>
          </IonButton>
          <IonButton onClick={verifyPayment} color='success' expand='block'>
            Verify Payment
          </IonButton>
        </div>
        <div className='position-fixed bottom-0 ion-padding-bottom'>
          <IonChip onClick={logout} className='bg-light fw-bold'>
            <IonIcon icon={logOut} color='primary' />
            <IonLabel color='primary'>Logout</IonLabel>
          </IonChip>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile
