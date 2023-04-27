import { PostViewModelType, PostsType, BloggersType, BlogViewModelType, ReqQueryType, UserViewModel, UserDBType, UsersViewModelType, CommentViewModelMyDBType, CommentViewModel, CommentViewModelType } from "./types"
import { createResultObjectWithSortingAndPagination, sortQueryItems } from "../functions/sortItems-query"
import { Request } from "express"
import { blogsRepository } from "./blogs-repository"
// import { sortQueryItems } from "../functions/sortItems-query"
import { client } from './db'
import { WithId } from "mongodb"
// import { usersRepository } from "./users-repository"


const blogsCollection = client.db('blogspostsvideos').collection<BloggersType>('bloggers')
const database = client.db('blogspostsvideos').collection<PostsType>('posts')
const databaseUsersCollection = client.db('blogspostsvideos').collection<UserDBType>('users')
const databaseCommentsCollection = client.db('blogspostsvideos').collection<CommentViewModelMyDBType>('comments')

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
//////////////////////////////////////////////////////////
  async getPostsById(id: string): Promise<PostsType[] | null>{
    const result = await database.find({ id: id }, { projection: { _id: 0 } }).toArray()
    if(result.length > 0) {
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
     // } 

    }
    return undefined

  },
///////////////////////////////////////////////////////////
  async getBloggerById(id: string): Promise<BloggersType | null>{
   
      let result = await blogsRepository.getBloggerById(id)
    if(result !== null ) {
      return result
    } else {
      return null
    }
  },
/////////////////////////////////////////////////
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
                id: item.accountData.id,
                login: item.accountData.login,
                email: item.accountData.email,
                createdAt: item.accountData.createdAt
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
////////////////////////////////////////////////
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null | undefined>  {
    let result: UserDBType[]
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    // if(pattern.test(loginOrEmail)) {
    //   result = await databaseUsersCollection.find( {'accountData.email': loginOrEmail} ).toArray()
    // }
    result = await databaseUsersCollection.find({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]}).toArray()
    // result = await databaseUsersCollection.find( {login: loginOrEmail} ).toArray()
    if(result.length > 0) {
      console.log('250 query0repository.ts result', result);
      
      return result[0]
    } else if(result.length === 0) {
      return null
    } else {
      return undefined
    }
  },
////////////////////////////////////////////////////
  async findUserById(id: string): Promise<UserViewModel | undefined>{
    const user = await databaseUsersCollection.findOne({id: id})
    if(user) {
      let resultUser: UserViewModel
      if(user.accountData.createdAt) {
        resultUser = {
          id: user.accountData.id,
          email: user.accountData.email,
          createdAt: user.accountData.createdAt,
          login: user.accountData.login
        }
      } else {
        resultUser = {
          id: user.accountData.id,
          email: user.accountData.email,
          login: user.accountData.login
        }
      }
      return resultUser
    }
    return undefined
  },
//////////////////////////////////////////////////
  async getCommentById(id: string): Promise<CommentViewModel | undefined >{
    const comment: CommentViewModelMyDBType | null = await databaseCommentsCollection.findOne({id: id}, {projection: {_id: 0}})
    if(comment === null) {
      return undefined
    }
    let commentResultObj: CommentViewModel = {
      id: comment.id,
      content: comment.content,
      commentatorInfo: { 
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      createdAt: comment.createdAt
    }
    return commentResultObj
  },
///////////////////////////////////////////////////////////
  async getComments(req: Request): Promise<CommentViewModelType | undefined> {
    let result = await databaseCommentsCollection.find({postId: req.params.id}, {projection: {_id: 0}}).toArray()
    
    if(result.length > 0) {
      const resultArray: CommentViewModel[] = result.map((el, ind) => {
        const newElement: CommentViewModel = {
          id: el.id,
          content: el.content,
          commentatorInfo: {
            userId: el.commentatorInfo.userId,
            userLogin: el.commentatorInfo.userLogin
          },
          createdAt: el.createdAt
        }
        return newElement
      })

      const resultObj: CommentViewModelType | null = createResultObjectWithSortingAndPagination(req, resultArray, sortQueryItems)
      // console.log('318 query-reposn getComments resultObj', resultObj)
      if(resultObj !== null) {
        return resultObj
      }
      
    } else {
      return undefined
    }
   
  },
////////////////////////////////////////////////
  async getUserByConfirmationCode(code: string): Promise<UserDBType | undefined>{
    const result: UserDBType | null = await databaseUsersCollection.findOne({"emailConfirmation.confirmationCode": code})
    if(!result) {
      return undefined
    }
    return result
  },

  async checkExistingUser(login: string, email: string): Promise<string | null>{
   
    const user: UserDBType | null = await databaseUsersCollection.findOne({$or: [{"accountData.email": email}, {"accountData.login": login}]})
      if( user !== null && user.accountData) {
        if(login !== user.accountData.login) {
          return 'login'
        } else {
          return 'email'
        }
      }
      
      return  null
    
    //findbylogin
    //return login
    //findbyemail
    //return email
    //if all  no good return null
  }
}
// function createResultObjectWithSortingAndPagination(req: Request, result: CommentViewModel[], sortQueryItems: any) {
//   const queryObj = req.query
//   let sortBy = queryObj.sortBy !== undefined ? queryObj.sortBy : 'id'
//   let direction = queryObj.sortDirection !== undefined ? queryObj.sortDirection : 'desc'
//   let resultArray: CommentViewModel[] = sortQueryItems(result,  [{fieldName: sortBy,  direction}])

//   let pagesCount: number
//   let totalCount: number = resultArray.length
//   let pageNumber: number = queryObj.pageNumber !== undefined ? +queryObj.pageNumber : 1;
//   let pageSize: number = queryObj.pageSize !== undefined ? +queryObj.pageSize : 10;
//   let skipDocumentsCount: number = (pageNumber - 1) * pageSize
//   pagesCount = Math.ceil( totalCount / pageSize )
//   resultArray = resultArray.splice(skipDocumentsCount, pageSize)
//   if(resultArray.length > 0) {
//     const obj: CommentViewModelType = {
//       pagesCount,
//       page:	pageNumber,
//       pageSize,
//       totalCount,
//       items: resultArray
//     }
//       return obj
//   } else {
//     return null
//   }
// }
