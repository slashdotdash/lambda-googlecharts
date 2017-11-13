# Google Chart generation for Lambda

[Serverless](http://www.serverless.com) Lambda wrapper around [node-googlecharts](https://github.com/zallek/node-googlecharts).

## Requirements

- Node.js > 4.0
- [Serverless](http://docs.serverless.com/docs/installing-serverless)

## Install

Install project dependencies:

```SH
npm install
```

## Deploy the service

Use this when you have made changes to your Functions, Events or Resources in `serverless.yml` or you simply want to deploy all changes within your Service at the same time.

```
serverless deploy -v
```

## Deploy the function and endpoint

Use this to quickly upload and overwrite your function code, allowing you to develop faster.

```
serverless deploy function -f chart
```

## Invoke the Function

Invokes a Function and returns logs.

```
serverless invoke -f chart -l
```

## FAQ

#### Why spawning a child process to run `node-googlecharts`?

[node-googlecharts](https://github.com/zallek/node-googlecharts) needs system dependencies that require specific environment variables to run. Unfortunately, AWS Lambda does not allow to define custom env variables for the whole lambda. Indeed, spawning child processes seem to be the recommended way according to amazon. [more info](https://aws.amazon.com/fr/blogs/compute/nodejs-packages-in-lambda/)
