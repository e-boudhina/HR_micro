# Use the official Node.js LTS image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

#Solve the problem reinstaling bcrypt
#RUN npm uninstall bcrypt
#RUN npm i bcrypt

# Build the Nest.js application
#RUN npm run build

# Expose the port that your Nest.js application will run on
#EXPOSE 3000

# Command to run your application
#CMD [ "npm", "uninstall", "bcrypt" ]
#CMD [ "npm", "install", "bcrypt" ]
#CMD ["npm", "start"]
