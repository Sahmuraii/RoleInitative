@echo off

:: Set the image name and container name
set imageName=flask-app
set containerName=RoleInitiative-container

:: Set dockerfile name
set dockerfilePath=BatchDockerfile.local

:: Set file structure information
set appFolder=/RoleInitiativeFolder
set projectFolder=/RoleInitiative
set appPath=/src
set appName=app



:: Check if Docker is running by using docker info
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop is not running. Please start Docker Desktop and try again.
    exit /b 1
)

:: Prompt the user for which Dockerfile to use
echo Select which Dockerfile to use for building the Docker image:
echo (1). Github Main Branch
echo (2). Github Dev Branch
echo (3). Local Files
echo (4). *Custom Github branch
choice /c 1234 /n /m "Enter the number (1, 2, 3, or 4): "

:: Determine which Dockerfile to use based on user input
if errorlevel 4 (
	echo Creating Custom Dockerfile...
	set /p choice="Enter the name of the branch: "
    (
        echo # Dockerfile - Custom-branch configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR %appFolder%
		echo #RUN git clone -b %choice% https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR %appFolder%%projectFolder%
		echo COPY . . 
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo #WORKDIR %appFolder%%projectFolder%/%appPath%
		echo.
		echo #Run local development
		echo WORKDIR %appFolder%%projectFolder%/%appPath%
		echo.
		echo ENTRYPOINT FLASK_APP=%appName% FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfilePath%
    echo Using Dockerfile - Custom-branch configuration...
) else if errorlevel 3 (
	echo Creating Dockerfile-LocalFile...
    (
        echo # Dockerfile - Local File configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR %appFolder%
		echo #RUN git clone -b main https://github.com/Sahmuraii/RoleInitiative.git
		echo #RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR %appFolder%%projectFolder%
		echo COPY . . 
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo #WORKDIR %appFolder%%projectFolder%/%appPath%
		echo.
		echo #Run local development
		echo WORKDIR %appFolder%%projectFolder%/%appPath%
		echo.
		echo ENTRYPOINT FLASK_APP=%appName% FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfilePath%
    echo Using Dockerfile - Local File configuration...
) else if errorlevel 2 (
    echo Creating Dockerfile-DevGit...
    (
        echo # Dockerfile - Developer Github configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR %appFolder%
		echo.
		echo #RUN git clone -b main https://github.com/Sahmuraii/RoleInitiative.git
		echo RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR %appFolder%%projectFolder%
		echo COPY . . 
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo WORKDIR %appFolder%%projectFolder%/%appPath%
		echo.
		echo #Run local development
		echo #WORKDIR %appFolder%/%appPath%
		echo.
		echo ENTRYPOINT FLASK_APP=%appName% FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfilePath%
    echo Using Dockerfile - Developer Github configuration...
) else if errorlevel 1 (
	echo Creating Dockerfile-MainGit...
	(
        echo # Dockerfile - Main Github configuration
        echo FROM python:3.12.7
		echo.
		echo ARG CACHEBUST=1
		echo.
		echo WORKDIR %appFolder%
		echo.
		echo RUN git clone -b main https://github.com/Sahmuraii/RoleInitiative.git
		echo #RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
		echo.
		echo WORKDIR %appFolder%%projectFolder%
		echo COPY requirements.txt .
		echo.
		echo RUN pip install -r requirements.txt
		echo.
		echo EXPOSE 5000
		echo.
		echo #Run Github Branch
		echo WORKDIR %appFolder%%projectFolder%/%appPath%
		echo.
		echo #Run local development
		echo #WORKDIR %appFolder%/%appPath%
		echo.
		echo ENTRYPOINT FLASK_APP=%appName% FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0
    ) > %dockerfilePath%
    echo Using Dockerfile - Main Github configuration...
) else (
    echo Invalid choice. Please enter 1, 2, 3, or 4.
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
timeout /t 15 /nobreak
exit /b 0
