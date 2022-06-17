import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RequestState {
  rideId: string
  requestType: string
  price: string
  riderOne: string
  riderOneName: string
  riderOneMobile: string
  riderTwo: string
  riderTwoName: string
  riderTwoMobile: string
}
let initialState: RequestState[] = []

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    requestRideFunc: (state: any, action: PayloadAction<RequestState>) => {
      const request = state.find(
        (s: RequestState) =>
          s.rideId === action.payload.rideId &&
          s.riderTwo === action.payload.riderTwo
      )

      if (!request) {
        state = state.push(action.payload)
      }
    },
  },
})

export const { requestRideFunc } = requestSlice.actions

export default requestSlice.reducer
