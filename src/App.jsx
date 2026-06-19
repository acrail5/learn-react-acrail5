import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom'
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
          {token && <Link to="/recipes/new">Create Recipe</Link>}
          {token && <Link to="/reviews">Reviews</Link>}
          {token && <Link to="/reviews/new">Create Review</Link>}
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
          path="/recipes/new"
          element={token ? <RecipeForm token={token} /> : <Navigate to="/login" />}
        />

        <Route
          path="/recipes/:id"
          element={token ? <RecipeDetails token={token} /> : <Navigate to="/login" />}
        />

        <Route
          path="/recipes/:id/edit"
          element={token ? <RecipeForm token={token} editMode={true} /> : <Navigate to="/login" />}
        />

        <Route
          path="/reviews"
          element={token ? <ReviewsList token={token} /> : <Navigate to="/login" />}
        />

        <Route
          path="/reviews/new"
          element={token ? <ReviewForm token={token} /> : <Navigate to="/login" />}
        />

        <Route
          path="/reviews/:id"
          element={token ? <ReviewDetails token={token} /> : <Navigate to="/login" />}
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
          This frontend connects to my secured REST API. Users can sign up, log in,
          manage recipes, and create reviews.
        </p>

        {!token ? (
          <div className="button-row">
            <Link className="button-link" to="/signup">Create Account</Link>
            <Link className="button-link" to="/login">Login</Link>
          </div>
        ) : (
          <div className="button-row">
            <Link className="button-link" to="/recipes">View Recipes</Link>
            <Link className="button-link" to="/recipes/new">Create Recipe</Link>
            <Link className="button-link" to="/reviews">View Reviews</Link>
          </div>
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
    setMessage('')

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
      console.log(error)
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
            <input name="name" type="text" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Username
            <input name="username" type="text" value={formData.username} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
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
    setMessage('')

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
      console.log(error)
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
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipes() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch('/api/recipes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message || 'Could not load recipes')
          setLoading(false)
          return
        }

        setRecipes(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setMessage('Could not connect to the API')
        setLoading(false)
      }
    }

    loadRecipes()
  }, [token])

  return (
    <main className="page">
      <div className="page-title-row">
        <h2>All Recipes</h2>
        <Link className="button-link" to="/recipes/new">Create Recipe</Link>
      </div>

      {loading && <p className="message">Loading recipes...</p>}
      {message && <p className="message">{message}</p>}

      {!loading && !message && recipes.length === 0 && (
        <p className="message">No recipes found. Create your first recipe.</p>
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

            <Link className="button-link secondary" to={`/recipes/${recipe._id}/edit`}>
              Edit
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}

function RecipeDetails({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message || 'Could not load recipe')
          setLoading(false)
          return
        }

        setRecipe(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setMessage('Could not connect to the API')
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id, token])

  async function handleDelete() {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?')

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Could not delete recipe')
        return
      }

      navigate('/recipes')
    } catch (error) {
      console.log(error)
      setMessage('Could not connect to the API')
    }
  }

  return (
    <main className="page">
      <Link className="back-link" to="/recipes">← Back to all recipes</Link>

      {loading && <p className="message">Loading recipe...</p>}
      {message && <p className="message">{message}</p>}

      {recipe && (
        <section className="card">
          <h2>{recipe.recipe_name}</h2>

          <p><strong>Category:</strong> {recipe.category}</p>
          <p><strong>Description:</strong> {recipe.description}</p>
          <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
          <p><strong>Cooking Steps:</strong> {recipe.cooking_steps}</p>

          <Link className="button-link" to={`/recipes/${recipe._id}/edit`}>
            Edit Recipe
          </Link>

          <button className="danger" onClick={handleDelete}>
            Delete Recipe
          </button>
        </section>
      )}
    </main>
  )
}

