#!/bin/bash
cmdRm=$(now rm dean -y)

cmdDeploy=$(now --public)

cmdLn="now ln dean.now.sh"

if [ $? -ne 1 ]; then
  $cmdLn
fi