## What's going on

This is the beta version of TCT-project. *More description to come*

## How to deploy it

There are three ways to deploy an app exclusively.

### Netlify project

This one is a build made to be hosted by Netlify. It is full-fledged application. You only have to give an access to it in [Netlify][https://app.netlify.com/] interface.

- Open Netlify
- Create new account (log in with GitHub profile)
- Click «New site from git»
- Choose the repository
- Leave all the forms by default
- Click «Build».

### Node project

To make it a node-project. You have to change **svelte.config.js**.

	
	import adapter from '@sveltejs/adapter-node';
```
	export default {
		kit: {
			adapter: adapter({
				// default options are shown
				out: 'build',
				precompress: false,
				env: {
					host: 'HOST',
					port: 'PORT'
				}
			})
		}
	};
```

Than you have to use command `npm run build` to create a new build of an application. Afther that it will be possible to launch an app using Node.js.

### Docker project

There would be instruction how to deploy the app via Docker