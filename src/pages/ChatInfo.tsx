import {
  IonAvatar,
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  useIonToast,
} from '@ionic/react'
import { checkmark, checkmarkCircle, trash } from 'ionicons/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import moment from 'moment'
import { useHistory, useParams } from 'react-router'
import io from 'socket.io-client'
import { defaultUrl } from '../config/url'
import { setChat } from '../redux/chatSlice'

let socket = io(defaultUrl)

const ChatInfo: React.FC = () => {
  const history = useHistory()
  const [toast, dismiss] = useIonToast()
  const dispatch = useDispatch()

  const param: any = useParams()
  const chats = useSelector((state: RootState) => state.chat)
  const user = useSelector((state: RootState) => state.user)
  const chat: any = chats.find((c: any) => c.riderTwoId === param.id)

  const acceptRequest = () => {
    socket.emit('rider-one-chat', {
      _id: chat._id,
      riderOneId: chat.riderOneId,
      riderOneName: chat.riderOneName,
      riderOneAvatar: chat.riderOneAvatar,
      riderOneMobile: chat.rideOneMobile,

      riderTwoId: chat.riderTwoId,
      riderTwoName: chat.riderTwoName,
      riderTwoAvatar: chat.riderTwoAvatar,
      riderTwoMobile: chat.rideTwoMobile,

      message: [
        {
          message: `Waxaad bixin doontaa $${chat.price} oo safarka ah iyo $0.1 oo darawalka ah`,
          sender: user._id,
          createdAt: new Date(),
        },
      ],
    })

    dispatch(
      setChat({
        _id: chat._id,
        riderOneId: chat.riderOneId,
        riderOneName: chat.riderOneName,
        riderOneAvatar: chat.riderOneAvatar,
        riderOneMobile: chat.riderOneMobile,

        riderTwoId: chat.riderTwoId,
        riderTwoName: chat.riderTwoName,
        riderTwoAvatar: chat.riderTwoAvatar,
        riderTwoMobile: chat.riderTwoMobile,

        price: chat.price,
        message: [
          {
            message: `Waxaad bixin doontaa $${chat.price} oo safarka ah iyo $0.1 oo darawalka ah`,
            sender: user._id,
            createdAt: new Date(),
          },
        ],
        createdAt: chat.createdAt,
      })
    )

    toast({
      buttons: [{ text: 'hide', handler: () => dismiss() }],
      message: 'Request Accepted',
      color: 'success',
      position: 'top',
      duration: 2000,
    })
  }

  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        <IonList>
          {chat.riderOneId === user._id && (
            <IonItem>
              <IonAvatar slot='end'>
                <IonIcon
                  onClick={acceptRequest}
                  size='large'
                  color='success'
                  icon={checkmarkCircle}
                />{' '}
              </IonAvatar>
              <IonLabel>
                <h2>Accept Request</h2>
                <p>{moment(chat.createdAt).startOf('minute').fromNow()}</p>
              </IonLabel>
            </IonItem>
          )}

          {chat.message.map((m: any) => (
            <IonItem key={m._id}>
              <IonAvatar slot={m.sender === user._id ? 'end' : 'start'}>
                <img
                  src={
                    m.sender === chat.riderOneId
                      ? chat.riderOneAvatar
                      : chat.riderTwoAvatar
                  }
                  alt='avatar'
                />
              </IonAvatar>
              <IonLabel>
                <p
                  className={
                    m.sender === user._id
                      ? 'float-end text-primary'
                      : 'float-start'
                  }
                >
                  {m.message}
                </p>
              </IonLabel>
            </IonItem>
          ))}
          {/* <IonItem>
            <IonAvatar slot='start'>
              <img src='https://github.com/ahmaat19.png' alt='avatar' />
            </IonAvatar>
            <IonLabel>
              <p>Hello</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonAvatar slot='start'>
              <img src='https://github.com/ahmaat19.png' alt='avatar' />
            </IonAvatar>
            <IonLabel>
              <p>Hello</p>
            </IonLabel>
          </IonItem> */}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default ChatInfo
