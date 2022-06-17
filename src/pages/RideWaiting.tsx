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
import { checkmark, close } from 'ionicons/icons'
import { useEffect } from 'react'
import useRidesHook from '../api/rides'
import { useHistory } from 'react-router'

const RideWaiting: React.FC = () => {
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
            mutateAsyncDelete({
              id: pendingRider._id,
              status: 'cancelled',
            } as any),
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
            mutateAsyncDelete({
              id: pendingRider._id,
              status: 'completed',
            } as any),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

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
      </IonContent>
    </IonPage>
  )
}

export default RideWaiting
