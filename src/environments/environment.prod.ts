export const environment = {
	production: true,
	plugins: {
		facebook: {
			appId: 11111111,
			fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
			scope: 'public_profile, email',
			tokenClient: '11111111',
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
