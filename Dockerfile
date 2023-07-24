# Use an official Node runtime as the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Build the app
RUN npm run build

# Serve the app using serve package
RUN npm install -g serve
CMD serve -s build -l 3000
