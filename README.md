# **MC-T1**

### Enable MCT1-demo

* Goto https://play.magikcraft.io/packagejson
* In the `dependencies` section add the mct1 package. That section should look like this:

```
"dependencies": {
	"mct1-demo": "https://github.com/triyuga/mct1-demo.git#master"
},
```

### Create a spell to start MC-T1

* Paste the following code into the spell, replacing the existing text:

```
function call(module,spell='_default',a1=null,a2=null,a3=null) {
    require(module).spells[spell](a1,a2,a3);
}
```

### Start MC-T1

OK, now you're ready to run MC-T1!

Press the 'T' key on your keyboard, then type in:

`/cast call mct1-demo`
