FROM node

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Env Variables
ENV PORT=6000

# Expose the port your app runs on (optional, if you know the port)
EXPOSE 6000

# Command to run your application
CMD ["npm", "start"]