import { PostViewModelType, PostsType, BloggersType, BlogViewModelType, client, ReqQueryType, UserViewModel, UserDBType, UsersViewModelType } from "./db"
import { postsRepository } from "./posts-repository"
import { Request } from "express"
import { blogsRepository } from "./blogs-repository"
import { sortQueryItems } from "../functions/sortItems-query"
// import { usersRepository } from "./users-repository"


const blogsCollection = client.db('blogspostsvideos').collection<BloggersType>('bloggers')
const database = client.db('blogspostsvideos').collection<PostsType>('posts')
const databaseUsersCollection = client.db('blogspostsvideos').collection<UserDBType>('users')

export const getPostsOrBlogsOrUsers = {
  async getPosts(req: Request): Promise<PostViewModelType | undefined>{
    const result = await database.find({}, { projection: { _id: 0 } }).toArray()
    let resultArray: PostsType[]
    const queryObj = req.query
    let sortBy: any = 'createdAt'
    let direction: any = 'desc'
    if(result !== null) {
      // if(typeof req.query === 'string'  && typeof req.query.sortDirection === 'string') {
        if(queryObj.sortBy === undefined) {
          if(queryObj.sortDirection === undefined) {
            resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
          } else {
            direction = queryObj.sortDirection
            resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
          }
          
        // if(fieldName !== undefined && direction !== undefined) {
          // resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction}])
        // }
        } else {
          sortBy = queryObj.sortBy
          direction = queryObj.sortDirection
          resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction}])
        }
        
      // }
      
      
      let pagesCount: number, totalCount: number
      let pageNumber: number = queryObj.pageNumber !== undefined ? +queryObj.pageNumber : 1;
      let pageSize: number = queryObj.pageSize !== undefined ? +queryObj.pageSize : 10;
      let skipDocumentsCount: number = (pageNumber - 1) * pageSize
      // let sortBy: string = queryObj.sortBy === "createdAt" || queryObj.sortBy === undefined ? "createdAt" : queryObj.sortBy
      // let posts: PostsType[] = []
      // let sortDir: Sort =queryObj.sortDirection === "desc" || queryObj.sortDirection === undefined ? -1 : 1
      totalCount = resultArray.length
      pagesCount = Math.ceil( totalCount / pageSize )
      if(totalCount > pageSize) {
        resultArray = resultArray.splice(skipDocumentsCount, pageSize)
      }
      let resultObject: PostViewModelType
      // if(totalCount > 0) {
        resultObject = {
          "pagesCount": pagesCount,
          "page": pageNumber,
          "pageSize": pageSize,
          "totalCount": totalCount,
          "items": resultArray
        }
        return resultObject
      // }
    }

    return undefined
  },

  async getPostsById(id: string): Promise<PostsType[] | null>{
    const result = await postsRepository.getPostsById(id)
    if(result) {
    return result
    } else {
      return null
    }
  },
