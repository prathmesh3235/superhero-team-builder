# Superhero Team Builder

A Next.js application to explore the World of SuperHeroes

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed.

## Setup and Run Locally

### 1. Clone the Repository

 git clone https://github.com/prathmesh3235/superhero-team-builder.git
 cd superhero-team-builder

### 2. Build and run the application using the Docker

##### docker build -t superhero-team-builder .
##### docker run -p 3000:3000 superhero-team-builder

### 3. Access the Application 

Open your browser and go to:
http://localhost:3000

### 4. Stop the application
##### docker ps
##### docker stop container-id
----------------------------------------
----------------------------------------
----------------------------------------

# Instructions to Deploy the Application to Red Hat OpenShift

1. Create an account and sign in to Red Hat Developer Sandbox:
   https://developers.redhat.com/developer-sandbox

2. In OpenShift, go to the left-side menu and click "+Add", then select "Import from Git".

3. Specify your Git repo URL. Example:
   https://github.com/prathmesh3235/superhero-team-builder.git

4. Add a `Dockerfile` to the repository if it’s not already there. You can refer to:
   https://github.com/redhat-developer-demos/next.js-openshift-example/blob/main/Containerfile

5. OpenShift will detect the `Dockerfile`. If not detected, click "Import Edit Strategy", select "Dockerfile", and provide the path.

6. Choose a "Resource Type" (Deployment or Serverless Deployment based on preference).

7. Under "Advanced Options", set the Target Port to `3000` for container traffic.

8. Click "Create" and wait for the deployment to complete. You can monitor the logs in the Topology view.

9. Once the deployment is finished, click the ↗ OpenURL icon to view your running Next.js app on OpenShift.


