import { createSlice } from '@reduxjs/toolkit'
import { getService } from 'vc-cake'
import lodash from 'lodash'

interface State {
  documentData: {
    [key: string]: ElementData
  }
}

interface ElementData {
  id: string,
  parent?: string,
  order: number
}

const createKey = getService('utils').createKey

const moveDownAfter = (state: State, id: string, step: number) => {
  const element = state.documentData[id]

  const keys = Object.keys(state.documentData)
    .filter((id) => {
      const el = state.documentData[id]
      return el.id !== element.id &&
        el.parent === element.parent &&
        el.order >= element.order
    })

  keys.forEach((elId) => {
    const elementObj = state.documentData[elId]
    elementObj.order = elementObj.order + step
  })
}

const moveBeforeAfter = (state: State, id: string, moveId: string) => {
  const element = state.documentData[id]
  const moveElement = state.documentData[moveId]

  element.order = moveElement.order
  element.parent = moveElement.parent
}

const getChildren = (state: State, id: string) => {
  return Object.keys(state.documentData)
    .map((id) => JSON.parse(JSON.stringify(state.documentData[id])))
    .filter((el) => el.parent === id)
    .sort((a, b) => a.order - b.order)
}

const cloneElement = (state: State, id: string, cloneId: string, parent: string, unChangeOrder: boolean | undefined) => {
  const obj = state.documentData[id]

  if (!obj) {
    return false
  }

  const clone = JSON.parse(JSON.stringify(obj))
  clone.id = cloneId

  if (typeof parent !== 'undefined') {
    clone.parent = parent
  }

  if (clone.metaCustomId) {
    clone.metaCustomId = false
  }

  state.documentData[cloneId] = clone

  getChildren(state, obj.id).forEach((el) => {
    const innerCloneId = createKey()
    cloneElement(state, el.id, innerCloneId, cloneId, true)
  })

  if (unChangeOrder !== true) {
    moveBeforeAfter(state, id, cloneId)
    moveDownAfter(state, cloneId, 1)
  }
}

const slice = createSlice({
  name: 'document',
  initialState: {
    documentData: {}
  },
  reducers: {
    set: (state: State, action) => {
      const id = action.payload[0]
      const options = action.payload[2]
      state.documentData[id] = action.payload[1]

      if (options && options.insertAfter) {
        moveBeforeAfter(state, id, options.insertAfter)
        moveDownAfter(state, options.insertAfter, 1)
      }
    },
    reset: (state, action) => {
      Object.keys(action.payload).forEach((id) => {
        action.payload[id].order = parseInt(action.payload[id].order)
      })
      state.documentData = action.payload
    },
    update: (state: State, action) => {
      const id = action.payload[0]
      const newData = action.payload[1]

      if (state.documentData[id]) {
        state.documentData[id] = lodash.merge(state.documentData[id], newData)
      }
    },
    remove: (state: State, action) => {
      delete state.documentData[action.payload]
    },
    appendTo: (state: State, action) => {
      const id = action.payload[0]
      const parentId = action.payload[1]
      const lastOrderIndex = action.payload[2]

      state.documentData[id].parent = parentId
      state.documentData[id].order = lastOrderIndex
    },
    moveBefore: (state, action) => {
      const id = action.payload[0]
      const beforeId = action.payload[1]

      moveBeforeAfter(state, id, beforeId)
      moveDownAfter(state, id, 1)
    },
    moveAfter: (state, action) => {
      const id = action.payload[0]
      const afterId = action.payload[1]

      moveBeforeAfter(state, id, afterId)
      moveDownAfter(state, afterId, 1)
    },
    clone: (state, action) => {
      const id = action.payload[0]
      const cloneId = action.payload[1]
      const parent = action.payload[2]
      const unChangeOrder = action.payload[3]
      cloneElement(state, id, cloneId, parent, unChangeOrder)
    }
  }
})

export const { set, reset, update, remove, appendTo, moveBefore, moveAfter, clone } = slice.actions
export default slice.reducer
