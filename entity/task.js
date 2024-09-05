import { randomUUID } from "node:crypto"
import { title } from "node:process"

export class Task {
  #database

  constructor(database) {
    this.#database = database
  }

  async findAll() {
    const tasks = await this.#database.findAll()
    return tasks
  }
  async findById(id) {
    return this.#database.findById(id)
  }

  async create(task) {
    const date =  new Date().toISOString()
    console.log(date)
    const newTask = {
      id: randomUUID(),
      title: task.title,
      description: task?.description,
      completed_at: task?.completed_at,
      created_at: date,
      updated_at: date
    }

    return this.#database.create(newTask)
  }

  async update(id, task) {
    const date =  new Date().toISOString()
    const newTask = {
      ...task,
      updated_at: date
    }

    return this.#database.update(id, newTask)
  }

  async delete(id) {
    return this.#database.remove(id)
  }
}