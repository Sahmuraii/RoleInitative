@echo off

:: Check if Docker is running by using docker info
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop is not running. Please start Docker Desktop and try again.
    exit /b 1
)

:: Set the image name and container name
set imageName=flask-app
set containerName=RoleInitiative-container

:: Define Dockerfile paths
set dockerfile1=Dockerfile-MainGit
set dockerfile2=Dockerfile-DevGit
set dockerfile3=Dockerfile-LocalFile

:: Check if Dockerfile1 exists, if not, create it
if not exist %dockerfile1% (
    echo Creating Dockerfile-MainGit...
    (
        echo # Dockerfile - Main Github configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR /RoleInitiativeFolder
		echo.
		echo RUN git clone -b main https://github.com/Sahmuraii/RoleInitiative.git
		echo #RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR /RoleInitiativeFolder/RoleInitiative
		echo COPY requirements.txt .
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo WORKDIR /RoleInitiativeFolder/RoleInitiative/src/project
		echo.
		echo #Run local development
		echo #WORKDIR /RoleInitiativeFolder/src/project
		echo.
		echo ENTRYPOINT FLASK_APP=test FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfile1%
)

:: Check if Dockerfile2 exists, if not, create it
if not exist %dockerfile2% (
    echo Creating Dockerfile-DevGit...
    (
        echo # Dockerfile - Developer Github configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR /RoleInitiativeFolder
		echo.
		echo #RUN git clone -b main https://github.com/Sahmuraii/RoleInitiative.git
		echo RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR /RoleInitiativeFolder/RoleInitiative
		echo COPY . . 
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo WORKDIR /RoleInitiativeFolder/RoleInitiative/src/project
		echo.
		echo #Run local development
		echo #WORKDIR /RoleInitiativeFolder/src/project
		echo.
		echo ENTRYPOINT FLASK_APP=test FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfile2%
)

:: Check if Dockerfile3 exists, if not, create it
if not exist %dockerfile3% (
    echo Creating Dockerfile-LocalFile...
    (
        echo # Dockerfile - Developer Github configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR /RoleInitiativeFolder/RoleInitiativeFolder
		echo #RUN git clone -b main https://github.com/Sahmuraii/RoleInitiative.git
		echo #RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR /RoleInitiativeFolder/RoleInitiative
		echo COPY . . 
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo #WORKDIR /RoleInitiativeFolder/RoleInitiative/src/project
		echo.
		echo #Run local development
		echo WORKDIR /RoleInitiativeFolder/RoleInitiative/src/project
		echo.
		echo ENTRYPOINT FLASK_APP=test FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfile3%
)

:: Prompt the user for which Dockerfile to use
echo Select which Dockerfile to use for building the Docker image:
echo (1). Github Main Branch (located at ./Dockerfile1)
echo (2). Github Dev Branch (located at ./Dockerfile2)
echo (3). Local Files (located at ./Dockerfile3)
choice /c 123 /n /m "Enter the number (1, 2, or 3): "

:: Determine which Dockerfile to use based on user input
if errorlevel 3 (
	set dockerfilePath=%dockerfile3%
    echo Using %dockerfile3%...
) else if errorlevel 2 (
    set dockerfilePath=%dockerfile2%
    echo Using %dockerfile2%...
) else if errorlevel 1 (
	set dockerfilePath=%dockerfile1%
    echo Using %dockerfile1%...
) else (
    echo Invalid choice. Please enter 1, 2, or 3.
	echo Closing in 5 seconds...
	timeout /t 5 /nobreak >nul
    exit /b 1
)
timeout /t 1 /nobreak >nul
echo.

:: Check for any running container with the same name
echo Checking for any running container with the name %containerName%...
for /f "tokens=*" %%i in ('docker ps -a -q -f "name=%containerName%"') do set containerExists=%%i

if defined containerExists (
    echo Stopping the existing container %containerName%...
    docker stop %containerName% >nul
    docker rm %containerName% >nul
) else (
    echo No existing container with the name %containerName% found.
)

:: Prune unused Docker images
echo Pruning unused Docker images...
docker image prune -f

:: Build the new image using the selected Dockerfile
echo Building new Docker image using %dockerfilePath%...
docker build -t %imageName% -f %dockerfilePath% .

:: Check if the image was built successfully
if errorlevel 1 (
    echo Docker image build failed.
    exit /b 1
)

:: Run the newly built image with port mapping and container name
echo Running Docker image with container name %containerName% and port mapping (5000:5000)...
docker run -d -p 5000:5000 --name %containerName% %imageName%

:: Check if the image ran successfully
if errorlevel 1 (
    echo Failed to run Docker image.
    exit /b 1
)

echo.
echo.
echo Docker image built and running successfully with container name and port mapping.

:: Add a 15-second timer before closing
echo Closing in 15 seconds...
timeout /t 15 /nobreak >nul
exit /b 0
