FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Render sets PORT at runtime (default to 10000 for local container runs)
ENV PORT=10000
EXPOSE 10000

# Start app with gunicorn on Render-assigned port
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} app:app"]
