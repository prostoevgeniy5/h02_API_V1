import { Router } from 'express'
import { HTTP_STATUSES } from "../repositories/constants"
import { db } from "../repositories/db"

export const deleteRouter = Router()

deleteRouter.delete('/', (req, res) => {
    db.videos = []
    db.posts = []
    db.bloggers = []
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  
  })