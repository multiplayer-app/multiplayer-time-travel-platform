FROM python:3.9.5-slim-buster

ARG SERVICE_VERSION
ENV SERVICE_VERSION=$SERVICE_VERSION

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# RUN apt-get update \
#   && apt-get -y install netcat gcc \
#   && apt-get clean

RUN pip install --upgrade pip

COPY . .

RUN pip install -r requirements.txt

EXPOSE 3000
ENTRYPOINT ["python", "./src/app.py"]
