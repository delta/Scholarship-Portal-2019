#!/usr/bin/python
import imaplib
import re
import sys

username = sys.argv[1]
password = sys.argv[2]
serveraddr = 'webmail.nitt.edu'

M = imaplib.IMAP4(serveraddr)

try:
	a=M.login(username, password)
	print 1
except:
	print 0
