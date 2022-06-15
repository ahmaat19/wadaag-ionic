import {
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  useIonAlert,
  useIonToast,
} from '@ionic/react'
import { checkmark, close, notificationsCircle } from 'ionicons/icons'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useRidesHook from '../api/rides'
import { RootState } from '../redux/store'
import io from 'socket.io-client'
import { useHistory } from 'react-router'

let socket = io('http://192.10.11.100:3000')

const RideWaiting: React.FC = () => {
  const user = useSelector((state: RootState) => state.user)

  const [present] = useIonAlert()
  const [toast, dismiss] = useIonToast()

  const { getPendingRider, deleteRide } = useRidesHook()

  const {
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
    error: errorDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteRide

  const {
    data: pendingRider,
    refetch,
    isLoading: isLoadingPending,
  } = getPendingRider

  const history = useHistory()

  useEffect(() => {
    if (isSuccessDelete) {
      refetch()
      history.replace('/rider-one-screen')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete])

  useEffect(() => {
    if (isErrorDelete) {
      toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: errorDelete as string,
        color: 'danger',
        position: 'top',
        duration: 4000,
      })

      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorDelete])

  const cancelTrip = () => {
    present({
      cssClass: 'my-css',
      header: 'Cancel Trip',
      message: 'Are you sure you want to cancel the trip?',
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: () =>
            // @ts-ignore
            mutateAsyncDelete({
              id: pendingRider._id,
              status: 'cancelled',
            }),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

  const completeTrip = () => {
    present({
      cssClass: 'my-css',
      header: 'Complete Trip',
      message: 'Are you sure you want to complete the trip?',
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: () =>
            // @ts-ignore
            mutateAsyncDelete({
              id: pendingRider._id,
              status: 'completed',
            }),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

  const acceptRequest = () => {
    console.log('ride accept func')
    socket.emit('ride-accept', {
      requestType: 'accept',
      user: user,
    })
  }

  // const filteredRequest = {}
  // incomingRequest.rider?.toString() === user?._id?.toString() &&
  // incomingRequest

  if (isLoadingDelete || isLoadingPending) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding' color='primary'>
        <IonCard>
          <IonCardContent>
            <p>You have uncompleted ride </p>
            <IonChip onClick={completeTrip} color='success'>
              <IonIcon icon={checkmark} />
              <IonLabel>Complete Ride</IonLabel>
            </IonChip>

            <IonChip onClick={cancelTrip} color='danger'>
              <IonIcon icon={close} />
              <IonLabel>Cancel Ride</IonLabel>
            </IonChip>
          </IonCardContent>
        </IonCard>

        {/* {filteredRequest && (
          <IonCard>
            <IonCardContent>
              <p>Your have an incoming request </p>
              <IonChip onClick={acceptRequest} color='success'>
                <IonIcon icon={notificationsCircle} />
                <IonLabel>
                  Accept Request width ${filteredRequest.chat[0].price}
                </IonLabel>
              </IonChip>
            </IonCardContent>
          </IonCard>
        )} */}
      </IonContent>
    </IonPage>
  )
}

export default RideWaiting
