import {
  IonAvatar,
  IonButton,
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
  const user = useSelector((state: RootState) => state.user)
  const chatLink = (chat: any) => {
    return history.push(`/chat/${chat.riderTwoId}/details`)
  }
  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        {chats.length > 0 ? (
          <IonList>
            <IonListHeader> Recent Conversation </IonListHeader>

            {chats.map((chat: any) => (
              <IonItemSliding key={chat._id} className='ion-margin-top'>
                <IonItem onClick={(e) => chatLink(chat)}>
                  <IonAvatar slot='start'>
                    <img
                      src={
                        user._id === chat.riderOneId
                          ? chat.riderTwoAvatar
                          : chat.riderOneAvatar
                      }
                      alt='avatar'
                    />
                  </IonAvatar>
                  <IonLabel>
                    <h2>
                      {user._id === chat.riderOneId
                        ? chat.riderTwoName
                        : chat.riderOneName}
                    </h2>
                    <p>
                      {user._id === chat.riderOneId
                        ? chat.riderTwoMobile
                        : chat.riderOneMobile}
                    </p>
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
        ) : (
          <div className='d-flex justify-content-center align-items-center h-100'>
            <IonButton color='danger' expand='block'>
              Sorry, no chat available yet!
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Chat
