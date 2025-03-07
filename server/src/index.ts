import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: {
        ...req.body,
        userId: '1', // TODO: Replace with actual user ID from authentication
      },
    })
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' })
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 