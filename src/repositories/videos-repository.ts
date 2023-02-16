import { client } from "./db"
import { ObjectId, WithId, UpdateResult } from "mongodb"

const videosCollection = client.db('blogspostsvideos').collection<Videos>('videos')

export type Videos = WithId<{
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  createdAt: string
  publicationDate: string
  availableResolutions: string[]
}>

export interface UpdateVideos extends Videos  {
  _id: ObjectId
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  createdAt: string
  publicationDate: string
  availableResolutions: string[]
}

export type ErrorType = {
  
  "message": string
  "field": string
}

export type ErrorsType = {
  // "errorsMessages": ErrorType[]
  [key: string]:ErrorType[]
}

export const videosRepository = {
    async getVideos():Promise<Videos[]> {
        return videosCollection.find({}).toArray()
    },
    async getVideosById(id: ObjectId): Promise<Videos[]> {
        let videoItem = videosCollection.find({_id: id}).toArray()
        return videoItem
    },
    async deleteVideosById(id: ObjectId) {
      videosCollection.deleteOne({_id: id})

    },
    async updateVideosById(id: ObjectId, obj: Videos): Promise<UpdateResult | boolean> {
     let result: UpdateResult = await videosCollection.updateOne({_id: id}, {$set: {...obj}})
       return result.matchedCount === 1
    },
    async createVideo(obj: Videos) {
      let currentDate = new Date()
    const day = currentDate.getDate() + 1
    const dateInMs = currentDate.setDate(day)
    const date = new Date(dateInMs)
  
    // let currentDatePlus = new Date(currentDate.setDate(currentDate.getDate()))
    let minAge = obj.minAgeRestriction ? obj.minAgeRestriction : null
    const newVideo: Videos = {
      _id: new ObjectId(),
      title: obj.title,
      author: obj.author,
      canBeDownloaded: false,
      minAgeRestriction: minAge,
      createdAt: new Date().toISOString(),
      publicationDate: date.toISOString(),
      availableResolutions: obj.availableResolutions
    }

        if(newVideo) {
          videosCollection.insertOne(newVideo)
          return newVideo
        }
    },
       
}