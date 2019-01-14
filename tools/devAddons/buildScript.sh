#!/bin/bash

echo "### Build Script v2.0 6.04.2018 ### $(date)"

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/addons.list"))

TOTAL=0
CNT=0
PARALLELS_COUNT=4
for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  TOTAL=$(($TOTAL+1))
  CNT=$(($CNT+1))
  if cd $EXECDIR/devAddons/$i; then
    cd $EXECDIR/devAddons/$i
    ../../node_modules/.bin/webpack --config webpack.config.4x.babel.js --progress --colors & pid=$1
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
