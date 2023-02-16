import { body } from "express-validator";
import { BloggersType} from "../repositories/db";

const bloggers : BloggersType[] = []

export function checkRequestBodyField(name: string, field: string): boolean {
    let result = false;
    if (field === 'name' || field === 'blogName') {
      body(name).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 15 }).withMessage('length must be less than 15 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 15 ? true : false;
    } else if (field === "websiteUrl") {
      body(name).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(name) ? true : false;
    } else if (field === 'title') {
      body(name).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
    } else if (field === 'description') {
      body(name).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 500 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
    } else if (field === 'shortDescription') {
      body(name).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 ? true : false;
    } else if (field === 'content') {
      body(name).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 1000 ? true : false;
    } else if (field === 'bloggerId') {
      body(name).isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom((name) => {
        let blogger: BloggersType | undefined = bloggers.find((item: BloggersType) => +item.id === +name)
      result = typeof +name !== 'number' || !blogger ? true : false;
      return result
      }).withMessage("A blogger with such a bloggerid does not exist")
      
    }
    return result
  }

// export function checkRequestBodyField (name: string): boolean {
//     let result = false;
//     switch(name) {
//       case 'name':
//       console.log(' in check of name')
//       body(name).exists().isString().notEmpty().isLength({ max: 15 }).withMessage('length must be less than 15 characters')
//       // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 15 ? true : false;
//       break
//       case "websiteUrl":
//       body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
//       // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(name) ? true : false;
//       console.log(' in body of webSiteUrl')
//       break
//       case 'title':
//       body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters')
//       // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
//       break
//       case 'content':
//         console.log(' in body of content')
//       body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters')
//       // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
//       break
//       case 'shortDescription':
//       body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters')
//       // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 ? true : false;
//       break
//       case 'description':
//         body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 500 }).withMessage('length must be less than 500 characters')
//       break
//     }
//     return result
//   }

function isInt(a: string){
  return a === ""+~~a
}
