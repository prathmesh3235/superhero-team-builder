FROM registry.access.redhat.com/ubi8/nodejs-18:latest AS base

   USER root

   # Copy package.json and package-lock.json
   COPY package*.json ./

   # Install app dependencies
   RUN npm ci

   # Copy the dependencies into a minimal Node.js image
   FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:latest AS final

   # Copy the app dependencies
   COPY --from=base /opt/app-root/src/node_modules /opt/app-root/src/node_modules
   COPY . /opt/app-root/src

   # Build the packages in minimal image
   RUN npm run build

   # Elevate privileges to change owner of source files
   USER root
   RUN chown -R 1001:0 /opt/app-root/src

   # Create a directory for the SQLite database and set permissions
   RUN mkdir -p /opt/app-root/src/prisma/data && chown -R 1001:0 /opt/app-root/src/prisma/data

   # Restore default user privileges
   USER 1001

   # Set environment variables
   ENV PORT=8080
   ENV DATABASE_URL="file:/opt/app-root/src/prisma/data/dev.db"

   # Container exposes port 8080
   EXPOSE 8080

   # Generate Prisma client
   RUN npx prisma generate

   # Start node process
   CMD ["npm", "run", "start"]