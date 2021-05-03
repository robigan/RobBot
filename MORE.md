# Features that should exist:
- Modules for GatewayClient
- Modules for CacheClient. Since it would allow also using other storage options better
- Work on MongoDB
- Bot owner command
- Eval command
- Reverse shell? Must be enabled, disabled by default, loads of warnings, and each shell created is an instance tied to a user, and the console must press a confirm button
- Upgrade from github/source. For each "system" (Gateway, Cache, Code), spawn a new process that will wait for the parent to die and then re-call the new process. But for now a simple process.exit() should do.
- Make certain folders check for extra code (eg. Sudoers folder)
- Make code, or at least simple commands more efficient