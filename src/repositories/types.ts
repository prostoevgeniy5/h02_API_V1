import { ObjectId, WithId } from "mongodb"

export type DbType = {
  courses: CoursesType[] | []
  videos: Videos[] | []
  posts:PostsType[] | []
  bloggers: BloggersType[] | []
  getPosts: () => PostsType[] | [] 
  getBlogs: ()  => BloggersType[] | []
}

export type Videos = WithId<{
    _id?: ObjectId
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}>

export type PostsType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}
 //  _id?: ObjectId
export type BloggersType = {
  id: string 
  name: string
  description: string
  websiteUrl: string
  createdAt:	string
  isMembership: boolean
}

export type CoursesType = {
  id: number
  _id?: ObjectId
  title: string
}

export type ReqQueryType = {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: string
  searchNameTerm?: string
  searchLoginTerm?: string
  searchEmailTerm?: string
}

export type PostViewModelType = {
  pagesCount:number
  page: number
  pageSize: number
  totalCount:number
  items: PostsType[] | []
}   

export type BlogViewModelType = {
  pagesCount:number
  page: number
  pageSize: number
  totalCount:number
  items: BloggersType[] | []
} 

export type LoginModelType = {
  loginOrEmail:	string
  password:	string
}

export interface UserInputModel {
  login: string
  password: string
  email: string
  }

export interface UserViewModel{
  _id?: ObjectId
  id: string
  login: string
  email: string
  createdAt?: string
  }

export interface UsersViewModelType {
  pagesCount:number
  page: number
  pageSize: number
  totalCount:number
  items: UserViewModel[] | []
}  

  export interface UserDBType {
    id: string
    login: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: string
  }

  export type ResultTokenType = {
    resultCode: number
    token: string
  }

  export type MeViewModel =  {
    email: string
    login: string
    userId: string
  }

  export type CommentatorInfoType = {
    userId: string
    userLogin: string
  }

  export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
  }


export type CommentViewModelType = {
  pagesCount: number
  page:	number
  pageSize:	number
  totalCount: number
  items: CommentViewModel[] | []
  }

export  interface CommentViewModelMyDBType extends CommentViewModel {
  postId: string
  blogId: string
}
