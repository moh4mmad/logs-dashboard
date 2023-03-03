FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/www/backend

# install dependencies
RUN apt-get update && \
    apt-get install -y netcat && \
    pip install --upgrade pip

# copy project
COPY . /app/www/backend

# install project dependencies
RUN pip install -r requirements.txt

CMD ["python", "/app/www/backend/manage.py", "runserver", "0.0.0.0:8000"]