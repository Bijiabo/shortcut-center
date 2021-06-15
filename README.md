# Shortcut Center
```
            ___ _            _           _      ___         _                        
           / __| |_  ___ _ _| |_ __ _  _| |_   / __|___ _ _| |_ ___ _ _              
           \__ \ ' \/ _ \ '_|  _/ _| || |  _| | (__/ -_) ' \  _/ -_) '_|             
           |___/_||_\___/_|  \__\__|\_,_|\__|  \___\___|_||_\__\___|_|               

                                                                                     
┌─────────────────────┐        ┌─────────────────────┐        ┌─────────────────────┐
│ shortcut command 0  │───────▶│                     ├───┬───▶│Observer for 0 and 1 │
└─────────────────────┘        │                     │        └─────────────────────┘
┌─────────────────────┐        │      shortcut       │   │                           
│ shortcut command 1  │─ ─ ─ ─▶│                     │─ ─                            
└─────────────────────┘        │       center        │                               
┌─────────────────────┐        │                     │        ┌─────────────────────┐
│ shortcut command 2  │═══════▶│                     ╠═══════▶│   Observer for 2    │
└─────────────────────┘        └─────────────────────┘        └─────────────────────┘                                                                   
```                                                                

A lightweight instruction registry.



Usage demo:

```TypeScript
// create instance
const instance = new ShortcutCenter();
instance.dev = false;

// add observer
const rule = "/app/user/logIn/:token";
const tokenValue = generateUUID();
const shortcutCommand = `/app/user/logIn/${tokenValue}`;
instance.addObserver(rule, (context) => {

    expect(context.params.token).to.be.equal(tokenValue);
    done();
});

// trigger by command
instance.execute(shortcutCommand);
```
