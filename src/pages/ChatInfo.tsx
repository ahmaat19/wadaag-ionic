import {
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  useIonToast,
} from '@ionic/react'
import { checkmarkCircle, send } from 'ionicons/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import moment from 'moment'
import { useParams } from 'react-router'
import io from 'socket.io-client'
import { defaultUrl } from '../config/url'
import { setChat } from '../redux/chatSlice'
import { useEffect, useState } from 'react'

let socket = io(defaultUrl)

const ChatInfo: React.FC = () => {
  const [toast, dismiss] = useIonToast()
  const dispatch = useDispatch()
  const [text, setText] = useState<string>('')

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
      } as any)
    )

    toast({
      buttons: [{ text: 'hide', handler: () => dismiss() }],
      message: 'Request Accepted',
      color: 'success',
      position: 'top',
      duration: 2000,
    })
  }

  const sendMessage = (e: any) => {
    e.preventDefault()
    if (!text) {
      return toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Invalid Message',
        color: 'danger',
        position: 'top',
        duration: 2000,
      })
    }
    socket.emit('send-message', {
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
          message: text,
          sender: user._id,
          createdAt: new Date(),
        },
      ],
      sender: user._id,
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
            message: text,
            sender: user._id,
            createdAt: new Date(),
          },
        ],
        createdAt: chat.createdAt,
      } as any)
    )

    setText('')
  }

  useEffect(() => {
    const chatDiv = document.getElementById('chat-div')
    if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight
  }, [chat])

  return (
    <IonPage>
      <IonContent fullscreen color='primary' className='ion-padding'>
        <div
          className='rounded-5 mb-2'
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 127px)',
          }}
          id='chat-div'
        >
          <IonList>
            {chat.riderOneId === user._id && (
              <IonItem style={{ borderRadios: '50%' }}>
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

            {chat.message.map((m: any, index: number) => (
              <IonItem key={index}>
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
                        ? 'float-end text-primary text-wrap'
                        : 'float-start text-wrap'
                    }
                  >
                    {m.message}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
          <div className='position-relative bg-danger'>
            <div
              className='position-fixed'
              style={{
                bottom: 8,
                width: '86%',
                zIndex: 1,
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: 20,
              }}
            >
              <form onSubmit={sendMessage}>
                <IonItem fill='solid' className='rounded-pill'>
                  <IonInput
                    autofocus={true}
                    inputMode='text'
                    value={text}
                    onIonChange={(e) => setText(e.detail.value!)}
                    placeholder='Enter Input'
                  />
                  <IonButton onClick={sendMessage} slot='end' color='primary'>
                    <IonIcon icon={send} />
                  </IonButton>
                </IonItem>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChatInfo
