FROM python:3.12.7

ARG CACHEBUST=1

RUN git clone -b dev-branch https://github.com/Sahmuraii/RoleInitiative.git
COPY . . 

WORKDIR /RoleInitiative
RUN pip install -r requirements.txt

EXPOSE 5000

WORKDIR /RoleInitiative/src/
ENTRYPOINT FLASK_APP=app FLASK_DEBUG=1 flask run --port=5000 --host=0.0.0.0