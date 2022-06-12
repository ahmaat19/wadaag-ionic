import {
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
} from '@ionic/react'
import { checkmark, close } from 'ionicons/icons'

export const RidePending = ({ cancelTrip, completeTrip }) => {
  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding' color='primary'>
        <IonCard>
          <IonCardContent>
            <p cla>You have uncompleted ride </p>
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
