<!-- # name: CI/CD Pipeline
# on:
#   push:
#     branches:
#       - main
#   pull_request:
#     branches:
#       - main

# jobs:
#   build:

#     runs-on: ubuntu-latest

#     services:
#       postgres:
#         image: postgres:13
#         env:
#           POSTGRES_USER: yourusername
#           POSTGRES_PASSWORD: yourpassword
#           POSTGRES_DB: yourdatabase
#         ports:
#           - 5432:5432
#         options: >-
#           --health-cmd pg_isready
#           --health-interval 10s
#           --health-timeout 5s
#           --health-retries 5

#     env:
#       DATABASE_URL: postgres://yourusername:yourpassword@localhost:5432/yourdatabase

#     steps:
#     - name: Checkout code
#       uses: actions/checkout@v2

#     - name: Set up Node.js
#       uses: actions/setup-node@v2
#       with:
#         node-version: '20'

#     - name: Install dependencies
#       run: npm install

#     - name: Run TypeScript
#       run: npx tsc --noEmit

#     - name: Run tests
#       run: npm test

#     - name: Lint code
#       run: npm run lint

#   deploy:
#     needs: build
#     runs-on: ubuntu-latest
#     steps:
#     - name: Checkout code
#       uses: actions/checkout@v2

#     - name: Deploy
#       run: echo "Deploy step goes here"
#       # Add your deployment steps here -->
