require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

app.get('/users', async (request, response) => {
  const users = await knex.select('*').from('users')
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

  const user = await knex.select('*').from('users').where('id', userId).first()

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

  const result = await knex.delete().from('users').where('id', userId)

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
    id = (await knex('users').insert(newUser)).pop()
  } catch (e) {
    response.status(400).json({
      error: 'Invalid user data'
    })
    return
  }

  newUser.Id = id

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

  const user = await knex.select('*').from('users').where('id', userId).first()

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
    await knex('users').where('Id', userId).update(user)
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