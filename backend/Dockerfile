FROM python:3.10-slim

SHELL ["/bin/bash", "-c"]
WORKDIR /app

COPY . .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
WORKDIR /app/simpleforum
RUN python manage.py migrate


ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1


CMD ["python", "manage.py", "runserver"]