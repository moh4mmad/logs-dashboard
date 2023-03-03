#!/bin/bash

function _up() {
  docker-compose up -d
}

function _recreate() {
  docker-compose up -d --build --force-recreate --remove-orphans
}

function _down() {
  docker-compose stop
}

function _init() {
  docker-compose up --build -d
  docker-compose exec backend python -m venv env
  docker-compose exec backend python ./manage.py makemigrations
	docker-compose exec backend python ./manage.py migrate
}

case $1 in
"start") _up ;;
"recreate") _recreate ;;
"down") _down ;;
"init") _init ;;
esac