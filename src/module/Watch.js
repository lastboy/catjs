var _watch=require("watch"),_cat=catrequire("cat"),_fs=require("fs");module.exports=function(){var t=function(t){_cat.watch(t)};return{init:function(e){var c=this;e=e||"/home/arik/dev/projects/cat/test/test-project",e&&_watch.createMonitor(e,function(e){console.log(" -- > "+process.getuid()),e.on("created",function(e,i){e&&!_fs.existsSync(e)&&t({impl:new c.createWatch({file:e,stat:i,crud:"c"})})}),e.on("changed",function(e,i,n){i.mtime-n.mtime&&t({impl:new c.createWatch({file:e,crud:"u"})})}),e.on("removed",function(e,i){e&&_fs.existsSync(e)&&t({impl:new c.createWatch({file:e,stat:i,crud:"d"})})})})},createWatch:function(t){this.config=t,t&&(this.file=t.file,this.stat=t.stat,this.crud=t.crud),this.get=function(t){return t?this[t]:void 0},this.getConfig=function(){return this.config}}}}();