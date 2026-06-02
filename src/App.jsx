import { useEffect, useState } from 'react'
import './App.css'

function Header() {
  return (
    <header>
      <h1>ForKingRecipe Browser</h1>
      <p>Week 3 React: fetching and displaying recipe data.</p>
    </header>
  )
}

function RecipeCard({ name, type, description }) {
  return (
    <section className="recipe-card">
      <h2>{name}</h2>
      <p><strong>Type:</strong> {type}</p>
      <p>{description}</p>
    </section>
  )
}

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch('/recipes.json')

        if (!response.ok) {
          throw new Error('Could not load recipes.')
        }

        const data = await response.json()
        setRecipes(data)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  return (
    <>
      <Header />

      <main>
        <h2>Recipe List from JSON Data</h2>

        {loading && <p>Loading recipes...</p>}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {!loading && !errorMessage && (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                name={recipe.name}
                type={recipe.type}
                description={recipe.description}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default App