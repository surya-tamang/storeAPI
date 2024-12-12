# StoreAPI

StoreAPI is a RESTful API designed for managing users, products, and orders in a B2C e-commerce platform. It enables developers to build and manage e-commerce systems efficiently.

## Table of Contents

- [Overview](#overview)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Products](#products)
  - [Orders](#orders)
- [Usage](#usage)
- [Authentication](#authentication)
- [Error Handling](#error-handling)

## Overview

StoreAPI provides endpoints for managing users, products, and orders within an e-commerce platform. It is designed to be easy to integrate and efficient for high-performance e-commerce systems.

## API Endpoints

### Users

Endpoints for managing users:

- **GET /api/user**
  - Retrieves a list of all available users.
- **GET /api/user/:id**
  - Retrieves details of a specific user by ID.
- **PUT /api/user/:id**
  - Updates details of a specific user by ID.
- **DELETE /api/user/:id**
  - Deletes a specific user by ID.
- **POST /api/user/login**
  - Authenticates a user and returns a token.
- **POST /api/user/signup**
  - Registers a new user.

### Products

Endpoints for managing products:

- **GET /api/product**
  - Retrieves a list of all available products.
- **GET /api/product/:id**
  - Retrieves details of a specific product by ID.
- **POST /api/product**
  - Adds a new product to the inventory.
- **PUT /api/product/:id**
  - Updates details of a specific product by ID.
- **DELETE /api/product/:id**
  - Deletes a specific product by ID.

### Orders

Endpoints for managing orders:

- **GET /api/order**
  - Retrieves a list of all orders.
- **GET /api/order/:id**
  - Retrieves details of a specific order by ID.
- **POST /api/order**
  - Places a new order.
- **DELETE /api/order/:id**
  - Cancels a specific order by ID.

## Usage

To interact with StoreAPI, make HTTP requests to the appropriate endpoints. Ensure that the necessary headers (such as `Content-Type: application/json`) and authentication tokens (where required) are included.
