
[x] run the docker container
            - docker run --name my_postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres

[x] connect to docker container and start psql session
            - docker exec -it my_postgres psql -U myuser -d mydb