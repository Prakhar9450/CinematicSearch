<h1 align="center">CinematicSearch</h1>
CinematicSearch is a React-based movie website that allows users to search for movies by title, sort them by genre, view trending and upcoming movies, and bookmark their favorite movies. The website is designed to be user-friendly and visually appealing.
<hr/>

![background](https://github.com/user-attachments/assets/b41a671c-1ca5-4245-848a-54d2c114125e)

<hr/>

# 🍿 Features

- Search and watch movies: users can search for movies by title and can watch them easily
- Genre-wise display: movies can be sorted by genre
- Trending Movies: displays a section for trending movies
- Upcoming movies: displays a section for upcoming movies
- Movie Details: users can view detailed information about each movie
- Bookmark Movies: users can bookmark their favorite movies for later viewing
- Google Authentication: users can sign in using their Google account

<hr/>

# 🍿 Technology

CinematicSearch is built using the following technologies:

- ReactJS: a popular JavaScript library for building user interfaces
- TMDB API: an API that provides movie data
- Firebase Google Authentication: a service for authenticating users with Google accounts
- Framer Motion: a React library for creating animations

<hr/>

# 🍿 How to Run the Website on Your System

## Step 1: Download and Extract the Code

## Step 2: Obtain the TMDB Movies API Key and Firebase Configuration

Before starting the website, you will need to obtain the TMDB Movies API key and Firebase configuration. Follow these steps to obtain them and add them to your `.env` file.

### ▶️ Get TMDB API Key

- Go to https://www.themoviedb.org/ and log in.
- Click on your user profile picture in the navigation bar, and select "Settings".
- In the settings, select "API" and generate an API key.

### ▶️ Firebase Setup

Note that Firebase is only required for Google authentication. If you are not using Google authentication in your application, you can skip this step.

- Go to the Firebase Console and create a new app.
- After creating the app, build a web app by clicking "Add App" and following the instructions.

![Firebase Add App Screenshot](https://github.com/user-attachments/assets/61796893-f450-4aee-96a8-204d823e9df4)

![Firebase Build App Screenshot](https://user-images.githubusercontent.com/87109400/231568774-1ea09ada-34b8-4035-80d4-90ac79c1c8ed.png)

- Copy the configuration information provided in the green line, and paste it into the `.env` file:

![image](https://user-images.githubusercontent.com/87109400/231570250-9256c1bc-6669-423a-8b95-06d9577485a0.png)

- Next, to activate Google authentication in Firebase, go to **Build > Authentication** and enable Google authentication.
- To use Google authentication in localhost, add your localhost/127.0.0.1 as an Authorized Domain at **Build > Authentication > Settings > Authorized Domains** and add localhost or 127.0.0.1 to this section.

![image](https://github.com/user-attachments/assets/9b4006c2-c849-4b29-bd0f-4991db357908)

## Step 3: Run the Website

Open your code editor (such as VS Code) and navigate to the project directory. Then, open a terminal and run the following command:

```bash
npm install
```

```bash
npm run dev
```

This will start the application. Open a web browser and navigate to http://localhost:3000 to access the website.

Note: Ensure that you have carefully added the TMDB API key and Firebase authentication configuration to your .env file. If the .env file is not working, add all the API keys and configuration manually.

<hr/>

# 🍿 Demo

- Check out our live demo at https://cinematicsearch.vercel.app/

# 😍 Contribution

Contributions are always welcome, open a **Pull Request** and help us improve our project.
