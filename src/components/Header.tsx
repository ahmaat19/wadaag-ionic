import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonToolbar,
} from '@ionic/react'
import { chevronBack, notificationsCircle, personCircle } from 'ionicons/icons'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { RootState } from '../redux/store'

export default function Header({ profile = true, nativeBack = true }) {
  const history = useHistory()
  const routerLinkChat = () => {
    history.push('/chat')
  }

  const chats = useSelector((state: RootState) => state.chat)

  return (
    <IonHeader collapse='fade' translucent className='ion-no-border'>
      <IonToolbar>
        <IonButtons slot='start'>
          {nativeBack ? (
            <IonBackButton defaultHref='/' />
          ) : (
            <IonButton routerLink='/'>
              <IonIcon slot='icon-only' icon={chevronBack} color='primary' />
              Back
            </IonButton>
          )}
        </IonButtons>

        {chats.length > 0 && (
          <IonButtons onClick={routerLinkChat} slot='end'>
            <IonIcon
              color='success'
              slot='icon-only'
              icon={notificationsCircle}
              size='medium'
            />
            <sup className='text-success'>1</sup>
          </IonButtons>
        )}

        {profile && (
          <IonButtons slot='end'>
            <IonButton routerLink='/profile'>
              <IonIcon slot='icon-only' icon={personCircle} />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  )
}
