#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo 'Usage: phpgrep-lint.sh target patterns_file'
    echo 'Where:'
    echo '  target is a file or directory name where search is performed.'
    echo '  patterns_file is a file with newline-separated phpgrep pattern args.'
    echo '                File can contain #-comments and empty lines.'
    echo ''
    echo 'Examples:'
    echo '  ./phpgrep-lint.sh file.php patterns.txt'
    echo '  ./phpgrep-lint.sh /path/to/code /path/to/patterns.txt'
    echo ''
    echo 'Exit status:'
    echo '  0 if no issues are found'
    echo '  1 if any of provided patterns matched anything'
    exit 1
fi

flag_target=$1
flag_patterns_file=$2

if [ -z "$flag_target" ]; then
    echo "target argument (1st positional) can't be empty"
    exit 1
fi
if [ -z "$flag_patterns_file" ]; then
    echo "patterns filename argument (2nd positional) can't be empty"
    exit 1
fi

mapfile -t patterns < "$flag_patterns_file"

found_issues=0

for pattern in "${patterns[@]}"; do
    # Treat lines starting with "#" as comments.
    if [ "${pattern:0:1}" = '#' ]; then
        continue
    fi
    # Skip empty lines.
    if [ -z "$pattern" ]; then
        continue
    fi

    # $pattern is unquoted on purpose, to allow passing filter args as well.
    # phpgrep "$flag_target" ${pattern[@]}
    eval phpgrep "$flag_target" $pattern

    # phpgrep exits with zero status if it finds anything.
    # We use "bad code" patterns, so if we matched something,
    # we've found some suspicious code bits.
    if [ $? -eq 0 ]; then
        found_issues=1
    fi
done

exit $found_issues
