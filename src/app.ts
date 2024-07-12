import express, { Response, Request } from 'express'
import queryBuilder from './db/connection'

const app = express()
app.use(express.json())
const port = 3000

app.get('/users', async (request: Request, response: Response): Promise<void> => {
  let users = []

  try {
    users = await queryBuilder.select('*').from('users')
  } catch (e) {
    response.status(500).json({
      error: 'Internal server error'
    })
    return
  }

  response.status(200).json(users)
})

app.get('/users/:id', async (request: Request, response: Response): Promise<void> => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  const user = await queryBuilder.select('*').from('users').where('id', userId).first()

  if (!user) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  response.status(200).json(user)
})

app.delete('/users/:id', async (request: Request, response: Response): Promise<void> => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  const result = await queryBuilder.delete().from('users').where('id', userId)

  if (!result) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  response.status(204).send()
})

app.post('/users', async (request: Request, response: Response): Promise<void> => {
  const userData = {
    first_name: request.body.first_name || '',
    last_name: request.body.last_name || '',
    email: request.body.email || '',
    phone: request.body.phone || '',
    password: request.body.password || ''
  }

  let id = null

  try {
    id = (await queryBuilder('users').insert(userData)).pop()
  } catch (e) {
    response.status(400).json({
      error: 'Invalid user data'
    })
    return
  }

  response.status(201).json({
    id: id,
    ...userData
  })
})

app.put('/users/:id', async (request: Request, response: Response): Promise<void> => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  const user = await queryBuilder.select('*').from('users').where('id', userId).first()

  if (!user) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  user.first_name = request.body.first_name || ''
  user.last_name = request.body.last_name || ''
  user.email = request.body.email || ''
  user.phone = request.body.phone || ''
  user.password = request.body.password || ''

  try {
    await queryBuilder('users').where('id', userId).update(user)
  } catch (e) {
    response.status(422).json({
      error: 'Unable to update a user'
    })
    return
  }

  response.status(200).json(user)
})

app.listen(port, () => {
  console.log(`Node backend app listening on port ${port}`)
})
