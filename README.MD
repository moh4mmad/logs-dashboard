## Logs Dashboard

This is a web-based application that allows users to manage logs and provides an analytical dashboard that displays interesting metrics about the logs. The application is built using Django REST framework for the backend and React for the frontend. It uses Postgres as the database to store log data.

## Key Features
- Register
- Login
- CRUD Operations
- Searching/Filtering
- Data Visualization
- Logging
- Pagination
- Data Export
- Unit Testing

## Tech Stack

- Django
- PostgreSQL
- ReactJs
- Next.js

## Prerequisites

- Python 3.11.0
- Django 3.2.7
- Django REST Framework 3.12.4
- Requests 2.28.2
- Node.js version 14 or above
- PostgreSQL
- Docker (optional)

## Live
- Frontend `https://logs-dashboard-frontend.vercel.app/`
- Backend `https://logs-dashboard-backend.vercel.app/`

## Environment Set Up

This application can be installed and used with or without Docker. Below are the installation and usage instructions for both methods.

### With Docker:

- Clone the repository to your local machine.
- Open the terminal and navigate to the root directory of the repository.
- Copy `.env.example` to `.env` in the ./backend dir
- Copy `.env.example` to `.env` in the ./frontend dir and change the `NEXT_PUBLIC_API_URL` according to your API URL. 
- Run the following command:
- `make init` or `sh ./app.sh init` 
  - This command will build the environment using the docker-compose command.
  - It will then run the database migrations
- `make up`
  - This command runs the environment using the docker-compose command.
- `make recreate`
  - This command will recreate the docker image
- To stop the environment, run the following command
  - `make down`

### Without Docker

#### Backend Installation
- Navigate to the backend directory `cd backend`
- Create a virtual environment and activate it 
  - `python -m venv env`
  - `source env/bin/activate`
- Copy `.env.example` to `.env` and config the database information. 
- Install the dependencies `pip install -r requirements.txt`
- Migrate the database
  - `python ./manage.py makemigrations`
  - `python ./manage.py migrate`
- Start the server
  - `python ./manage.py runserver`
  - The backend is now ready to use. Access the API at `http://localhost:8000/`.
#### Frontend Installation
- Navigate to the frontend directory. `cd frontend`
- Install the dependencies `npm install`
- Copy `.env.example` to `.env` and change the `NEXT_PUBLIC_API_URL` according to your API URL. 
- Start the server
  - For development `npm run dev`
  - For production
    - `npm run build`
    - `npm start`

The frontend is now ready to use. Access it at `http://localhost:3000`.

## ER Diagram

The following diagram explains the relationship between User and Log entities. There is a One-to-Many relationship between Users and Logs and one user can create multiple logs.

![ER Diagram](https://i.ibb.co/gwvDMd7/er-diagram.png)

## API Endpoints

Endpoint | HTTP Method | Parameter | Description
| :--- | :---: | :---: | :---:
`/auth/register`  | POST | `name, email, and password` | User Register
`/auth/login`  | POST | `email and password` | User login
`/auth/refresh` | GET |  |Refresh Access Token
`/auth/check` | GET |  | Auth check
`/auth/logout` | GET | `refresh_token` | User logout
`/log`  | POST | `message, severity, source` | Create log
`/log`  | GET | optionals: `start_date and end_date, severity, source` for filter | Retrieve all logs
`/log/:id`  | GET |  | Retrieve a single log
`/log/:id`  | PUT | `message, severity, source` | Modify a single log
`/log/:id`  | DELETE |  | Delete a single log
`/log-aggregate` | GET | optionals: `start_date and end_date, severity, source` for filter | Retrieve aggregated log data
`/log-aggregate-chart` | GET | required: `label: severity or source`,  optionals: `start_date and end_date, severity, source` | Retrieve aggregated log data for Data Visualization
`/log-export` | GET |  |  Export log data as a CSV file

## Unit Testing

The unit tests were created using Django's built-in TestCase class and APIClient for making HTTP requests to the API. The tests covered the following endpoints:

- Register
- Login
- View Logs
- Create Logs
- Update Logs
- Log Aggregates
- Chart log Aggregates
- CSV Export

To run the test unit, use the command below
- `python ./manage.py test`

## Design Decisions

### Backend
- Django REST Framework is used to create a REST API to serve data for the frontend to consume.
- A PostgreSQL database is used to store the log data with columns such as timestamp, message, severity, and source.
- DRF's serializers are used for validation and serialization of input and output data.
- JWT authentication is used for securing the REST API.
- Django's built-in support for pagination is used to paginate the logs.

### Frontend
- ReactJS & NextJs is used to create the frontend application.
- MUI (Material-UI) React library is used as a design library for building UI components.
- Axios is used to make HTTP requests to the backend REST API.
- React apexcharts is used for charting and visualizing data.

## Implementation Details

### Backend
- Used Django Rest Framework (DRF) to create the REST API.
- Used Django ORM to manage database models, migrations, and queries.
- Used JWT authentication to secure the API endpoints.
- Created separate files for models, serializers, views for better organization and maintainability.
- Implemented pagination for the log list page using DRF's built-in pagination feature.
- Implemented CRUD operations for logs using DRF's generic views.
- Implemented filtering and searching for logs using DRF's filtering and searching features.
- Implemented aggregated log data queries using Django ORM's aggregate and annotate functions.
- Used logging module to log important events.


### Frontend
- Used Next.js with React to create the frontend application.
- Used MUI (Material-UI) React library for UI components and styling.
- Created separate files for pages, components, and API requests for better organization and maintainability.
- Implemented the log list page using MUI's DataGrid component with sorting, filtering, searching, and pagination features.
- Implemented the log detail page using a form with validation and submission to the API.
- Implemented the log creation page using a form with validation and submission to the API.
- Implemented the log-aggregate and log-aggregate-chart pages using MUI's Chart.js integration to display aggregated log data for the selected date range, severity, and source.
- Implemented the log-export feature using a download button that triggers an API request to generate a CSV file of the selected logs.

## Deployment
- Dockerized the application with separate containers for the frontend and backend.
- Used docker-compose to manage the containers and create the development environment.
