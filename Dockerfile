FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS app
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "start"]
