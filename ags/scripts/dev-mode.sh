#!/bin/bash

cleanup(){
  kill $(jobs -p) 2> /dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

# This script is used to start the server in development mode.
# Its damn trippy, the bar resizes the whole screen
while [ 1 ]
do
  ags -b dev &
  watch -d -t -g ls -lR ~/.config/ags/src > /dev/null
  echo "Files changed, restarting server..."
  ags -b dev -q 
done