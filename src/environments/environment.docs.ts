export const environment = {
	assets: '/angular-spin/assets',
	enableTracing: false,
	production: true,
	public: '/angular-spin',
	useHash: false,
	useLang: true,
	useMarket: false,
	urlStrategy: '/:lang/', // '/:lang/:market/',
	defaultLanguage: 'it',
	defaultMarket: 'it',
	languages: [
		{ id: 1, name: 'Italiano', lang: 'it' },
		{ id: 2, name: 'English', lang: 'en' },
	],
	plugins: {
		facebook: {
			appId: 2034439646874649,
			fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
			scope: 'public_profile, email',
			tokenClient: '643f8b0780f14625b35a450c83b715dc',
			version: 'v3.0',
		},
		google: {
			apiKey: 'AIzaSyDKHO9RHmiMMziRiO6xVFCELQcEDQ5Ub3o',
			clientId: '635556948154-k7fm0pvn6va39tap1ge4iq23ntd4hu37.apps.googleusercontent.com',
		},
		mapbox: {
			accessToken: 'pk.eyJ1IjoiYWN0YXJpYW4iLCJhIjoiY2lqNWU3MnBzMDAyZndnbTM1cjMyd2N2MiJ9.CbuEGSvOAfIYggQv854pRQ',
			style: 'mapbox://styles/actarian/cjj9o6abv2ma42so5mt78oyoq',
		},
	}
};
