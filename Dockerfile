# Stage 1: Build the React Frontend
FROM node:18 AS build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Flask Backend
FROM python:3.11-slim
WORKDIR /app

# Copy python requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask code
COPY backend/ .

# Copy the React build files from Stage 1 to Flask's static folder
COPY --from=build-stage /app/frontend/dist ./static

# Expose the port Flask runs on
EXPOSE 5000

# Command to run the app (using Gunicorn for production)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]