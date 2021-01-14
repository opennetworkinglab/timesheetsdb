# REST Endpoints

When calling from the public URL, give an up-to-date `Bearer-Token` in place of `__VALUE__`

and replace `localhost:3000/` with `https://<public_url>/rest/`

# Point auth e.g (auth/createuser)
## POST createuser

```
    curl --location --request POST 'localhost:3000/auth/createuser' \
    --header 'Authorization: Bearer __VALUE__' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email": "__VALUE__",
        "firstName": "__VALUE__",
        "lastName": "__VALUE__",
        "supervisorEmail": "__VALUE__",
        "darpaAllocationPct": __VALUE__,
        "isSupervisor": __VALUE__,
        "isActive": __VALUE__,
    }'
```

## PATCH modifyuser

```
    curl --location --request PATCH 'localhost:3000/auth/{:emailId} \
    --header 'Authorization: Bearer __VALUE__' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "darpaAllocationPct": __VALUE__,
        "isSupervisor": __VALUE__,
        "IsActive": __VALUE__
    }'
```

## GET users

Just call /auth/

```bash
    curl --location --request GET 'localhost:3000/auth/' \
    --header 'Authorization: Bearer __VALUE__'
```

> The same syntax is applied for all rest points. Below contains the information without the curl

## PATCH Day
```bash
        :emailId/:dayId
            project: __VALUE__
            minutes: __VALUE__
```

## GET week
```
        :emailId/:weekId
            emailId: __VALUE__
            weekId: __VALUE__
```

## POST onfday
Add a set of "ONF days"

> Use a Date format like: UTC e.g. 2021-01-06

> If the date is more than 3 months in the future then the corresponding days
> have not been forward created in the DB and you will get a response that the
> Date already exists as an ONF Day 

```
curl --location --request POST 'https://localhost:3000/onfday' \
--header 'Authorization: Bearer __VALUE__' \
--header 'Content-Type: application/json' \
--data-raw '{
    "days": [
        "__VALUE__",
        "__VALUE__",
    ]
}'
```

## GET Week
```
        currentWeek
            Just call /week/

        :id
            id: __VALUE__
```

## PATCH Week
```
    :emailId/:weekId
        emailId: __VALUE__
        weekId: __VALUE__

        Body
            redirectUrl: __VALUE__
            userSigned: __VALUE__
```

## GET Reminders
sends reminder emails
```
    user/reminders
```

## GET Summary
Generates a pdf and csv of the users that have signed file for the month
```
    user/summary
```

## GET approver check
checks to see id supervisor has signed
```
    supervisor/update
        :emailId/:weekId
            emailId: __VALUE__
            weekId: __VALUE__
```
