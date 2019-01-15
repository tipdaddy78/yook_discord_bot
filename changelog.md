Changelog:
==========
### b.2019.1.14 ###
+ Overhauled the codebase to be more object oriented and modular
+ Removed redundant commands
+ Removed the need to have a '-' for options, you can now just append the option to the command:
```
!find = !findlinks = !findlink = !findl
!findtags = !findtag = !findt
!add = !addlink = !addl
!addtags = !addtag = !addt
!delete = !deletelink = !deletel
!deletetag = !deletet
!get = !getlink = !getl
```
The rework will make adding new features MUCH easier as now pretty much everything with variables has it's own class. I will continue modularizing the codebase as much as I can so that maintaining the code for the future is easier.
