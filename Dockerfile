# Use an official Node.js image as the base image
FROM node:22-alpine As development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install dev dependencies (including nodemon)
RUN npm install --only=development

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the NestJS app in development mode using nodemon
CMD ["npm", "run", "start:dev"]


