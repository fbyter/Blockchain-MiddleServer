#!/usr/bin/env bash

# register
curl -H "Content-Type:application/json" -X POST -d '{"name":"alice","password":"123456a*","email":"","key":""}' '127.0.0.1:4396/register'

# login
curl -H "Content-Type:application/json" -X POST -d '{"name":"alice","password":"123456a*"}' '127.0.0.1:4396/login'

