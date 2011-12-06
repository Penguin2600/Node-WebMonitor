#! /bin/bash

userCnt=`w -h -s -f | awk '{print $1, $2, $3}' | wc -l`

for i in {1..$userCnt}; do
	w -h -s -f |  awk -vRS= -vFS='\n' -v cnt="$usrCnt" '{print $cnt}' | awk '{print $1,$2,$3}'
done
