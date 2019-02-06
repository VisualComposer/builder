#!/bin/bash

echo "### Build Script v2.0 6.04.2018 ### $(date)"

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/elements.list"))

TOTAL=0
CNT=0
PARALLELS_COUNT=10
for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  TOTAL=$(($TOTAL+1))
  CNT=$(($CNT+1))
  if cd $EXECDIR/devElements/$i; then
    cd $EXECDIR/devElements/$i
    ../../node_modules/.bin/webpack --config webpack.config.4x.babel.js --no-info & pid=$1
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
