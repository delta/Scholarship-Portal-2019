#!/bin/bash
if smbclient -L //octa.edu -U $1%$2  | grep -q 'FAILURE' &>/dev/null; then ans=0;else ans=1; fi &>/dev/null
echo $ans


# HOW to use:
# Connect to NITT Wi-Fi
# make this file executable:
# chmod +776
# run as:
# ./checkCredentials.sh <rollno> <octa_password>
# output will be 0 or 1
