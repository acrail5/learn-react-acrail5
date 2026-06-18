import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  function loginUser(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logoutUser() {
    localStorage.removeItem('token')
    setToken('')
  }

  return (
    <BrowserRouter>
      <header className="site-header">
        <h1>ForKingRecipe</h1>

        <nav>
          <Link to="/">Home</Link>
          {!token && <Link to="/signup">Sign Up</Link>}
          {!token && <Link to="/login">Login</Link>}
          {token && <Link to="/recipes">Recipes</Link>}
          {token && <button onClick={logoutUser}>Logout</button>}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login loginUser={loginUser} />} />
        <Route
          path="/recipes"
          element={token ? <RecipesList token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/recipes/:id"
          element={token ? <RecipeDetails token={token} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

function Home({ token }) {
  return (
    <main className="page">
      <section className="hero">
        <h2>Welcome to ForKingRecipe</h2>
        <p>
          Users please sign up, log in, and view recipes from a secured REST API.
        </p>

        {!token ? (
          <div className="button-row">
            <Link className="button-link" to="/signup">Create Account</Link>
            <Link className="button-link" to="/login">Login</Link>
          </div>
        ) : (
          <Link className="button-link" to="/recipes">View Recipes</Link>
        )}
      </section>
    </main>
  )
}

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Sign up failed')
        return
      }

      setMessage('Account created successfully. Please log in.')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (error) {
      setMessage('Could not connect to the API')
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Username
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Create Account</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  )
}

function Login({ loginUser }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Login failed')
        return
      }

      loginUser(data.token)
      navigate('/recipes')
    } catch (error) {
      setMessage('Could not connect to the API')
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  )
}

function RecipesList({ token }) {
  const [recipes, setRecipes] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch(`/api/recipes/${id}`, {
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
      } catch (error) {
        setMessage('Could not connect to the API')
      }
    }

    loadRecipes()
  }, [token])

  return (
    <main className="page">
      <h2>All Recipes</h2>

      {message && <p className="message">{message}</p>}

      {recipes.length === 0 && !message && (
        <p>No recipes found. Create recipes in your API first.</p>
      )}

      <section className="recipe-grid">
        {recipes.map((recipe) => (
          <article className="recipe-card" key={recipe._id}>
            <h3>{recipe.recipe_name}</h3>
            <p><strong>Category:</strong> {recipe.category}</p>
            <p>{recipe.description}</p>
            <Link className="button-link" to={`/recipes/${recipe._id}`}>
              View Details
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}

function RecipeDetails({ token }) {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadRecipe() {
      try {
        const response = await fetch(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message || 'Could not load recipe')
          return
        }

        setRecipe(data)
      } catch (error) {
        setMessage('Could not connect to the API')
      }
    }

    loadRecipe()
  }, [id, token])

  return (
    <main className="page">
      <Link to="/recipes">← Back to all recipes</Link>

      {message && <p className="message">{message}</p>}

      {recipe && (
        <section className="card">
          <h2>{recipe.recipe_name}</h2>
          <p><strong>Category:</strong> {recipe.category}</p>
          <p><strong>Description:</strong> {recipe.description}</p>
          <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
          <p><strong>Cooking Steps:</strong> {recipe.cooking_steps}</p>
        </section>
      )}
    </main>
  )
}

export default App