import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
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
  car,
  close,
  gitCommit,
  location,
  personCircle,
  search,
  time,
} from 'ionicons/icons'
import useRidesHook from '../api/rides'
import { useHistory } from 'react-router'
import { style } from '../components/Style'

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation')

  setTimeout(() => {
    console.log('Async operation has ended')
    event.detail.complete()
  }, 2000)
}

const libraries: any = ['places']

const RiderOneScreen: React.FC = () => {
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
  const [plate, setPlate] = useState('')

  const history = useHistory()
  const center = {
    lat: lat,
    lng: lng,
  }

  const { postRide, getPendingRider, checkPlate } = useRidesHook()

  const {
    isLoading: isLoadingPost,
    isSuccess: isSuccessPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync: mutateAsyncPost,
  } = postRide

  const {
    isLoading: isLoadingPlate,
    isSuccess: isSuccessPlate,
    isError: isErrorPlate,
    error: errorPlate,
    mutateAsync: mutateAsyncPlate,
    data: plateData,
  } = checkPlate

  const {
    data: pendingRider,
    isLoading: isLoadingPending,
    refetch,
  } = getPendingRider

  useEffect(() => {
    if (pendingRider) {
      history.push('/ride-waiting')
    }
  }, [pendingRider, history])

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
  }, [isErrorPost, errorPost])

  useEffect(() => {
    if (isErrorPlate) {
      toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: errorPlate as string,
        color: 'danger',
        position: 'top',
        duration: 4000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorPlate, errorPlate])

  useEffect(() => {
    if (isSuccessPost) {
      refetch()
      history.replace('/waiting')
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

      checkDriverPlate()
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

  // const submit = () => {
  //   mutateAsyncPost({
  //     plate,
  //     originLatLng,
  //     destinationLatLng,
  //     origin,
  //     destination,
  //     distance,
  //     duration,
  //   } as any)
  // }

  // // @ts-ignore
  // useEffect(() => {
  //   if (isSuccessPlate) {
  //     return toast({
  //       buttons: [{ text: 'hide', handler: () => dismiss() }],
  //       message: 'Plate has found',
  //       color: 'success',
  //       position: 'top',
  //       duration: 5000,
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccessPlate])

  const checkDriverPlate = () => {
    if (!plate) {
      return toast({
        buttons: [{ text: 'hide', handler: () => dismiss() }],
        message: 'Please enter plate number',
        color: 'danger',
        position: 'top',
        duration: 4000,
      })
    }

    mutateAsyncPlate({ plate } as any)
  }

  const startTrip = () => {
    present({
      cssClass: 'my-css',
      header: 'Plate Checking',
      message: isSuccessPlate
        ? `Driver Number (${plateData.mobileNumber})`
        : 'Plate not found',
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: () =>
            mutateAsyncPost({
              origin: 'My Location',
              destination: destination,
              distance: distance,
              duration: duration,
              originLatLng: originLatLng,
              destinationLatLng: destinationLatLng,
              plate: plate,
            } as any),
        },
      ],
      onDidDismiss: (e) => {},
    })
  }

  if (isLoadingPost || !isLoaded || isLoadingPending || isLoadingPlate) {
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
              <IonItem className='bg-transparent'>
                <IonIcon slot='start' icon={car} color='primary' />
                <IonInput
                  placeholder='Plate Number'
                  inputMode='text'
                  type='text'
                  value={plate}
                  onIonChange={(e) => setPlate(e.detail.value!)}
                />
              </IonItem>
              <div style={{ marginLeft: 30 }}>
                <IonButton
                  fill='outline'
                  disabled={!plate}
                  onClick={submitHandler}
                  style={{ float: 'right', width: '100%', marginTop: 20 }}
                >
                  <IonIcon slot='start' icon={search} />
                  <IonLabel>SEARCH</IonLabel>
                </IonButton>
              </div>
            </IonList>
          </IonCard>

          <IonCard className='mx-0'>
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{
                width: width,
                height: height / 2 - 85,
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
        </div>
      </IonContent>
    </IonPage>
  )
}

export default RiderOneScreen
