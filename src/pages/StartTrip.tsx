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
  useIonToast,
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
  close,
  gitCommit,
  location,
  search,
  time,
} from 'ionicons/icons'
import useRidesHook from '../api/rides'
import { RidePending } from '../components/RidePending'

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
  const [toast, dismiss] = useIonToast()

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
  const [pendingRide, setPendingRide] = useState(false)

  const center = {
    lat: lat,
    lng: lng,
  }

  const { postRide, getPendingRider, deleteRide } = useRidesHook()

  const {
    isLoading: isLoadingPost,
    isSuccess: isSuccessPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync: mutateAsyncPost,
  } = postRide

  const {
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
    error: errorDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteRide

  const {
    data: pendingRider,
    refetch,
    isLoading: isLoadingPending,
  } = getPendingRider

  useEffect(() => {
    if (isSuccessDelete) {
      setPendingRide(false)
      toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Ride action successfully',
        color: 'success',
        position: 'top',
        duration: 5000,
      })
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete])

  useEffect(() => {
    if (pendingRider) {
      setDestination(pendingRider.destination)
      setDistance(pendingRider.distance)
      setDuration(pendingRider.duration)
      setOriginLatLng(pendingRider.originLatLng)
      setDestinationLatLng(pendingRider.destinationLatLng)
      setPendingRide(true)
    }
  }, [pendingRider])

  useEffect(() => {
    if (isErrorPost || isErrorDelete) {
      toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: (errorPost as string) || (errorDelete as string),
        color: 'danger',
        position: 'top',
        duration: 5000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorPost, isErrorDelete])

  useEffect(() => {
    if (isSuccessPost) {
      toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Ride has been started',
        color: 'success',
        position: 'top',
        duration: 5000,
      })
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPost])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env!.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: libraries,
  })

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
            // @ts-ignore
            mutateAsyncPost({
              origin: 'My Location',
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

  const cancelTrip = () => {
    present({
      cssClass: 'my-css',
      header: 'Cancel Trip',
      message: 'Are you sure you want to cancel the trip?',
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: () =>
            // @ts-ignore
            mutateAsyncDelete({
              id: pendingRider._id,
              status: 'cancelled',
            }),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

  const completeTrip = () => {
    present({
      cssClass: 'my-css',
      header: 'Cancel Trip',
      message: 'Are you sure you want to complete the trip?',
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: () =>
            // @ts-ignore
            mutateAsyncDelete({
              id: pendingRider._id,
              status: 'completed',
            }),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

  if (isLoadingPost || isLoadingDelete || !isLoaded || isLoadingPending) {
    return <IonLoading isOpen={true} message={'Loading...'} />
  }

  if (pendingRide) {
    return (
      <RidePending
        cancelTrip={() => cancelTrip() as any}
        completeTrip={() => completeTrip() as any}
      />
    )
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
                  <IonIcon icon={time} color='primary' />{' '}
                  <IonLabel>
                    <span> Duration - {duration}</span>
                  </IonLabel>
                  <br />
                  <IonIcon icon={gitCommit} color='primary' />{' '}
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
