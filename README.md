# ercot-nest

1) Login to nest and create oauth client. Leave oauth redirect url's empty.

It is possible to use passport or implicit grant flow to have an app work
across many different users. This app, however, is for non ui backedend service that will use Pin based authorization.

2) Load the Authorization URL into your browser.

```
firebase functions:config:set nest.pincode=whatever-authorization-url-gives-you
firebase functions:config:set nest.client_id=whatever-oauth-client-id-is
firebase functions:config:set nest.client_secret=whatever-oauth-client-secret-is

firebase functions:config:get
```

3)

```
firebase deploy
```

4) /hooks/ercot
5) /hooks/nestGet