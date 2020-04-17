# Movie-Application
A web application build using Django web framework.

## Installation (MAC)
You would need python and pipenv for this project. For mac system, please refer to steps below.

First install xcode:
```
--xcode-select --install
```
Install homebrew:
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Install python:
```
brew install python
```
Install pipenv (python virtual development environment):
```
brew install pipenv
```

## Getting Started

Clone this project to your local computer in terminal:
```
git clone https://github.com/caviarLuv/Movie-Application.git
```

Go to the project folder and install dependencies needed for the application:
```
cd Movie-Application
pipenv install
```

Develop and test application within pipenv shell, you can enter the shell by the follow command:
```
pipenv shell
```

## Start development server
"manage.py" is used to start the development server:
```
python3 webapplication/manage.py runserver
```

## Project core structure
```
Movie-Application
|_webapplication          //project name
  |_ manage.py            //main script to start server
  |_ movieApp             //application name
    |_urls.py             //for application routing purpose
    |_views.py            //application view (right now is combined with database operation)
    |_db_conn.py          //mongodb connector (maybe group the database operation here later...)
  |_ templates            //storing html code/html template
    |_ movieApp           //store specific html for movieApp
  |_ webapplication       //project settings
    |_settings.py         //django settings
    |_wsgi.py             // probably only need it for deployment

```
