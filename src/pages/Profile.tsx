import {
  IonAvatar,
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react'
import {
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
import { authLogout } from '../redux/userSlice'
import useProfilesHook from '../api/profiles'
import usePaymentsHook from '../api/payments'

const Profile: React.FC = () => {
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

  const { getProfile } = useProfilesHook()
  const { postPayment } = usePaymentsHook()

  const { isLoading, isError, error, data, refetch } = getProfile
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

  // useEffect(() => {
  //   if (user.isAuth === false) {
  //     history.push('/login')
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks

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
      const response = await fetch('https://wadaag.app/api/upload?type=image', {
        method: 'POST',
        body: formData,
      })
      const json = await response.json()
      if (json) {
        setImage(`https://wadaag.app${json.filePaths[0].path}`)
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

  // hide ionic tabs bar bottom on profile page
  document.documentElement.style.setProperty('--ion-safe-area-bottom', '0px')

  if (isLoading || isLoadingPayment) {
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
        <IonGrid>
          <IonRow>
            <IonCol size='4' className='my-auto'>
              <IonAvatar
                onClick={takePicture}
                className='bg-light display-1 fs-1 w-75 h-75'
              >
                <img
                  src={(data && data.image) || image}
                  className='display-1 fs-1'
                  alt='logo'
                />
              </IonAvatar>
            </IonCol>
            <IonCol size='7'>
              <span className='fs-3 fw-bold'>{state.name}</span>
              <h6 className='mt-2 fw-light'>{state.userType?.toUpperCase()}</h6>
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
