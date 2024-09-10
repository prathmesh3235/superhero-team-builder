# Superhero Team Builder

A Next.js application to explore the World of SuperHeroes

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed.

# Setup and Run Locally

### 1. Clone the Repository

git clone https://github.com/prathmesh3235/superhero-team-builder.git
cd superhero-team-builder

### 2. Build and run the application using the Docker

docker build -t superhero-team-builder .
docker run -p 3000:3000 superhero-team-builder

### 3. Access the Application 

Open your browser and go to:
http://localhost:3000

### 4. Stop the application
docker ps
docker stop <container-id>
