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
// import { DefaultEventsMap } from '@socket.io/component-emitter'
import { send } from 'ionicons/icons'
import { useEffect } from 'react'
// import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import io from 'socket.io-client'

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation')

  setTimeout(() => {
    console.log('Async operation has ended')
    event.detail.complete()
  }, 2000)
}

// let socket: Socket<DefaultEventsMap, DefaultEventsMap>

let socket = io('http://localhost:3000')
const Chat: React.FC = () => {
  const params = useParams()
  console.log(params)

  useEffect(() => {
    socket.on('ride-request', (message: string) => {
      console.log(message)
    })
  }, [])

  const sendRequest = () => {
    socket.emit('ride-request', {
      // @ts-ignore
      id: params.id,
      name: 'John Doe',
      message: 'Hello',
      timestamp: new Date().toISOString(),
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
            <p>You have uncompleted ride </p>
            {/* @ts-ignore */}
            <IonLabel>{params.id}</IonLabel>
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
