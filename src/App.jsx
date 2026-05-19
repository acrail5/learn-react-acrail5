import './App.css'

function Header() {
  return (
    <header>
      <h1>ForKingRecipe</h1>
      <p>By Ammon Crail</p>
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
  return (
    <>
      <Header />

      <main>
        <h2>My Favorite Recipes</h2>

        <RecipeCard
          name="Spam Musubi"
          type="Snack"
          description="A simple local favorite made with rice, spam, and seaweed."
        />

        <RecipeCard
          name="Chicken Alfredo"
          type="Dinner"
          description="A creamy pasta dish with chicken, noodles, and Alfredo sauce."
        />

        <RecipeCard
          name="Fruit Smoothie"
          type="Drink"
          description="A quick drink made with fruit, milk, and ice."
        />
      </main>
    </>
  )
}

export default App