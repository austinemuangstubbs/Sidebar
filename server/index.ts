import { Hono } from 'hono'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})


const app = new Hono()

app.post('/game-turn', async (c) => {
  const body = await c.req.json()

  // if no record is found, create a new one, otherwise update the existing one on a postgres database
  const { data, error } = await pool.query('INSERT INTO game_turns (id, name, email) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2, email = $3', [body.id, body.name, body.email])

  if (error) {
    return c.text('Error: ' + error.message)
  }


  return c.text('Record created or updated')
})

export default app