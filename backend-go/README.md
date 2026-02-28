```bash
INSERT:
curl -X POST -H "Content-Type: application/json" -d '{"Name" : "佐藤" , "ID" : 0}' http://localhost:8081/users

SELECT:
curl http://localhost:8081/users

UPDATE:
curl -X PUT -H "Content-Type: application/json" -d '{"Name" : "佐藤2" , "ID" : 3}' http://localhost:8081/users

DELETE:
curl -X DELETE -H "Content-Type: application/json" -d '{"Name" : "佐藤2" , "ID" : 3}' http://localhost:8081/users
```

Air
go install github.com/air-verse/air@latest

oapi-codegenでAPI仕様書のYAMLからコード生成

# oapi-codegen 本体（コード生成用）
go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest

go get github.com/getkin/kin-openapi/openapi3

go get github.com/oapi-codegen/echo-middleware

#go get github.com/deepmap/oapi-codegen/v2/pkg/middleware

コード生成
oapi-codegen -package main -generate types,server,spec ../manual/api.yml > api.gen.go