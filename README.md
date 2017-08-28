Here are two services.

Dummy service has a bunch of endpoints to make requests against.
Availability service calls the specified endpoint, and logs it

To build docker images for each server, cd to their folder:

`docker build -t dummy_service:0.1  .`
`docker build -t availability_service:0.1  .`

To run a docker container

`docker run -p 3001:3001 -it dummy_service:0.1`
`docker run -p 3002:3002 -it availability_service:0.1`


Log4js documentation
https://nomiddlename.github.io/log4js-node/

Docker sebp/ELK documentation
http://elk-docker.readthedocs.io/

Run the base version of sebp/elk:551
`docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -e "MAX_MAP_COUNT"=262144  -it --name elk3 sebp/elk:551`

run bash in container:
`docker exec -it <container-name> /bin/bash`

Send dummy Log: (run bash in container first)
`/opt/logstash/bin/logstash --path.data /tmp/logstash/data -e 'input { stdin { } } output { elasticsearch { hosts => ["localhost"] } }'`
