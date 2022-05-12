import {createSlice, PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line
import {Insights, InsightsItem} from './types'

const localSeenMessages: string | null = window.localStorage.getItem('vcv-seen-messages')
const seenMessages = typeof localSeenMessages === 'string' ? JSON.parse(localSeenMessages) : []
const initialState = {
  insights: {},
  notifications: [],
  seenMessages: seenMessages,
  currentLevel: ''
}

const slice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    insightsAdded: (data, action: PayloadAction<InsightsItem>) => {
      if (!action.payload || !action.payload.type) {
        return
      }
      let currentLevel = data.currentLevel
      const insights: Insights = data.insights || {}
      const insightsKeys = Object.keys(insights)
      const errors = insightsKeys.filter(k => insights[k].state === 'critical' || insights[k].state === 'warning')

      if (action.payload.state === 'critical') {
        currentLevel = 'critical'
      } else if (currentLevel !== 'critical' && action.payload.state === 'warning') {
        currentLevel = 'warning'
      } else if (!errors.length && action.payload.state === 'success') {
        currentLevel = 'success'
      }
      data.currentLevel = currentLevel

      const typeData: string = action.payload.type // typeContentArea

      if (!insights[typeData]) {
        insights[typeData] = {
          title: action.payload.title,
          description: action.payload.groupDescription,
          state: action.payload.state,
          items: []
        }
      }
      insights[typeData].items.unshift(action.payload)
      data.insights = insights
    },
    insightsRemoved: (data, action: PayloadAction<string>) => {
      const notifications: Insights = data.insights

      Object.keys(notifications).forEach((notification) => {
        if (notification === action.payload) {
          delete notifications[action.payload]
        }
      })

      data.insights = notifications
    },
    insightsReset: (data) => {
      data.currentLevel = 'none'
      data.insights = {}
    },
    seenMessagesSet: (data, action) => {
      data.seenMessages = action.payload
    },
    notificationsSet: (data, action) => {
      data.notifications = action.payload
    }
  }
})

export const {insightsAdded, insightsRemoved, insightsReset, seenMessagesSet, notificationsSet} = slice.actions
export default slice.reducer
