// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	assets: '/assets',
	enableTracing: false,
	production: false,
	public: '/',
	useHash: false,
	useLang: true,
	useMarket: false,
	urlStrategy: '/:lang/', // '/:lang/:market/',
	defaultLanguage: 'it',
	defaultMarket: 'it',
	languages: [
		{ id: 1, name: 'Italiano', lang: 'it' }
	],
	plugins: {
		facebook: {
			appId: 2044894462438447,
			fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
			scope: 'public_profile, email', // publish_stream
			tokenClient: '643f8b0780f14625b35a450c83b715dc',
			version: 'v3.0',
		},
		google: {
			apiKey: 'AIzaSyDKHO9RHmiMMziRiO6xVFCELQcEDQ5Ub3o',
			clientId: '635556948154-k7fm0pvn6va39tap1ge4iq23ntd4hu37.apps.googleusercontent.com',
		},
		mapbox: {
			accessToken: 'pk.eyJ1Ijoic3VwYWhmdW5rIiwiYSI6IjE4Zjg1MWMxYzQ3M2RlYTU4OGNlMTc4ODFmOTkyODczIn0.Nusb4DbKb1KnkWWDcZUy-w',
			style: 'mapbox://styles/mapbox/streets-v9',
		},
	}
};
