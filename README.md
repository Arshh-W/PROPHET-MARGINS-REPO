# 🐳 Containerized Deployment

This project is containerized using Docker to ensure consistency across different development environments and streamline deployment to Azure.

## 📋 Prerequisites

Before building the container, ensure you have the following installed:

* **Docker Desktop**: [Download Docker](https://www.docker.com/products/docker-desktop/) (Ensure the daemon is running).
* **Azure CLI**: [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) (Required for pushing to Azure Container Registry).
* **Git**: For cloning the repository.

## 🛠️ Local Build Instructions

Follow these steps to build and run the Docker image on your local machine:

1.  **Navigate to the project root (where the Dockerfile is located):**
    ```bash
    cd prophet-margins
    ```

2.  **Build the Docker image:**
    This command creates an image named `prophet-margins` based on the instructions in the `Dockerfile`.
    ```bash
    docker build -t prophet-margins .
    ```

3.  **Run the Container:**
    Use the following command to start the container. This maps your local port 5000 to the container's port 5000.
    ```bash
    docker run -p 5000:5000 --env-file .env prophet-margins
    ```

## 🔑 Environment Variables

The application requires specific environment variables to function (specifically for the AI components). 

**Security Note:** Never commit your actual API keys to GitHub. Create a `.env` file in your root directory and exclude it via `.gitignore`.

| Variable Key | Description | Example Value |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | API Key for Google Gemini (The Prophet) | `AIzaSy...` |
| `FLASK_APP` | Entry point for the application | `app.py` |
| `FLASK_ENV` | Environment mode | `production` or `development` |

## 🔌 Port Mapping

The container is configured to expose the Flask backend on **Port 5000**.

* **Container Port:** `5000` (Internal)
* **Host Port:** `5000` (External/Localhost)

Once running, the API is accessible at: `http://localhost:5000`