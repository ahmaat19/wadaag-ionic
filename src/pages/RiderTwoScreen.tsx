import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
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
  RefresherEventDetail,
  useIonAlert,
  useIonToast,
} from '@ionic/react'

import { useEffect, useRef, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { close, location, search } from 'ionicons/icons'
import useRidesHook from '../api/rides'
import { useHistory } from 'react-router'
import io from 'socket.io-client'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { defaultUrl } from '../config/url'

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

  const history = useHistory()
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
    socket.emit('ride-request', {
      _id: ride._id,
      riderOne: ride.rider,
      riderTwo: user._id,
      riderTwoName: user.name,
      riderTwoMobile: user.mobile,
      requestType: 'request',
    })

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
      <IonContent fullscreen className='ion-padding' color='primary'>
        <IonRefresher slot='fixed' onIonRefresh={doRefresh} color='primary'>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonCard
          className='m-0'
          style={{
            marginTop: 5,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <IonList>
            <Autocomplete>
              <IonItem>
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
          <IonCard className='mx-0'>
            <IonCardContent>
              <IonList>
                {/* @ts-ignore */}
                {dataPost.map((ride) => (
                  <IonItemSliding key={ride._id}>
                    <IonItem>
                      <IonAvatar slot='start'>
                        <img src={ride.image} alt={ride.image} />
                      </IonAvatar>
                      <IonLabel>
                        <h3>{ride.name}</h3>

                        <p>{ride.destination}</p>
                      </IonLabel>
                    </IonItem>

                    <IonItemOptions side='end'>
                      <IonItemOption onClick={(e) => requestRide(ride)}>
                        Send Request
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  )
}

export default RiderTwoScreen
