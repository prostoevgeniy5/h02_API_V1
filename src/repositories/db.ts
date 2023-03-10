export let db: DbType = {
    courses:[
    {id: 1, title: 'front-end'},
    {id: 2, title: 'back-end'},
    {id: 3, title: 'react'}
  ],
  videos: [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": 5,
        "createdAt": "2022-12-13T09:52:47.923Z",
        "publicationDate": "2022-12-13T09:52:47.923Z",
        "availableResolutions": [
          "P144"
        ]
      },
      {
        "id": 1,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": 15,
        "createdAt": "2022-12-13T09:52:47.923Z",
        "publicationDate": "2022-12-13T09:52:47.923Z",
        "availableResolutions": [
          "P144"
        ]
      }
  ],
  posts: [
    // {
    //   "id": "0",
    //   "title": "A S Pushkin",
    //   "shortDescription": "Message for dyadya",
    //   "content": "Moy dyadya samih chesnih pravil, kogda ne v shutku sanemog, on uvajat sebya sastavil i luchshe vidumat ne smog.",
    //   "blogId": "0",
    //   "blogName": "Mark Solonin"},
    // {
    //   "id": "1",
    //   "title": "Solomennaya shlyapka",
    //   "shortDescription": "Libetta, Lizetta, Myuzetta",
    //   "content": "Либетта, Лизетта, Мюзетта, Жонетта, Жоржетта. Вся жизнь моя вами как солнцем июньским согрета...",
    //   "blogId": "2",
    //   "blogName": "Dmitry"
    // },
    // {
    //   "id": "2",
    //   "title": "T G Shevchenko",
    //   "shortDescription": "Message for oligarhs",
    //   "content": "Якби ви знали, паничі, Де люде плачуть живучи, То ви б елегій не творили Та марне Бога б не хвалили",
    //   "blogId": "1",
    //   "blogName": "Dmitry Robionek"
    // }
  ],
  bloggers: [
    // {"id": "0", "name": "Mark Solonin", "description": "About world wars", "websiteUrl": "https://www.youtube.com/channel/UChLpUGaZO35ICTltBP50VSg"}, 
    // {"id": "1", "name": "Dmitry Robionek", "description": "About Linux Python 3", "websiteUrl": "https://www.youtube.com/user/ideafoxvideo"},
    // {"id": "2", "name": "Dmitry", "description": "About frontend and backend",  "websiteUrl": "https://www.youtube.com/c/ITKAMASUTRA"}
  ],
  getPosts: () => {
    return db.posts
  },
  getBlogs: () => {
    return db.bloggers
  }
}

export type DbType = {
  courses: CoursesType[] | []
  videos: Videos[] | []
  posts:PostsType[] | []
  bloggers: BloggersType[] | []
  getPosts: () => PostsType[] | [] 
  getBlogs: ()  => BloggersType[] | []
}

export type Videos = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}

export type PostsType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
}

export type BloggersType = {
  id: string 
  name: string
  description: string
  websiteUrl: string
}

export type CoursesType = {
  id: number
  title: string
}