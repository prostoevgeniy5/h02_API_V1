import { blogsRepository } from "./blogs-repository"
import { client } from "./db"
import { PostsType, BloggersType } from "./db"

export const postsRepository = {
  async getPosts(): Promise<PostsType[]>{
    const result =  client.db('blogspostsvideos').collection<PostsType>('posts').find({}).toArray()
    return result
  },

  async getPostsById(id: string): Promise<PostsType[] | null>{
    if(id) {
      const result =  client.db('blogspostsvideos').collection<PostsType>('posts').find({id: id}).toArray()
      return result
    } else {
      return null
    }
  },

  async createPost(obj: PostsType): Promise<PostsType | null>{
    const blogger = await blogsRepository.getBloggerById(obj.blogId)
    console.log(blogger, 'create post after we find blog');
  
    if (blogger) {
      let name = blogger[0].name
      const newPost = {
        id: (+(new Date())).toString(),
        "title": obj.title,
        "shortDescription": obj.shortDescription,
        "content": obj.content,
        "blogId": obj.blogId,
        "blogName": name
      };
      const result = client.db('blogspostsvideos').collection<PostsType>('posts').insertOne(newPost)
      return newPost
    } else {
      return null
    }
  },

  async updatePost(id: string, obj: PostsType): Promise< boolean | null | undefined>{
    const blogger = await blogsRepository.getBloggerById(obj.blogId)
    if(blogger) {
      const post = await postsRepository.getPostsById(id)
      if(post) {
        const result = await client.db('blogspostsvideos').collection<PostsType>('posts').updateOne({id: id}, {$set: {...obj}})
        return result.matchedCount === 1
      }
    } else {
      return  null
    }
    return undefined
  },

  async deletePost(id: string): Promise<boolean | undefined>{
    const result = await client.db('blogspostsvideos').collection<PostsType>('posts').deleteOne({id: id})
    return result.deletedCount === 1
  },

  async deletePostsByBlogId(blogid: string): Promise<number | undefined>{
    const result = await client.db('blogspostsvideos').collection<PostsType>('posts').deleteMany({blogId: blogid})
    console.log('was delited ', `${result.deletedCount}`)
    return result.deletedCount
  }

}