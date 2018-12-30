#!/bin/bash

if [ ! -f "swagger-codegen-cli.jar" ]; then
    echo "downloading swagger-codegen-cli.jar"
    wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/swagger-codegen-cli-2.3.1.jar -O swagger-codegen-cli.jar
fi

java -jar swagger-codegen-cli.jar generate --output ./src/app/sdk --lang typescript-angular --input-spec ../robolucha-api/docs/swagger/swagger.yaml

