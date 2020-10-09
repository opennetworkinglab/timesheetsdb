# Timesheetsdb
Time sheets database for web application


## Prerequisites

```
PostgreSQL v13.0
NodeJS v14.13.1
```

## Installation

```bash
$ npm install
```

## Running the app

### Environment file

Database, Docusign and Google information are to be entered here before launching the application
Docusign - for creating and sending documents to sign  
Google - use of Google Drive for storing the documents and png previews of them.  

### Development
```
$ npm run start:dev
```

### Production mode
```
$ npm run start:prod
```

### Other commands can be found in package.json, under scripts

## Test

### unit tests
```
$ npm run test
```

### e2e tests
```
$ npm run test:e2e
```

### test coverage
```
$ npm run test:cov
```

# Rest Points
curl syntax for rest points can be found in Rest points with curl.txt

## Project Priority
Priority 1 is for shared projects. E.g Sick  
Projects populate the docusign table in an order based on priority


# Google Folder Layout
Main Folder - Id of this folder will be passed in the env file.  
Main Folder -> year  
year -> month  
month -> week  
week -> user(name of user) - Pdf documents stored here  
user -> images - png of documents stored here  
user -> unsigned - where pngs are moved to when user unsigns