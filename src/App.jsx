import { useState } from 'react'
import './App.css'

function Header() {
  return (
    <header>
      <h1>ForKingRecipe React Practice</h1>
      <p>Learning React state, events, and forms.</p>
    </header>
  )
}

function RecipeCard(props) {
  return (
    <section className="recipe-card">
      <h2>{props.name}</h2>
      <p><strong>Type:</strong> {props.type}</p>
      <p>{props.description}</p>
    </section>
  )
}

function App() {
  const [recipes, setRecipes] = useState([
    {
      name: 'Spam Musubi',
      type: 'Snack',
      description: 'A simple local favorite made with rice, spam, and seaweed.'
    },
    {
      name: 'Chicken Alfredo',
      type: 'Dinner',
      description: 'A creamy pasta dish with chicken, noodles, and Alfredo sauce.'
    },
    {
      name: 'Fruit Smoothie',
      type: 'Drink',
      description: 'A quick drink made with fruit, milk, and ice.'
    }
  ])

  const [recipeName, setRecipeName] = useState('')
  const [recipeType, setRecipeType] = useState('')
  const [recipeDescription, setRecipeDescription] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const newRecipe = {
      name: recipeName,
      type: recipeType,
      description: recipeDescription
    }

    setRecipes([...recipes, newRecipe])

    setRecipeName('')
    setRecipeType('')
    setRecipeDescription('')
  }

  return (
    <>
      <Header />

      <main>
        <h2>My Favorite Recipes</h2>

        <form className="recipe-form" onSubmit={handleSubmit}>
          <h3>Add a New Recipe</h3>

          <label>
            Recipe Name:
            <input
              type="text"
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </label>

          <label>
            Recipe Type:
            <input
              type="text"
              value={recipeType}
              onChange={(event) => setRecipeType(event.target.value)}
            />
          </label>

          <label>
            Description:
            <textarea
              value={recipeDescription}
              onChange={(event) => setRecipeDescription(event.target.value)}
            />
          </label>

          <button type="submit">Add Recipe</button>
        </form>

        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            name={recipe.name}
            type={recipe.type}
            description={recipe.description}
          />
        ))}
      </main>
    </>
  )
}

export default App