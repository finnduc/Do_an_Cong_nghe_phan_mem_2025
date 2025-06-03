# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=22.13.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# **************************************************************************
# ADD THIS LINE: Define a build argument to receive the variable
ARG EXPRESS_URL
# ADD THIS LINE: Set it as an environment variable for the build process
ENV EXPRESS_URL=$EXPRESS_URL
# **************************************************************************

# Download additional development dependencies before building, as Next.js requires
# devDependencies to build the application.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the Next.js build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json and package-lock.json for package manager commands.
COPY package.json package-lock.json ./

# Copy the production dependencies from the deps stage.
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the built application from the build stage.
COPY --from=build /usr/src/app/.next ./.next

# Expose the port that the application listens on.
EXPOSE 3000

# Run the Next.js application.
CMD ["npm", "start"]