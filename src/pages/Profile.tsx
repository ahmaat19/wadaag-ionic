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
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react'
import {
  filter,
  hourglass,
  statsChart,
  swapVertical,
} from 'ionicons/icons'
import { useState } from 'react'
// import ProfileModal from '../components/ProfileModal'
import { Camera, CameraResultType } from '@capacitor/camera'

const Profile: React.FC = () => {
  const [present, dismiss] = useIonToast()
  const [image, setImage] = useState<any>('https://github.com/ahmaat19.png')

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
                <img src={image} className='display-1 fs-1' alt='logo' />
              </IonAvatar>
            </IonCol>
            <IonCol size='7'>
              <span className='fs-3 fw-bold'>Ahmed Ibrahim</span>
              <h6 className='mt-2 fw-light'>Rider</h6>
            </IonCol>
          </IonRow>
        </IonGrid>
        <hr className='bg-light' />
        <IonLabel className='fw-light'>My Status</IonLabel> <br />
        <IonChip className='bg-light fw-bold'>
          <IonIcon icon={statsChart} color='primary' />
          <IonLabel color='primary'>Level 26</IonLabel>
        </IonChip>
        <IonChip className='bg-light fw-bold float-end'>
          <IonIcon icon={swapVertical} color='primary' />
          <IonLabel color='primary'>98 Points</IonLabel>
        </IonChip>
        <hr className='bg-light' />
        <IonLabel className='fw-light'>Payments</IonLabel> <br />
        <IonChip className='bg-light fw-bold'>
          <IonIcon icon={filter} color='primary' />
          <IonLabel color='primary'>Transactions</IonLabel>
        </IonChip>
        <IonChip className='bg-light fw-bold float-end'>
          <IonIcon icon={hourglass} color='primary' />
          <IonLabel color='primary'>17 days remaining</IonLabel>
        </IonChip>
        <div className='mt-5'>
          <IonLabel className='fw-light'>Available payment method</IonLabel>
          <br />
          <IonButton color='light' expand='block'>
            <a
              href='tel:*789*638744*1#'
              className='fw-bold text-decoration-none'
            >
              Pay now with your EVC wallet
            </a>
          </IonButton>
          <h6 className='text-center'>OR</h6>
          <IonButton color='light' expand='block'>
            <a
              href='tel:*789*638744*1#'
              className='fw-bold text-decoration-none'
            >
              *789*638744*1#
            </a>
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile
