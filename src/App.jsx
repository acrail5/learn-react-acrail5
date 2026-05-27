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