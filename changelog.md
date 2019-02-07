Changelog:
==========
> ### v2019.2.6
+ Added `!wr` command, with the options:
```
 !wrcl = !wrclist = !wrcatlist
```
+ Added help info for `!wr`
+ Added `YLSRC.json` for holding category IDs, will expand in future
+ Added skeleton for `CmdQuotes` implementation
+ Added test directory
+ Reworked `MessageParser`:
    + Now passing a callback to `cmd.execute()` for compatibility with `CmdWR` implementation
    + Added `auth()` method to replace conditionals
+ Added exception handling in key places
+ Added terminal commands for managing client session:
 ```
 `restart`, `kill`, `mem`, `quit`
 ```
+ Added periodic session checking. If bot disconnects without receiving the `kill` command, it will attempt reconnect every 500ms. May need to be revisited.

These changes are the most significant since the last major update. I do plan on doing a bit more rework in the future to reduce spaghetti code in `bot.js` and within command classes. Still sitting on `!quotes` implementation, `!help` has info on how I envisioned it, but I may decide to go with a more direct implementation instead. We'll see.


> ### v2019.1.14 ###
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