function RecipeForm({ token, editMode = false }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    recipe_name: '',
    description: '',
    ingredients: '',
    cooking_steps: '',
    category: ''
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(editMode)

  useEffect(() => {
    async function loadRecipeForEdit() {
      if (!editMode) {
        return
      }

      try {
        const response = await fetch(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message || 'Could not load recipe')
          setLoading(false)
          return
        }

        setFormData({
          recipe_name: data.recipe_name || '',
          description: data.description || '',
          ingredients: data.ingredients || '',
          cooking_steps: data.cooking_steps || '',
          category: data.category || ''
        })

        setLoading(false)
      } catch (error) {
        console.log(error)
        setMessage('Could not connect to the API')
        setLoading(false)
      }
    }

    loadRecipeForEdit()
  }, [editMode, id, token])

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const url = editMode ? `/api/recipes/${id}` : '/api/recipes'
    const method = editMode ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Could not save recipe')
        return
      }

      if (editMode) {
        navigate(`/recipes/${id}`)
      } else {
        navigate(`/recipes/${data._id}`)
      }
    } catch (error) {
      console.log(error)
      setMessage('Could not connect to the API')
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p className="message">Loading form...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="card">
        <h2>{editMode ? 'Edit Recipe' : 'Create Recipe'}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Recipe Name
            <input
              name="recipe_name"
              type="text"
              value={formData.recipe_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Ingredients
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Cooking Steps
            <textarea
              name="cooking_steps"
              value={formData.cooking_steps}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">
            {editMode ? 'Update Recipe' : 'Create Recipe'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  )
}

function ReviewsList({ token }) {
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch('/api/reviews', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message || 'Could not load reviews')
          setLoading(false)
          return
        }

        setReviews(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setMessage('Could not connect to the API')
        setLoading(false)
      }
    }

    loadReviews()
  }, [token])

  return (
    <main className="page">
      <div className="page-title-row">
        <h2>All Reviews</h2>
        <Link className="button-link" to="/reviews/new">Create Review</Link>
      </div>

      {loading && <p className="message">Loading reviews...</p>}
      {message && <p className="message">{message}</p>}

      {!loading && !message && reviews.length === 0 && (
        <p className="message">No reviews found. Create your first review.</p>
      )}

      <section className="recipe-grid">
        {reviews.map((review) => (
          <article className="recipe-card" key={review._id}>
            <h3>{review.reviewer_name}</h3>
            <p><strong>Rating:</strong> {review.rating}/5</p>
            <p>{review.comment}</p>
            <p>
              <strong>Recipe:</strong>{' '}
              {review.recipe_id?.recipe_name || 'Recipe not available'}
            </p>

            <Link className="button-link" to={`/reviews/${review._id}`}>
              View Review
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}

function ReviewDetails({ token }) {
  const { id } = useParams()

  const [review, setReview] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReview() {
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message || 'Could not load review')
          setLoading(false)
          return
        }

        setReview(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setMessage('Could not connect to the API')
        setLoading(false)
      }
    }

    loadReview()
  }, [id, token])

  return (
    <main className="page">
      <Link className="back-link" to="/reviews">← Back to all reviews</Link>

      {loading && <p className="message">Loading review...</p>}
      {message && <p className="message">{message}</p>}

      {review && (
        <section className="card">
          <h2>Review by {review.reviewer_name}</h2>
          <p><strong>Rating:</strong> {review.rating}/5</p>
          <p><strong>Comment:</strong> {review.comment}</p>
          <p>
            <strong>Recipe:</strong>{' '}
            {review.recipe_id?.recipe_name || 'Recipe not available'}
          </p>
        </section>
      )}
    </main>
  )
}

function ReviewForm({ token }) {
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState([])
  const [formData, setFormData] = useState({
    recipe_id: '',
    reviewer_name: '',
    rating: '',
    comment: ''
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
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

        if (data.length > 0) {
          setFormData((oldData) => ({
            ...oldData,
            recipe_id: data[0]._id
          }))
        }
      } catch (error) {
        console.log(error)
        setMessage('Could not connect to the API')
      }
    }

    loadRecipes()
  }, [token])

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`/api/recipes/${formData.recipe_id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewer_name: formData.reviewer_name,
          rating: Number(formData.rating),
          comment: formData.comment
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Could not create review')
        return
      }

      navigate(`/reviews/${data._id}`)
    } catch (error) {
      console.log(error)
      setMessage('Could not connect to the API')
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h2>Create Review</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Recipe
            <select
              name="recipe_id"
              value={formData.recipe_id}
              onChange={handleChange}
              required
            >
              {recipes.map((recipe) => (
                <option key={recipe._id} value={recipe._id}>
                  {recipe.recipe_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Reviewer Name
            <input
              name="reviewer_name"
              type="text"
              value={formData.reviewer_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rating
            <input
              name="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Comment
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Create Review</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  )
}

export default App