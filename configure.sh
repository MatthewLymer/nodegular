#!/bin/bash

#if no arguments - in prod we give an arg
if [ $# -eq 0 ] ; then
    npm install -g bower
    npm install
    bower install
fi