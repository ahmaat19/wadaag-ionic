import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  RefresherEventDetail,
  useIonAlert,
  useIonToast,
} from '@ionic/react'

import { useEffect, useRef, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { close, location, personCircle, search, send } from 'ionicons/icons'
import useRidesHook from '../api/rides'
import io from 'socket.io-client'
import { RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { defaultUrl } from '../config/url'
import { setChat } from '../redux/chatSlice'
import { style } from '../components/Style'

let socket = io(defaultUrl)

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation')

  setTimeout(() => {
    console.log('Async operation has ended')
    event.detail.complete()
  }, 2000)
}

const libraries: any = ['places']

const RiderTwoScreen: React.FC = () => {
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [present] = useIonAlert()

  /** @type React.MutableRefObject<HTMLDivElement> */
  const destinationRef = useRef<HTMLInputElement>(null)

  const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition()
    setLat(coordinates.coords.latitude)
    setLng(coordinates.coords.longitude)
  }

  useEffect(() => {
    printCurrentPosition()
  }, [])

  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const [toast, dismiss] = useIonToast()

  const origin: any = {}
  const destination: any = ''

  const { postNearRiders } = useRidesHook()

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync: mutateAsyncPost,
    data: dataPost,
  } = postNearRiders

  // console.log(dataPost && dataPost)

  useEffect(() => {
    if (isErrorPost) {
      toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: errorPost as string,
        color: 'danger',
        position: 'top',
        duration: 4000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorPost])

  const center = {
    lat: lat,
    lng: lng,
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env!.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: libraries,
  })

  function clearRoute() {
    destinationRef.current!.value = ''
  }

  async function submitHandler() {
    try {
      const directionsService = new google.maps.DirectionsService()

      const results = await directionsService.route({
        origin: center,
        destination: destinationRef.current!.value,
        travelMode: google.maps.TravelMode.DRIVING,
      })

      const oLan: number = results!.routes[0]!.legs[0]!.start_location!.lat()
      const oLng: number = results.routes[0]!.legs[0]!.start_location!.lng()

      const dLan: number = results!.routes[0]!.legs[0]!.end_location!.lat()
      const dLng: number = results.routes[0]!.legs[0]!.end_location!.lng()

      // @ts-ignore
      mutateAsyncPost({
        originLatLng: `${oLan},${oLng}`,
        destinationLatLng: `${dLan},${dLng}`,
      })
    } catch (error) {
      present({
        cssClass: 'my-css',
        header: 'Alert',
        message: 'No route could be found between the origin and destination',
        buttons: ['Cancel', { text: 'Ok', handler: (d) => {} }],
        onDidDismiss: () => {},
      })
    }
    if (destinationRef.current!.value === '') {
      return
    }
  }

  const requestRide = (ride: any) => {
    socket.emit('rider-two-chat', {
      _id: ride._id,
      riderOneId: ride.rider,
      riderOneName: ride.name,
      riderOneAvatar: ride.image,
      riderOneMobile: ride.mobileNumber,

      riderTwoId: user._id,
      riderTwoName: user.name,
      riderTwoAvatar: user.avatar,
      riderTwoMobile: user.mobile,

      message: [
        {
          message: 'Asckm',
          sender: user._id,
          createdAt: new Date(),
        },
      ],
    })
    const m = user.mobile.toString()
    dispatch(
      setChat({
        _id: ride._id,
        riderOneId: ride.rider,
        riderOneName: ride.name,
        riderOneAvatar: ride.image,
        riderOneMobile: ride.mobileNumber,

        riderTwoId: user._id,
        riderTwoName: user.name,
        riderTwoAvatar: user.avatar,
        riderTwoMobile: m,

        message: [
          {
            message: 'Asckm',
            sender: user._id,
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
      } as any)
    )

    toast({
      buttons: [{ text: 'hide', handler: () => dismiss() }],
      message: 'Request sent',
      color: 'success',
      position: 'top',
      duration: 2000,
    })
  }

  if (isLoadingPost || !isLoaded) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  return (
    <IonPage>
      <IonHeader collapse='fade' translucent className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/' />
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton routerLink='/profile'>
              <IonIcon slot='icon-only' icon={personCircle} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='h-100 ion-padding' style={style.background}>
          <IonRefresher slot='fixed' onIonRefresh={doRefresh} color='primary'>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonCard
            className='m-0 bg-transparent shadow-lg'
            style={{
              marginTop: 5,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <IonList className='bg-transparent'>
              <Autocomplete>
                <IonItem className='bg-transparent'>
                  <IonIcon slot='start' icon={location} color='primary' />
                  <input
                    placeholder='Where are you going to day?'
                    type='text'
                    ref={destinationRef}
                    defaultValue={destination}
                    className='border-0 w-100 bg-transparent'
                    style={{ outline: 'none' }}
                  />
                  {origin && destination && (
                    <IonIcon
                      slot='end'
                      icon={close}
                      color='danger'
                      onClick={clearRoute}
                    />
                  )}
                </IonItem>
              </Autocomplete>
              <div style={{ marginLeft: 30 }}>
                <IonButton
                  fill='outline'
                  onClick={submitHandler}
                  style={{ float: 'right', width: '100%', marginTop: 20 }}
                >
                  <IonIcon slot='start' icon={search} />
                  <IonLabel>SEARCH</IonLabel>
                </IonButton>
              </div>{' '}
            </IonList>
          </IonCard>

          {dataPost && dataPost.length > 0 && (
            <IonCard className='mx-0 bg-transparent shadow-lg'>
              <IonCardContent>
                <IonList className='bg-transparent'>
                  {/* @ts-ignore */}
                  {dataPost.map((ride) => (
                    <IonItemSliding key={ride._id}>
                      <IonItem className='bg-transparent'>
                        <IonAvatar slot='start'>
                          <img src={ride.image} alt={ride.image} />
                        </IonAvatar>
                        <IonLabel>
                          <h3>{ride.name}</h3>

                          <p>{ride.destination}</p>
                        </IonLabel>
                      </IonItem>

                      <IonItemOptions className='bg-transparent' side='end'>
                        <IonItemOption
                          className='bg-transparent'
                          onClick={(e) => requestRide(ride)}
                        >
                          <IonIcon slot='start' color='primary' icon={send} />{' '}
                          <IonLabel color='primary'>send</IonLabel>
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default RiderTwoScreen
