up:
	docker-compose up -d

recreate:
	docker-compose up -d --build --force-recreate --remove-orphans

init:
	docker-compose up --build -d
	docker-compose exec backend python -m venv env
	docker-compose exec backend python ./manage.py makemigrations
	docker-compose exec backend python ./manage.py migrate

down:
	docker-compose down
