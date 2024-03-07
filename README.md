# MockMedia

MockMedia is a three-tier web application leveraging React, Django, and MySQL. It utilizes AWS micro-services, such as Amazon Relational Database, Amazon Simple Notification Service, AWS Lambda, and Amazon Simple Storage Service, to provide an entirely decoupled architecture. The communication protocol (ASGI) provides real-time communication between servers, allowing features such as real-time notifications and messaging. Both servers are hosted on Amazon Elastic Compute Cloud, making communication extremely fast and secure.

## Features

- Account creation ✅️
- Post creation ✅️
- Likes and comments ✅️
- User profile customization ✅️
- Follow system ✅️
- Real-time messaging system ✅️
- Real-time notification system ✅
- Search Functionality ✅
- API Integration ✅

## Technologies Used

### React:

- MUI
- Flobite-React
- TailwindCSS
- Nginx

### Django:

- Django REST Framework
- Django Channels
- Uvicorn

### Cloud Services

- Redis Labs
- Amazon Relational Databases Services (RDS)
- AWS Lambda
- Amazon Simple Notification Service (SNS)
- Amazon Simple Storage Service (S3)
- Amazon Elastic Compute Service (EC2)
- Amazon Route 53

## Usage

1. Clone the git repository to your local machine

2. Make a virtual environment for both the backend and frontend. (recommended)

### React

3. Change directories to the frontend folder

4. Install the latest version of npm (node package manager).

5. Install the latest version of Node.js (use nvm for easy installation).

6. Install all of the node modules with the command ```npm install``` or ```yarn install``` if using yarn.

7. Make sure the client can run utilizing ```npm start```

- optional: if you are running Django from another web server, change settings.js to the backend public URL instead of localhost

### Django

8. Change directories to the backend folder

9. Open the .env file

10. Fill in all the API keys and log in from AWS, Redis Labs, Weather API, etc.

11. Make sure pip, Python=^3.17, and Django are installed

12. Install all of the requirements with the command ```pip install -r requirements.txt```

13. Run ```python manage.py makemigrations```

14. Run ```python manage.py migrate``` to apply the changes

### Execution

15. In the frontend folder, run ```npm start``` and open the localhost link to your browser

16. Create a separate terminal and
in the backend folder, run ```python manage.py runserver```
