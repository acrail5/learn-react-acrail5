import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [recipes, setRecipes] = useState([])

  async function handleLogin(event) {
    event.preventDefault()

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Login failed')
        return
      }

      setToken(data.token)
      setMessage('Login successful')
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessage('Could not connect to the API')
    }
  }

  async function loadRecipes() {
    try {
      const response = await fetch('/api/recipes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Could not load recipes')
        return
      }

      setRecipes(data)
      setMessage('Recipes loaded successfully')
    } catch (error) {
      setMessage('Could not connect to the API')
    }
  }

  function handleLogout() {
    setToken('')
    setRecipes([])
    setMessage('Logged out')
  }

  return (
    <main>
      <h1>ForKingRecipe Login Practice</h1>
      <p>Week 4 : login, JWT token, and authenticated requests.</p>

      {!token && (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>

          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button type="submit">Log In</button>
        </form>
      )}

      {token && (
        <section className="user-panel">
          <h2>You are logged in</h2>
          <p>The app saved the JWT token in React state.</p>

          <button onClick={loadRecipes}>Load Protected Recipes</button>
          <button onClick={handleLogout}>Log Out</button>
        </section>
      )}

      {message && <p className="message">{message}</p>}

      {recipes.length > 0 && (
        <section>
          <h2>Recipes From Protected API</h2>

          {recipes.map((recipe) => (
            <article className="recipe-card" key={recipe._id}>
              <h3>{recipe.recipe_name}</h3>
              <p><strong>Category:</strong> {recipe.category}</p>
              <p>{recipe.description}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default App