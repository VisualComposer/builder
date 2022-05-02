export type InsightsItem = {
  groupDescription: string,
  state: string,
  title: string,
  type: string,
  description?: string,
  domNodeSelector?: string,
  elementID?: string | null,
  groupedItems?: boolean,
  thumbnail?: string,
  loading?: boolean
}

export type Insight = {
  description: string,
  title: string,
  state: string,
  items: InsightsItem[]
}

export type Insights = {
  [key:string]: Insight,
}

export type InsightsTypeControl = {
  [key:string]: {
    index:number,
    type:string,
    title:string
  }
}
