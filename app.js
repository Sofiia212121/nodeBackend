import express from 'express'
import queryBuilder from './src/db/connection.js'

const app = express()
app.use(express.json())
const port = 3000

app.get('/users', async (request, response) => {
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

app.get('/users/:id', async (request, response) => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  let user = null

  try {
    user = await queryBuilder.select('*').from('users').where('id', userId).first()
  } catch (e) {
    response.status(500).json({
      error: 'Internal server error'
    })
    return
  }

  if (!user) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  response.status(200).json(user)
})

app.delete('/users/:id', async (request, response) => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  let result = null

  try {
    result = await queryBuilder.delete().from('users').where('id', userId)
  } catch (e) {
    response.status(500).json({
      error: 'Internal server error'
    })
    return
  }

  if (!result) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  response.status(204).send()
})

app.post('/users', async (request, response) => {
  const newUser = {
    first_name: request.body.first_name || '',
    last_name: request.body.last_name || '',
    email: request.body.email || '',
    phone: request.body.phone || '',
    password: request.body.password || ''
  }

  let id = null

  try {
    id = (await queryBuilder('users').insert(newUser)).pop()
  } catch (e) {
    response.status(400).json({
      error: 'Invalid user data'
    })
    return
  }

  newUser.id = id

  response.status(201).json(newUser)
})

app.put('/users/:id', async (request, response) => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  let user = null
  
  try {
    user = await queryBuilder.select('*').from('users').where('id', userId).first()
  } catch (e) {
    response.status(500).json({
      error: 'Internal server error'
    })
    return
  }

  if (!user) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  delete user.Id

  user.first_name = request.body.first_name || ''
  user.last_name = request.body.last_name || ''
  user.email = request.body.email || ''
  user.phone = request.body.phone || ''
  user.password = request.body.password || ''

  try {
    await queryBuilder('users').where('Id', userId).update(user)
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