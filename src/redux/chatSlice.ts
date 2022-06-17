import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatState {
  _id: string
  riderOneId: string
  riderOneName: string
  riderOneAvatar: string
  riderOneMobile: string

  riderTwoId: string
  riderTwoName: string
  riderTwoAvatar: string
  riderTwoMobile: string

  price: string
  message: [
    {
      message: string
      sender: string
      createdAt: Date
    }
  ]
  createdAt: Date
}
let initialState: ChatState[] = []

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (state: any, action: PayloadAction<ChatState>) => {
      const duplicateChat = state.find(
        (chat: any) => chat.riderTwoId === action.payload.riderTwoId
      )

      if (!duplicateChat) {
        state = state.push(action.payload)
      } else {
        // update push values to message array
        duplicateChat.message.push(action.payload.message[0])
      }
    },
  },
})

export const { setChat } = chatSlice.actions

export default chatSlice.reducer
