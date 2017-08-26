Here are two services.

dummy service has a bunch of endpoints to make requests against.

availability service calls the specified endpoint, and logs it


To build docker images for each server, cd to their folder:

`docker build -t dummy_service:0.1  .`
`docker build -t availability_service:0.1  .`

To run a docker container

`docker run -p 3001:3001 -it dummy_service:0.1`
`docker run -p 3002:3002 -it availability_service:0.1`
