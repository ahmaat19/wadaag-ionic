import {
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
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonAlert,
} from '@ionic/react'

import { useEffect, useRef, useState } from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { Geolocation } from '@capacitor/geolocation'
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api'
import {
  arrowForwardCircle,
  closeOutline,
  gitCommitOutline,
  locationOutline,
  searchOutline,
  timeOutline,
} from 'ionicons/icons'

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation')

  setTimeout(() => {
    console.log('Async operation has ended')
    event.detail.complete()
  }, 2000)
}

const libraries: any = ['places']

const StartTrip: React.FC = () => {
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

  const { width, height } = useWindowDimensions()

  const [origin, setOrigin] = useState({})
  const [destination, setDestination] = useState('')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [directionsResponse, setDirectionsResponse] = useState(null)
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
    setDirectionsResponse(null)
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
      setDirectionsResponse(results as any)
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
                <IonIcon slot='start' icon={locationOutline} color='primary' />
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
                    icon={closeOutline}
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
                <IonIcon slot='start' icon={searchOutline} />
                <IonLabel>SEARCH</IonLabel>
              </IonButton>
            </div>{' '}
          </IonList>
        </IonCard>

        <IonCard className='mx-0'>
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{
              width: width,
              height: height / 2,
            }}
            options={{
              disableDefaultUI: true,
            }}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: '#5c1a67',
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}
          </GoogleMap>
          {duration && distance && (
            <IonCardContent>
              <>
                <p style={{ fontWeight: 'bold' }}>
                  <IonIcon icon={timeOutline} color='primary' />{' '}
                  <IonLabel>
                    <span> Duration - {duration}</span>
                  </IonLabel>
                  <br />
                  <IonIcon icon={gitCommitOutline} color='primary' />{' '}
                  <IonLabel>
                    <span> Distance - {distance}</span>
                  </IonLabel>
                </p>
              </>
            </IonCardContent>
          )}
        </IonCard>
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

export default StartTrip
