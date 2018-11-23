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
  if cd $EXECDIR/devElements/$i; then
    rm -rf $EXECDIR/devElements/$i;
  fi

} done

echo "Done!"
