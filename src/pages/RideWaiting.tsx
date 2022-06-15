import {
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonLoading,
  IonPage,
  useIonAlert,
  useIonToast,
} from '@ionic/react'
import {
  checkmark,
  close,
  notificationsCircle,
  person,
  phonePortrait,
  pricetag,
} from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useRidesHook from '../api/rides'
import { RootState } from '../redux/store'
import io from 'socket.io-client'
import { useHistory } from 'react-router'
import { defaultUrl } from '../config/url'

let socket = io(defaultUrl)

const RideWaiting: React.FC = () => {
  const user = useSelector((state: RootState) => state.user)
  const [requestInfo, setRequestInfo] = useState<any>([])

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

  useEffect(() => {
    socket.on(user._id, (data: any) => {
      setRequestInfo([...requestInfo, data])
    })
  }, [requestInfo])

  console.log(requestInfo && requestInfo)

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

  const acceptRide = (request: any) => {
    socket.emit('ride-accept', {
      requestType: 'accept',
      user: user,
    })
  }

  const deleteRideRequest = (request: any) => {
    setRequestInfo((prev: any) =>
      prev.filter((item: any) => item._id !== request._id)
    )
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

        {requestInfo.length > 0 && (
          <IonCard>
            <IonCardContent>
              <IonLabel>You have received new ride request</IonLabel>
              <hr className='bg-info' />

              {requestInfo.map((request: any, index: number) => (
                <IonItemSliding key={index} className='ion-margin-top'>
                  <IonItemOptions side='start'>
                    <IonItemOption onClick={(e) => deleteRideRequest(request)}>
                      <IonIcon color='danger' icon={close} />
                    </IonItemOption>
                  </IonItemOptions>
                  <IonItem>
                    <div className='d-flex flex-column'>
                      <p className='text-muted'>
                        <IonIcon color='primary' icon={person} />
                        <span className='fw-bold'> Name:</span>
                        {request.riderTwoName}
                      </p>
                      <p className='text-muted'>
                        <IonIcon color='primary' icon={phonePortrait} />
                        <span className='fw-bold'> Mobile:</span>
                        {request.riderTwoMobile}
                      </p>
                      <p className='text-muted'>
                        <IonIcon color='primary' icon={pricetag} />
                        <span className='fw-bold'> Price:</span> $
                        {request.price}
                      </p>
                    </div>
                  </IonItem>

                  <IonItemOptions side='end'>
                    <IonItemOption onClick={(e) => acceptRide(request)}>
                      Accept Request
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  )
}

export default RideWaiting
