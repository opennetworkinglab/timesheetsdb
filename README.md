# Timesheetsdb
Time sheets application that keeps track out individuals times for each project.
A frontend to work with is back-end would be [TimesheetsUI](https://github.com/opennetworkinglab/timesheetsui).

<img src="https://drive.google.com/uc?id=1kI9kRGBCzk1I7plgTLHMEGob4LqF2zgo" alt="There should be an image"/>

## Prerequisites

```
PostgreSQL v13.0
NodeJS v14.13.1
npm v6.14.8
```

## Installation

```bash
$ npm install
```

## Running the app

### Environment file

Docusign and Google information are to be entered here before launching the application
Docusign - for creating and sending documents to sign  
Google - use of gmail, to send emails and gdrive for storing the documents and png previews of them.  

### Database File - ormconfig.json
Insert your database information into this file:  
type - e.g. postgres  
host  
port  
username  
password  
database - name of the database (Must be created manually)  

### Update / Change to Entities (Database Tables)
#### Scripts
The migration scripts are located in src/migrations. Each script will have a timestamp in its name.  
Each script contains an up and down method:  
- up implements the changes to the DB
- down reverts the changes up made

#### Generate script
If any changes are made to any entity file, generate a migration script:
```
npx typeorm migration:generate -n NAME_OF_SCRIPT -d src/migrations
```

#### Create script
To manually write script use command (below) and enter the changes you want in the up method
```
npx typeorm migration:create -n NAME_OF_SCRIPT -d src/migrations
```

#### Run / Revert scripts
Run:
```
ts-node ./node_modules/typeorm/cli.js migration:run
```
Revert:
```
ts-node ./node_modules/typeorm/cli.js migration:revert
```

#### Tables created:
Users - User information  
Days - Day for a user containing the times for that day.  
Projects - Project names and priority  
Times - Times for a user for an individual day.  
Week - Weeks of the year.  
Weeklies - Contains the links to the preview and document once user signs.

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
Testing is completed using [Ansible](https://gerrit.opencord.org/admin/repos/infra-manifest).

# Rest Points
Exposed on port 3000. A curl syntax for Rest Points can be found in 'Rest points with curl.txt'.

## Project Priority
Priority 1 is for shared projects. E.g Sick  
Projects populate the docusign table in an order based on priority

# Google Folder Layout
Main Folder - Id of this folder will be passed in the env file.  
- Main Folder 
    - year  
        - month  
            - week
                - user(name of user) - Pdf documents stored here 
                    - images - png of documents stored here  
                    - unsigned - where pngs are moved to when user unsigns

# Templates
Some aspects of the application allow the use of templates.  
The template's folder houses these templates.  
Current templates exist for:  
- Gmail