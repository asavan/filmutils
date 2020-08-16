#!/bin/bash
#https://www.tools4noobs.com/online_tools/seconds_to_hh_mm_ss/

find . -type f -not -path "./seen/*" -print0 | xargs -0 mediainfo --Inform="Video;%Duration%\n" |  awk '{ SUM += $1} END { printf("%.0f\n", SUM/1000); }' | xargs ./displaytime.sh