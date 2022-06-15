import {
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react'
import { send } from 'ionicons/icons'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import io from 'socket.io-client'
import { defaultUrl } from '../config/url'
import { RootState } from '../redux/store'

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation')

  setTimeout(() => {
    console.log('Async operation has ended')
    event.detail.complete()
  }, 2000)
}

let socket = io(defaultUrl)
const Chat: React.FC = () => {
  const params = useParams()
  console.log(params)

  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    socket.on('ride-accept-response', (message: string) => {
      console.log('accept: ', message)
    })
  }, [])

  const sendRequest = () => {
    socket.emit('ride-request', {
      // @ts-ignore
      _id: params.id,
      requestType: 'request',
      user: user,
    })
  }

  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding' color='primary'>
        <IonRefresher slot='fixed' onIonRefresh={doRefresh} color='primary'>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonCard>
          <IonCardContent>
            <p>Send Ride Request </p>
            <IonChip onClick={sendRequest} color='success'>
              <IonIcon icon={send} />
              <IonLabel>Send Request</IonLabel>
            </IonChip>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Chat
