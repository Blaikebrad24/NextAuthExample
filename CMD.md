
[x] run the docker container
            - docker run --name nextauthpost -e POSTGRES_USER=postuser -e POSTGRES_PASSWORD=postpassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres

[x] connect to docker container and start psql session in mydb
            - docker exec -it nextauthpost psql -U postuser -d mydb

[x] psql -> SELECT * FROM "User"; 