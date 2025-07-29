# Use official Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Collect static files 
RUN python manage.py collectstatic --noinput || true

# Expose default port
EXPOSE 8080

# Run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
