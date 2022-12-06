# [lintulista-electron](https://github.com/leikareipa/lintulista-electron/) / server

An adaptation of the original [Lintulista server](https://www.github.com/leikareipa/lintulista-server), for use with the Electron version of Lintulista.

The server provides a REST API with which clients can interact with the Lintulista database.

## Client-to-server API

The following client-to-server actions are available:
- [Log in](#log-in)
- [Log out](#log-out)
- [Get a list's observations](#get-a-lists-observations)
- [Add an observation to a list](#add-an-observation-to-a-list)
- [Update an observation in a list](#update-an-observation-in-a-list)
- [Delete an observation from a list](#delete-an-observation-from-a-list)
- [Run server-side tests](#run-server-side-tests)

### Log in

Request format: POST [host]/login?list=[list_key]

Sample request:
```shell
$ curl localhost/login?list=aaaaaaaaa --request POST --header "Content-Type: application/json" --data '{"username":"...","password":"..."}'
```

Sample response (success):
```json
{
    "data":{
        "token":"...",
        "until":1615447887
    },
    "valid":true
}
```

Sample response (failure):
```json
{
    "data":{
        "message":"Invalid credentials."
    },
    "valid":false
}
```

A successful response returns a JSON object containing the `data.token` and `data.until` properties, in addition to the `valid` property whose value must equate to `true`.

The `data.token` property provides as a string a token which the client must attach to subsequent requests that require login (e.g. [deleting an observation](#delete-an-observation-from-a-list)). The `data.until` property is a number representing the maximum Unix epoch after which the login token is no longer valid.

Consecutive successful requests to log in will invalidate the existing login token, if any.

### Log out

Request format: DELETE [host]/login?list=[list_key]

- Requires [login](#log-in)

Sample request:
```shell
$ curl localhost/login?list=aaaaaaaaa --request DELETE --header "Content-Type: application/json" --data '{"token":"..."}'
```

Sample response (success):
```json
{
    "data":{},
    "valid":true
}
```

Sample response (failure):
```json
{
    "data":{
        "message":"The request could not be successfully processed."
    },
    "valid":false
}
```

### Get a list's observations

Request format: GET [host]/?list=[list_key]

- Requires [login](#log-in)

Sample request:
```shell
$ curl localhost/?list=aaaaaaaaa
```

Sample response (success):
```json
{
    "data":{
        "observations":[
            {"species":"Fasaani","day":12,"month":4,"year":2021},
            {"species":"Lehtokurppa","day":12,"month":4,"year":2021},
            {"species":"Tylli","day":12,"month":4,"year":2021}
        ]
    },
    "valid":true
}
```

Sample response (failure):
```json
{
    "data":{},
    "valid":false
}
```

Sample response (failure):
```json
{
    "data":{
        "message":"Requests must provide the 'list' URL parameter."
    },
    "valid":false
}
```

### Add an observation to a list

Request format: POST [host]/?list=[list_key]

- Requires [login](#log-in)

Sample request:
```shell
$ curl localhost/?list=aaaaaaaaa --request POST --header "Content-Type: application/json" --data '{"token":"...","species":"Tylli",day:1,month:2,year:2003}'
```

Sample response (success):
```json
{
    "data":{},
    "valid":true
}
```

Sample response (failure):
```json
{
    "data":{
        "message":"The request could not be successfully processed."
    },
    "valid":false
}
```

### Update an observation in a list

See [Add an observation to a list](#add-an-observation-to-a-list).

### Delete an observation from a list

Request format: DELETE [host]/?list=[list_key]

- Requires [login](#log-in)

Sample request:
```shell
$ curl localhost/?list=aaaaaaaaa --request DELETE --header "Content-Type: application/json" --data '{"token":"...","species":"Tylli"}'
```

Sample response (success):
```json
{
    "data":{},
    "valid":true
}
```

Sample response (failure):
```json
{
    "data":{
        "message":"The request could not be successfully processed."
    },
    "valid":false
}
```

### Run server-side tests

**Warning: This section has not yet been adapted for lintulista-electron and so contains obsolete/incomplete information.**

Request format: GET [host]/test?list=[list_key]

- Requires that Node.js has access to `process.stdout` (e.g. that the server is running in a terminal)
- The `list` URL parameter must be a valid list key string but doesn't need to be of an existant list (e.g. "aaaaaaaaa" will do)

Sample request:
```shell
$ curl localhost/test?list=aaaaaaaaa
```

Sample output (tests succeeded; server terminal):
```shell
Running unit tests (2021-04-19T16:42:18.251Z)
 PASS  UintStringer
 PASS  Observation
 PASS  Token
 PASS  ListKey
 PASS  Database
Done. All tests passed. 
```

Sample output (tests succeeded; server-to-client response):
```json
{
    "data":{
        "unit":"Done. All tests passed."
    },
    "valid":true
}
```

Sample output (some tests failed; server terminal):
```shell
Running unit tests (2021-04-19T16:42:18.251Z)
 PASS  UintStringer
 PASS  Observation
 PASS  Token
 FAIL  ListKey: Not true: ()=>LL_IsListKeyValid(1) === false
 PASS  Database
Done. 1/5 tests failed.
```

Sample output (some tests failed; server-to-client response):
```json
{
    "data":{
        "unit":"Done. 1/5 tests failed."
    },
    "valid":true
}
```

## Credits

Developed by [Tarpeeksi Hyvae Soft](https://www.tarpeeksihyvaesoft.com).
