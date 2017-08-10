#!/bin/bash

find devElements/ -maxdepth 1 -type d | tail -n +2 | xargs -I % sh -c 'cd % && echo % && git status'