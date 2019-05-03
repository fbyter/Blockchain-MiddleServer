#!/usr/bin/env bash
curl -H "Content-Type:application/json" -X POST -d '{"name":"wang","password":"123456a*"}' '127.0.0.1:4396/register'