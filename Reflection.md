\# Reflection



\## What did you ask the AI to do?



I asked the AI to help me build some of the frontend for my ForKingRecipe project using React. I needed the frontend to connect to my secured REST API and support the main user flows for my recipe entity.



I asked the AI to help me fix the bugs on the home page, sign up form, login form, protected view all recipes page, and view one recipe page. I also asked for help using JWT tokens so the user can stay logged in and access protected API routes.



\## What did it do well?



The AI helped me organize the frontend into clear pieces. It helped me understand how the React app should connect to my Express API using fetch requests.



It also helped me understand the login flow. The frontend sends the username and password to the login route, receives a JWT token, saves the token, and then sends the token in the Authorization header when requesting protected recipe data.



The AI also helped me add navigation so the app has a logical flow between the home page, sign up page, login page, all recipes page, and recipe details page.



\## What did it get wrong or what did you have to fix?



I had to make sure my backend API was running before testing the frontend. If the backend was not running, the frontend could not sign up, log in, or load recipes.



I also had to make sure CORS was added to my Express app so the React frontend could make requests to the API. I needed to check that my API routes matched the frontend fetch URLs.



Another thing I had to be careful with was the JWT token. The token needed to be included in the Authorization header using Bearer token format. Without that, the protected recipe routes would reject the request.



\## What did you learn from working with it?



I learned how a React frontend can work with a secured REST API. I learned that sign up and login are separate actions, and login is what gives the frontend a token.



I also learned how protected routes work from the frontend side. The frontend must send the JWT token with the request, and the backend checks the token before sending protected data.



I learned that frontend structure is important. Having separate views for home, sign up, login, all recipes, and recipe details makes the app easier to explain and easier to use.



This assignment helped me feel more prepared to build the final frontend because I now understand the basic flow between React, authentication, and my API.



