// import { Request } from 'express'
// import { CommentViewModel, CommentViewModelType } from '../repositories/types'

// export const createResultObjectWithSortingAndPagination = (req: Request, result: CommentViewModel[], sortQueryItems: any) => {
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
