## Configure environment variables

Login with your Github account on `https://presencejs.yomo.run`, will get a free `app_id` and `app_secret`.
Create an .env file in the root of the example directory and fill in the environment variables according to the .env.example file

## Install Netlify CLI

```bash
npm install netlify-cli -g
```

## Develop

Start the `presence-auth` cloud function:

```bash
netlify dev
```
##### Note: works fine under Node 14.x, not under Node 17.x at the moment
