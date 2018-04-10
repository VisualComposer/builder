#!/bin/bash

echo "My script is running."

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/elements.list"))

TOTAL=0
CNT=0
PARALLELS_COUNT=7
for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  TOTAL=$(($TOTAL+1))
  echo $EXECDIR/devElements/$i
  CNT=$(($CNT+1))
  if cd $EXECDIR/devElements/$i; then cd $EXECDIR/devElements/$i && git status & pid=$1; fi

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
