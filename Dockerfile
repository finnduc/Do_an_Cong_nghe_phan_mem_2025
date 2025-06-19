# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.0

# Base image
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

# Stage for installing production dependencies
FROM base as deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Stage for building the application
FROM base as build
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files
COPY . .
# Define build arguments and environment variables
ARG EXPRESS_URL
ENV EXPRESS_URL=$EXPRESS_URL
ARG NEXT_PUBLIC_EXPRESS_URL
ENV NEXT_PUBLIC_EXPRESS_URL=$NEXT_PUBLIC_EXPRESS_URL
ARG NEXT_PUBLIC_FASTAPI_URL
ENV NEXT_PUBLIC_FASTAPI_URL=$NEXT_PUBLIC_FASTAPI_URL
# Run the build
RUN npm run build

# Final stage for running the application
FROM base as final
ENV NODE_ENV=production
USER node
COPY package.json package-lock.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
EXPOSE 4000
CMD ["npm", "start"]