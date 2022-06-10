import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonAlert,
} from '@ionic/react'

import { useEffect, useRef, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import {
  arrowForwardCircle,
  close,
  location,
  search,
  send,
} from 'ionicons/icons'

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation')

  setTimeout(() => {
    console.log('Async operation has ended')
    event.detail.complete()
  }, 2000)
}

const libraries: any = ['places']

const FindSharedRide: React.FC = () => {
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

  const [origin, setOrigin] = useState({})
  const [destination, setDestination] = useState('')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [originLatLng, setOriginLatLng] = useState('')
  const [destinationLatLng, setDestinationLatLng] = useState('')

  const center = {
    lat: lat,
    lng: lng,
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env!.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: libraries,
  })

  if (!isLoaded) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  function clearRoute() {
    setOrigin({})
    setDestination('')
    setDistance('')
    setDuration('')
    setOriginLatLng('')
    setDestinationLatLng('')

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

      setOrigin(center)
      setDestination(destinationRef.current!.value)
      setDistance(results.routes[0]!.legs[0]!.distance!.text)
      setDuration(results.routes[0]!.legs[0]!.duration!.text)
      setOriginLatLng(`${oLan},${oLng}`)
      setDestinationLatLng(`${dLan},${dLng}`)
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

  const requestRide = () => {
    present({
      cssClass: 'my-css',
      header: 'Alert',
      message: 'Do you want to send a request to this rider?',
      buttons: ['Cancel', { text: 'Send', handler: (d) => {} }],
      onDidDismiss: () => {},
    })
  }

  const startTrip = () => {
    present({
      cssClass: 'my-css',
      header: 'Start Trip',
      message: 'Are you sure you want to start the trip?',
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: () =>
            console.log({
              origin: origin,
              destination: destination,
              distance: distance,
              duration: duration,
              originLatLng: originLatLng,
              destinationLatLng: destinationLatLng,
            }),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

  const nearRides = [
    {
      _id: 1,
      name: 'John Doe',
      avatar: 'https://github.com/brad.png',
      destination: 'Sydney, Australia',
    },
    {
      _id: 1,
      name: 'Ahmed Ibrahim',
      avatar: 'https://github.com/ahmaat19.png',
      destination: 'Makka Almukarramah, Mogadishu',
    },
    {
      _id: 1,
      name: 'Muse Farah',
      avatar: 'https://github.com/muse.png',
      destination: 'Mozambique',
    },
  ]

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

        {origin && destination && (
          <IonCard className='mx-0'>
            <IonCardContent>
              <IonList>
                <IonListHeader>
                  <IonLabel> Near Rides </IonLabel>
                </IonListHeader>
                {nearRides.map((ride) => (
                  <IonItem>
                    <IonAvatar slot='start'>
                      <img src={ride.avatar} alt={ride.avatar} />
                    </IonAvatar>
                    <IonLabel>
                      <div className='d-flex justify-content-between'>
                        <h3>{ride.name}</h3>
                        <IonIcon
                          onClick={requestRide}
                          icon={send}
                          color='primary'
                        />
                      </div>
                      <p>{ride.destination}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
        {origin && destination && (
          <IonFab vertical='bottom' horizontal='end' slot='fixed'>
            <IonFabButton color='light' onClick={startTrip}>
              <IonIcon color='primary' icon={arrowForwardCircle} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  )
}

export default FindSharedRide
