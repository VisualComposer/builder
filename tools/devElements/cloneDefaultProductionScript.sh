#!/bin/bash

echo "Clone script is running."

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/defaultElements.list"))

TOTAL=0
CNT=0
PARALLELS_COUNT=4
for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  TOTAL=$(($TOTAL+1))
  echo $EXECDIR/elements/$i
  CNT=$(($CNT+1))
  if cd $EXECDIR/elements/$i; then
    cd $EXECDIR/elements/$i && git pull & pid=$1;
  else
    git clone --depth 1 git@gitlab.com:visualcomposer-hub/$i.git $EXECDIR/elements/$i & pid=$1;
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
