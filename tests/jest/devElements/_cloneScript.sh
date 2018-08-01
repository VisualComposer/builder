#!/bin/bash

echo "Clone script is running."

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/elements.list"))

TOTAL=0
CNT=0
PARALLELS_COUNT=7
for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  TOTAL=$(($TOTAL+1))
  echo $DIR/$i
  CNT=$(($CNT+1))
  if cd $DIR/$i; then
    cd $DIR/$i && git pull & pid=$1;
  else
    git clone git@gitlab.com:visualcomposer-hub/$i.git $DIR/$i & pid=$1;
  fi

  PID_LIST+=" $pid";
  if [ "$CNT" -gt "$PARALLELS_COUNT" ]; then
    wait $PID_LIST
    PID_LIST=""
    echo "..."
    CNT=0
  fi
} done

