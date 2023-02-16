import { client } from "./db"
import { ObjectId, WithId, UpdateResult } from "mongodb"

// const videos: Videos[] =  videosCollection.find().toArray()

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

// export interface ErrorType {
//     errorsMessages:  Array<{
//         message: string
//         field: string
//       }>;
//   }

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

        // let ind = null
        // db.videos.forEach((item: Videos, index: number) => {
        //     if(item.id === index) {
        //         ind = index
        //     }
        //   })
        //   if (ind) {
        //     db.videos.splice(ind, 1)
        //     return true
        //   } else {
        //     return false
        //   }
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
        // const newVideo: Videos = { 
        //     _id: new ObjectId(),
        //     title: obj.title,
        //     author: obj.author,
        //     canBeDownloaded: false,
        //     minAgeRestriction: 1,
        //     createdAt: "2022-12-13T09:52:47.923Z",
        //     publicationDate: "2022-12-13T09:52:47.923Z",
        //     availableResolutions: obj.availableResolutions
        //   }
        if(newVideo) {
          videosCollection.insertOne(newVideo)
          return newVideo
        }
    },
    // async putOrDeleteData (req: Request, res: Response, methodName: string): Videos | ErrorsType | undefined {
    //     const erMess: ErrorsType = {"errorsMessages": [] }
    //     switch(methodName as string) {
    //       case 'put' :
    //         if(! (typeof +req.params.id === 'number' && db.videos.find((el: Videos)   => {
    //             return el.id === +req.params.id })) ) {
    //               return
    //         } if (!req.body.title || typeof req.body.title === null || req.body.title.length > 40) {
    //               erMess.errorsMessages.push(
    //                 {
    //                   "message": "Bad body data",
    //                   "field": "title"
    //                 }
    //               )
                  
    //         } if (!req.body.author || typeof req.body.author === null || req.body.author.length > 20) {
    //           erMess.errorsMessages.push(
    //             {
    //               "message": "Bad body data",
    //               "field": "author"
    //             }
    //           )
    //         } if (req.body.publicationDate && (typeof req.body.publicationDate !== "string")) {
    //           erMess.errorsMessages.push(
    //             {
    //               "message": "Bad body data",
    //               "field": "publicationDate"
    //             }
    //           )
              
    //         } if (req.body.canBeDownloaded && (typeof req.body.canBeDownloaded !== "boolean")) {
    //               erMess.errorsMessages.push(
    //                 {
    //                   "message": "Bad body data",
    //                   "field": "canBeDownloaded"
    //                 }
    //               )
                  
    //         } if (req.body.minAgeRestriction && (typeof req.body.minAgeRestriction !== "number" || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18)) {
    //           erMess.errorsMessages.push(
    //             {
    //               "message": "Bad body data",
    //               "field": "minAgeRestriction"
    //             }
    //           )
    //         } if(erMess.errorsMessages.length > 0) {
    //           return erMess
    //         } else {
    //           const resultVideoItem: Videos | undefined = videosRepository.updateVideosById(+req.params.id, req.body)
    //           if(resultVideoItem) {
    //             return resultVideoItem
    //           }
    //           return undefined
    //         }
    //       break;
    //       case 'delete' :
    //       const findResult = db.videos.find((el: Videos)   => {
    //         return el.id === +req.params.id })

    //       if(typeof findResult === 'undefined') {
    //           return
    //       } else {
    //         let resultVideoItem: Videos | undefined = db.videos.find((el: Videos)   => {
    //           return el.id === +req.params.id })
    //         return resultVideoItem
    //       }
    //     }
        
    //   }
       
}