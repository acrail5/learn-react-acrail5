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
