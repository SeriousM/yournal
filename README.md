# yournal

https://yournal.meteor.com/

# settings

create files called `app-settings-dev.json` and `app-settings-prod.json` with this content:
```json
{
  "kadiraAppId": "<app id>",
  "kadiraAppSecret": "<app secret>",
  "public": {
    "ga": false || {"id": "<google analytics id>"}
  }
}
```

# execution

`meteor --port <port> --settings app-settings-dev.json`

# deployment

`meteor deploy a-name-for-your-app.meteor.com --settings app-settings-prod.json`
