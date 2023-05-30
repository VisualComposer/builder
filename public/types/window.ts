type ObjectProperty = string|number|boolean|[]

type Argument = ObjectProperty|{
  [item:string]: ObjectProperty
}

interface ArgumentsObject {
  [item:string]: Argument
}

type Arguments = ArgumentsObject|Blob

export interface EditorWindow extends Window {
  jQuery: {
    param: (obj:Arguments) => string
  },
  tinyMCEPreInit: {
    mceInit: {
      [item:string]: {
        wpautop: boolean
      }
    }
  },
  switchEditors: {
    wpautop: (value:string) => string
  },
  XMLHttpRequest: typeof XMLHttpRequest
}
