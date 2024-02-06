# Weather and User Management Web App

This is a simple web application that connects to Firebase and provides several features including weather forecasting, user management, and user authentication.

## Features

1. **Login**: The application uses Firebase authentication for user login.
2. **Weather Information**: The homepage displays weather information fetched from a weather API. It shows the forecast for today and the next 5 days.
3. **User Management**: The application includes a table that displays active users. The table includes columns for Username, Added Date, Status, and Actions. Users can add new friends/users, delete them, and switch their status between online and offline. Users can also delete their status if needed.
4. **Location Switch**: Users can switch their location in the application.
5. **User Session**: The application maintains user sessions.

## How to Use

1. **Sign Up/Sign In**: If you're a new user, sign up using the sign-up form. If you're a returning user, sign in with your credentials.
2. **Add Friends/Users**: Navigate to the user management table and use the 'Add' button in the 'Actions' column to add new friends/users.
3. **Delete Friends/Users**: In the user management table, use the 'Delete' button in the 'Actions' column to remove friends/users.
4. **Switch User Status**: In the user management table, you can switch the status of friends/users between online and offline.
5. **Delete Status**: If needed, you can also delete the status of friends/users.
6. **Check Weather**: On the homepage, you can view the weather forecast for today and the next 5 days.
7. **Switch Location**: You can switch your location in the application to view weather information for different areas.

## Installation

1. **Clone the Repository**: First, clone the repository to your local machine using `git clone`.

```bash
git clone <repository-url>
```

2. **Install Dependencies**: Navigate into the cloned repository directory and install the necessary dependencies using `npm install` or `yarn install`.

```bash
cd <repository-name>
npm install
```

3. **Environment Variables**: Create a `.env` file in the root of your project. You will need to add the following environment variables:

```env
REACT_APP_FIREBASE_KEY=<your-firebase-key>
REACT_APP_WEATHER_API_KEY=<your-weather-api-key>
REACT_APP_FIREBASE_DB_URL=<your-firebase-db-url>
```

Replace `<your-firebase-key>`, `<your-weather-api-key>`, and `<your-firebase-db-url>` with your actual Firebase key, Weather API key, and Firebase DB URL respectively.

4. **Start the Application**: Finally, you can start the application using `npm start` or `yarn start`.

```bash
npm start
```

The application should now be running on `http://localhost:3000`.
