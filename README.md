# Superhero Team Builder

An interactive web application where you can explore superheroes, create your dream teams, and engage in epic battles. Browse through a diverse list of heroes and villains, view detailed stats, and save your favorites. Use our recommendation tools to assemble balanced teams or random squads based on unique powers and alignments. Whether you're strategizing for the perfect lineup or just having fun, this app brings your superhero fantasies to life!

### Prerequisites

- Make sure to have [Docker](https://www.docker.com/get-started) installed.

## Setup and Run Locally

### 1. Clone the Repository

 git clone https://github.com/prathmesh3235/superhero-team-builder.git
 
 cd superhero-team-builder

### 2. Build and run the application using the Docker

docker build -t superhero-team-builder .

docker run -p 3000:3000 superhero-team-builder

### 3. Access the Application 

Open your browser and go to:
http://localhost:3000

Become an admin to get access to change the SuperHero Data.

Use ADMIN CODE : "ADMIN" during Registeration 

### 5. To Stop the application
docker ps

docker stop container-id

----------------------------------------
----------------------------------------

# Instructions to Deploy the Application to Red Hat OpenShift
----------------------------------------

## Initial Setup
1. **Create an account and sign in** to Red Hat Developer Sandbox:
   [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox).

## Deploy The Application
2. **Navigate to Import from Git**:
   - In OpenShift, go to the left-side menu and click "+Add".
   - Select "From Dockerfile".

3. **Specify Git Repository URL**:
   - Example: `https://github.com/prathmesh3235/superhero-team-builder.git`.

4. **Ensure the Dockerfile is included in the repository**:
   - You can refer to this example Dockerfile for Next.js:
     [Next.js Example Dockerfile](https://github.com/redhat-developer-demos/next.js-openshift-example/blob/main/Containerfile).

5. **Set Build Configuration**:
   - OpenShift should automatically detect the `Dockerfile`. If not, click "Builder" under "Import Strategy", select "Dockerfile", and specify the path to it in the repository.

6. **Configure Application and Component Details**:
   - Name the application and component appropriately.

7. **Resource Configuration**:
   - Choose "Resource Type" based on your preference (Deployment or Serverless).

8. **Storage for SQLite**:
   - Go to "Advanced Options" in the setup process and add storage:
     - Choose “Persistent Volume Claim”.
     - Specify storage size and access mode (ReadWriteOnce).
     - Mount path should be `/opt/app-root/src/prisma/data` where SQLite expects the database file.

9. **Create and Monitor Deployment**:
   - Click "Create".
   - Monitor the build and deployment process in the "Topology" view.

## Access and Manage Your Application
10. **Access Your Application**:
    - Once the deployment is finished, click the ↗ OpenURL icon to view your running Next.js app on OpenShift.

## Notes
- **Considerations for SQLite**: SQLite is a file-based database and not ideal for containerized environments like OpenShift. For production environments, consider using a more robust database system like PostgreSQL.
