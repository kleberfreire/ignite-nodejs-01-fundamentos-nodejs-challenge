// import { randomUUID } from 'node:crypto'

import { Database } from './entity/database.js'
import { Task } from './entity/task.js'
import { buildRoutePath } from './utils/build-route-path.js'

const DATABASE_PATCH = './database/database.csv'

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      try {
        const { search } = req.query
     
        const databasePath = new URL(DATABASE_PATCH, import.meta.url)
  
        const database = new Database(databasePath)
  
        const task = new Task(database)
  
        const tasks = await task.findAll()
  
        return res.end(JSON.stringify(tasks))
      } catch (error) {
        console.error(error)
        res.writeHead(404).end()
      }

    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      try {
        const { id } = req.params
     
        const databasePath = new URL(DATABASE_PATCH, import.meta.url)
  
        const database = new Database(databasePath)
  
        const task = new Task(database)
  
        const tasks = await task.findById(id)
  
        return res.end(JSON.stringify(tasks))
      } catch (error) {
        console.error(error)
        res.writeHead(404).end()
      }

    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      console.log(req.body)
      const { title, description, completed_at } = req?.body
      if(!title || !description || !completed_at) {
        return res.writeHead(400).end()
      }
 
      const databasePath = new URL(DATABASE_PATCH, import.meta.url)
  
      const database = new Database(databasePath)

      const task = new Task(database)
      const newTask = {
        title,
        description,
        completed_at
      }

      await task.create(newTask)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      if(!id) {
        return res.writeHead(400).end()
      }
      const { title, description, completed_at } = req?.body
      if(!title  && !description && !completed_at) {
        return res.writeHead(400).end()
      }
      const databasePath = new URL(DATABASE_PATCH, import.meta.url)
  
      const database = new Database(databasePath)

      const task = new Task(database)
      const newTask = {}

      if(title) {
        newTask.title = title
      } 

      if(description) {
        newTask.description = description
      }

      if(completed_at) {
        newTask.completed_at = completed_at
      } 

      task.update(id, newTask)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const databasePath = new URL(DATABASE_PATCH, import.meta.url)
  
      const database = new Database(databasePath)

      const task = new Task(database)
      task.delete(id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const databasePath = new URL(DATABASE_PATCH, import.meta.url)
  
      const database = new Database(databasePath)

      const task = new Task(database)
      const newTask = {}
      newTask.completed_at = null
      
      task.update(id, newTask)

      return res.writeHead(204).end()
    }
  }
]
