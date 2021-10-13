#!/bin/bash

echo "### Build Script ### $(date)"

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(find ${EXECDIR}/elements -mindepth 1 -maxdepth 1 -type d))

TOTAL=0
CNT=0
PARALLELS_COUNT=4
for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  TOTAL=$(($TOTAL+1))
  CNT=$(($CNT+1))
  if cd $i; then
    cd $i
    echo "building $i"
    rm -rf $i/node_modules
    rm -rf $i/package.json
    rm -rf $i/yarn.lock
    ../../node_modules/.bin/webpack --config=../../node_modules/vc-webpack-vendors/webpack.config.js & pid=$1
  fi

  PID_LIST+=" $pid";
  if [ "$CNT" -gt "$PARALLELS_COUNT" ]; then
    wait $PID_LIST
    PID_LIST=""
    echo "..."
    CNT=0
  fi
} done

trap "kill $PID_LIST" SIGINT

wait $PID_LIST

echo
echo "All processes have completed: $TOTAL";

echo "Done!"
