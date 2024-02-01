# SaveUp API Documentation

This document describes the API endpoints for the SaveUp Savings Management system.

## Base URL

All API requests are made to: https://ismailpervez.vercel.app


## Endpoints

### User Registration

- Endpoint: `/users/register`
- Method: `POST`
- Description: Registers a new user in the system.
- Request Body:

```json
{
    "username": "string",
    "password": "string",
}
```

### User Login

- Endpoint: `/users/login`
- Method: `POST`
- Description: Logs in existing user in the system.
- Request Body:

```json
{
    "username": "string",
    "password": "string",
}
```

### Get User's Saving Goals

- Endpoint: `/goals/get`
- Method: `GET`
- Description: Gets all user's saving goals.

### Set New Goal

- Endpoint: `/goals/post`
- Method: `POST`
- Description: Set a new goal in the system.

```json
{
    "name": "string",
    "amount": "int",
    "frequency": "string (Daily|Weekly|Monthly)",
    "include_weekend": "int (1|0)",
}
```

### Get User's Transactions

- Endpoint: `/savings/get`
- Method: `GET`
- Description: Gets all user's saving transactions for a goal.

### Set New Saving/Transaction

- Endpoint: `/savings/post`
- Method: `POST`
- Description: Set a new goal in the system.

```json
{
    "goalId": "int",
    "amount": "int",
}
```