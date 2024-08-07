import express, { Response, Request } from "express";
import queryBuilder from "./db/connection";
import User from "./models/User";
import UserRequest from "./Requests/UserRequest";

const app = express()
app.use(express.json())
const port = 3000

app.get('/users', async (request: Request, response: Response): Promise<void> => {
  let users: User[] = []

  try {
    users = User.createFromRawDataArray(await queryBuilder.select('*').from(User.getTable()))
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

  const userData = await queryBuilder.select('*').from(User.getTable()).where('id', userId).first()

  if (!userData) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  const user: User = User.createFromRawData(userData)

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

  const result = await queryBuilder.delete().from(User.getTable()).where('id', userId)

  if (!result) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  response.status(204).send()
})

app.post('/users', async (request: Request, response: Response): Promise<void> => {
  const userRequest: UserRequest = new UserRequest(request);

  let id = null

  try {
    id = (await queryBuilder(User.getTable()).insert(userRequest.toJSON())).pop()
  } catch (e) {
    response.status(400).json({
      error: 'Invalid user data'
    })
    return
  }

  if(typeof id !== 'number'){
    response.status(422).json({
      error: 'Unable to create a new user'
    })
    return
  }

  const user: User = User.createFromRequest(id, userRequest);

  response.status(201).json(user)
})

app.put('/users/:id', async (request: Request, response: Response): Promise<void> => {
  const userId = +request.params.id

  if (!userId) {
    response.status(400).json({
      error: 'Invalid user id parameter'
    })
    return
  }

  const userData = await queryBuilder.select('*').from(User.getTable()).where('id', userId).first()

  if (!userData) {
    response.status(404).json({
      error: 'User not found'
    })
    return
  }

  let user: User = User.createFromRawData(userData)

  const userRequest: UserRequest = new UserRequest(request);

  try {
    await queryBuilder(User.getTable()).where('id', userId).update(user)
  } catch (e) {
    response.status(422).json({
      error: 'Unable to update a user'
    })
    return
  }

  user = User.createFromRequest(userId, userRequest);

  response.status(200).json(user)
})

app.listen(port, () => {
  console.log(`Node backend app listening on port ${port}`)
})
