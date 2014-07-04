# yournal

http://yournal.meteor.com/

# settings

create a file called `app-settings.json` with this content:
```json
{
  "kadiraAppId": "<app id>",
  "kadiraAppSecret": "<app secret>"
}
```

# execution

`mrt -p <port> --settings app-settings.json`

# deployment

`meteor deploy a-name-for-your-app.meteor.com --settings app-settings.json`