//////////////////////////////////////////////////////////////////////////
  async getBlogs(req: Request): Promise<BlogViewModelType | undefined>{
    let result: BloggersType[] = []
    const queryObj: ReqQueryType = req.query
    if(queryObj.searchNameTerm) {
      let reg = queryObj.searchNameTerm
      result = await blogsCollection.find({name:{ $regex: reg, $options: 'i'}}, { projection: { _id: 0 } }).toArray()
    } else {
      result = await blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
    }
    
    if (result.length > 0) {
      let resultArray: BloggersType[] = []
      
      let sortBy: any = 'createdAt'
      let direction: any = 'desc'

          if(queryObj.sortBy === undefined) {
            if(queryObj.sortDirection === undefined) {
              resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
            } else {
              direction = queryObj.sortDirection
              resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
            }
            
          } else {
            sortBy = queryObj.sortBy
            direction = queryObj.sortDirection
            resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction}])
          }
          
        // }
        
        
        let pagesCount: number
        let totalCount: number = resultArray.length
        let pageNumber: number = queryObj.pageNumber !== undefined ? +queryObj.pageNumber : 1;
        let pageSize: number = queryObj.pageSize !== undefined ? +queryObj.pageSize : 10;
        let skipDocumentsCount: number = (pageNumber - 1) * pageSize
        // let sortBy: string = queryObj.sortBy === "createdAt" || queryObj.sortBy === undefined ? "createdAt" : queryObj.sortBy
        // let posts: PostsType[] = []
        // let sortDir: Sort =queryObj.sortDirection === "desc" || queryObj.sortDirection === undefined ? -1 : 1
        // totalCount = result.length
        pagesCount = Math.ceil( totalCount / pageSize )
        if(totalCount > pageSize) {
          resultArray = resultArray.splice(skipDocumentsCount, pageSize)
        }
        let resultObject: BlogViewModelType
        if(totalCount > 0) {
          resultObject = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": resultArray
          }
          return resultObject
        }
     // } 

    }
    return undefined

  },

  async getBloggerById(id: string): Promise<BloggersType | null>{
   
      let result = await blogsRepository.getBloggerById(id)
    if(result !== null ) {
      return result
    } else {
      return null
    }
  },

  async getUsers(req: Request): Promise<UserViewModel[] | undefined> {
      let result: UserDBType[] | []
      // let resultArray: UserViewModel[] | []
      let resultArray: UserDBType[] | []
      let reg: string, reg2: string
      const queryObj: ReqQueryType = req.query
      if(queryObj.searchLoginTerm && queryObj.searchEmailTerm) {
        
        reg = queryObj.searchLoginTerm
        reg2 = queryObj.searchEmailTerm
        result = await databaseUsersCollection.find({$or:[{login:{ $regex: reg, $options: 'i'}}, { projection: { _id: 0 } }, {email:{ $regex: reg2, $options: 'i'}}, { projection: { _id: 0 } }]}).toArray()
        // console.log('187', result);
        
      } else if(queryObj.searchLoginTerm) {
        reg = queryObj.searchLoginTerm
        result = await databaseUsersCollection.find({login:{ $regex: reg, $options: 'i'}}, { projection: { _id: 0 } }).toArray()
      } else if(queryObj.searchEmailTerm) {
        reg = queryObj.searchEmailTerm
        result = await databaseUsersCollection.find({email:{ $regex: reg, $options: 'i'}}, { projection: { _id: 0 } }).toArray()
      } else {
        result = await databaseUsersCollection.find().toArray()
      }
          
      
      if(result.length >= 0) {  
        let sortBy: any = 'createdAt'
        let direction: any = 'desc'
          if(queryObj.sortBy === undefined) {
            if(queryObj.sortDirection === undefined) {
              resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
            } else {
              direction = queryObj.sortDirection
              resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
            }
          } else {
            sortBy = queryObj.sortBy
            if(queryObj.sortDirection === undefined) {
              resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
            } else {
              direction = queryObj.sortDirection
              resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction: direction}])
            }
            direction = queryObj.sortDirection
            resultArray = sortQueryItems(result,  [{fieldName: sortBy,  direction}])
          }
                        
          let pagesCount: number, totalCount: number
          let pageNumber: number = queryObj.pageNumber !== undefined ? +queryObj.pageNumber : 1;
          let pageSize: number = queryObj.pageSize !== undefined ? +queryObj.pageSize : 10;
          let skipDocumentsCount: number = (pageNumber - 1) * pageSize

          totalCount = resultArray.length
          // if(totalCount > 0) {

          
          pagesCount = Math.ceil( totalCount / pageSize )
          // let resultObject: UsersViewModelType  = {
          let resultObject: any = {
            pagesCount: 0,
            page: 0,
            pageSize: 0,
            totalCount: 0,
            items: []
          }
          // if(totalCount > pageSize) {
            resultArray = resultArray.splice(skipDocumentsCount, pageSize)
            const resArray: UserViewModel[] | [] = resultArray.map(item => {
              let newItem: UserViewModel = {
                id: item.id,
                login: item.login,
                email: item.email,
                createdAt: item.createdAt
              }
             return newItem
            })
            // console.log('252 restArray', resArray)
            resultObject= {
              pagesCount: pagesCount,
              page: pageNumber,
              pageSize: pageSize,
              totalCount: totalCount,
              items: resArray
            }
              return resultObject
          // }
    } else {
      return undefined
    }
  },

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType[] | null | undefined>  {
    let result: UserDBType[]
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if(pattern.test(loginOrEmail)) {
      result = await databaseUsersCollection.find( {email: loginOrEmail} ).toArray()
    }
    // result = await databaseUsersCollection.find({$or: [{login: login}, {email: email}]}).toArray()
    result = await databaseUsersCollection.find( {login: loginOrEmail} ).toArray()
    if(result.length > 0) {
      console.log('275 query0repository.ts result', result);
      
      return result
    } else if(result.length === 0) {
      return null
    } else {
      return undefined
    }
  },
}