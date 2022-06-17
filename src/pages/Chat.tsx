import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
} from '@ionic/react'
import { trash } from 'ionicons/icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import moment from 'moment'
import { useHistory } from 'react-router'

const Chat: React.FC = () => {
  const history = useHistory()
  const chats = useSelector((state: RootState) => state.chat)
  const chatLink = (chat: any) => {
    return history.push(`/chat/${chat.riderTwoId}`)
  }
  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        <IonList>
          <IonListHeader> Recent Conversation </IonListHeader>

          {chats.map((chat: any) => (
            <IonItemSliding key={chat._id} className='ion-margin-top'>
              <IonItem onClick={(e) => chatLink(chat)}>
                <IonAvatar slot='start'>
                  <img src={chat.riderTwoAvatar} alt='avatar' />
                </IonAvatar>
                <IonLabel>
                  <h2>{chat.riderTwoName}</h2>
                  <p>{chat.riderTwoMobile}</p>
                  <p>{moment(chat.createdAt).startOf('minute').fromNow()}</p>
                </IonLabel>
              </IonItem>

              <IonItemOptions side='end'>
                <IonItemOption onClick={(e) => console.log(chat)}>
                  <IonIcon color='danger' icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Chat
