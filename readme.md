# robolucha-game


## How to use diferent users in a local environment

Add to session storage the following key: `robolucha-test-user`
This will give the instruction to the API to create an user with that name
if the API is running on the mode to disable authentication.

To disable auth in the API the variable should be set 
```
DISABLE_AUTH=true
```
