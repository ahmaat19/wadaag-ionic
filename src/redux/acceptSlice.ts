import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AcceptState {
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
let initialState: AcceptState[] = []

export const acceptSlice = createSlice({
  name: 'accept',
  initialState,
  reducers: {
    acceptRideFunc: (state: any, action: PayloadAction<AcceptState>) => {
      const accept = state.find(
        (s: AcceptState) =>
          s.rideId === action.payload.rideId &&
          s.riderTwo === action.payload.riderTwo
      )

      if (!accept) {
        state = state.push(action.payload)
      }
    },
  },
})

export const { acceptRideFunc } = acceptSlice.actions

export default acceptSlice.reducer
