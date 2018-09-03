export const environment = {
	assets: '/angular-spin/assets',
	production: true,
	public: '/angular-spin',
	languages: [
		{ id: 1, name: 'Italiano', lang: 'it' },
		{ id: 2, name: 'English', lang: 'en' },
	],
	plugins: {
		facebook: {
			appId: 2044894462438447,
			fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
			scope: 'public_profile, email',
			tokenClient: 'f8cfcad4c81572987d21ecd4d115918f',
			version: 'v3.0',
		},
		google: {
			apiKey: 'AIzaSyDKHO9RHmiMMziRiO6xVFCELQcEDQ5Ub3o',
			clientId: '635556948154-k7fm0pvn6va39tap1ge4iq23ntd4hu37.apps.googleusercontent.com',
		},
		googleTagManager: {
			id: 'GTM-TS2H6VG',
		},
		mapbox: {
			accessToken: 'pk.eyJ1Ijoic3VwYWhmdW5rIiwiYSI6IjE4Zjg1MWMxYzQ3M2RlYTU4OGNlMTc4ODFmOTkyODczIn0.Nusb4DbKb1KnkWWDcZUy-w',
			style: 'mapbox://styles/supahfunk/cjjy5l19r3c7m2rmy15gg3059',
		},
	}
};
