# pixelphant
 express app CRUD with authentication
Sign up , login , update user , create subscription for user 
CRUD operation on all 

to run the app 
cd ExpressAppCrud

run 
npm run dev

to perform CRUD operation

API:- http://localhost:3000

method, path and discription

User Route

POST /signup - create user
POST /login - login user with (email and password) and provide JWT token 
GET /users - fetch all users detail
GET /users/userID - fetch user detail of provided userID
GET /users/subscription/userID - fetch user detail with respective subscription
PUT /users/userID - update user detail
PATCH /users/userID - update user detail particual artibute
DELETE /users/userID - delete user

Subscription Route

POST /subscriptions - create subscription
GET /subscriptions/userID - fetch subscription of provided user
GET /subscriptions/serviceID - fetch subscription with serviceID
PUT /subscriptions/serviceID - update subscription
PATCH /subscriptions/serviceID - update subscription particular attribute
DELETE /subscriptions/serviceID - delete subscription for particualr serviceID
DELETE /subscriptions/userID - delete all subscription for userID

Discord Route
POST /discord/signup - create user 
POST /discord/subscriptions - create subscription for login discord user
GET /discord/users/username - fetch user detail with subscription  