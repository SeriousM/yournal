### DUMP

```sh
HOST=yournal.meteor.com
CMD=`meteor mongo $HOST --url | tail -1 | sed 's_mongodb://\([a-z0-9\-]*\):\([a-f0-9\-]*\)@\(.*\)/\(.*\)_mongodump -u \1 -p \2 -h \3 -d \4_'`
DATE=`date +%Y%m%d`
$CMD -o ./$DATE
```

### RESTORE

```sh
HOST=yournal.meteor.com
CMD=`meteor mongo $HOST --url | tail -1 | sed 's_mongodb://\([a-z0-9\-]*\):\([a-f0-9\-]*\)@\(.*\)/\(.*\)_mongorestore -u \1 -p \2 -h \3 -d \4_'`
$CMD /path/to/dump
```