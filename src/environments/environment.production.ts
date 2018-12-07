export enum AuthStrategy {
	Bearer = 0,
	Cookie = 1,
}

export const environment = {
	transition: {
		appId: 'app'
	},
	preboot: {
		appRoot: 'app-component'
	},
	memoryApi: {
		apiBase: 'api/',
		passThruUnknownUrl: true,
		dataEncapsulation: false,
		delay: 0,
		remap: {
			'/user/views': '/lastview',
			'/user/destinations': '/destinations',
		}
	},
	assets: '/assets',
	enableTracing: false,
	public: '/',
	useHash: false,
	useLang: false,
	useMarket: false,
	urlStrategy: '', // '/:lang/', // '/:lang/:market/',
	defaultLanguage: 'it',
	defaultMarket: 'it',
	languages: [
		{ id: 1, name: 'Italiano', lang: 'it' }
	],
	authStrategy: AuthStrategy.Cookie,
	production: true,
	editor: false,
	plugins: {
		facebook: {
			appId: 248961952353135, // www.eurospin-viaggi.it
			fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
			scope: 'public_profile, email',
			tokenClient: 'ca1a154cc8892614004d4d8ad28515c9', // www.eurospin-viaggi.it
			version: 'v3.0',
		},
		google: {
			clientId: '635556948154-k7fm0pvn6va39tap1ge4iq23ntd4hu37.apps.googleusercontent.com', // AngularSpin
		},
		googleTagManager: {
			id: 'GTM-5L6HMD',
			uaId: 'UA-12054755-5',
			uaIdOperator: 'UA-12054755-6',
		},
		mapbox: {
			accessToken: 'pk.eyJ1IjoiYWN0YXJpYW4iLCJhIjoiY2lqNWU3MnBzMDAyZndnbTM1cjMyd2N2MiJ9.CbuEGSvOAfIYggQv854pRQ', // Actarian Basic Style
			style: 'mapbox://styles/actarian/cjosga2ir4hmg2sphrq0wil9n', // Actarian Basic Style
		},
		paypal: {
			env: 'sandbox', // Set your environment: sandbox | production
			style: {
				label: 'pay', // label: string
				size: 'responsive', // size: small | medium | large | responsive
				shape: 'rect',   // shape: pill | rect
				color: 'blue'   // color: gold | blue | silver | black
			},
			// PayPal Client IDs - replace with your own
			// Create a PayPal app: https://developer.paypal.com/developer/applications/create
			client: {
				sandbox: 'AUSlOhxjtQI5MqlbuyXcFQ3d6pVXQs2maVjB2nHXwMhBxhQa3g4U3wvy98tSiP0iLT3pgJIlyZsV1F--',
				production: '<insert production client id>'
			},
			commit: true, // Show the buyer a 'Pay Now' button in the checkout flow
			sandboxFacilitator: 'lzampetti-facilitator@gmail.com' // facilitator account
		},
		trustPilot: {
			templateId: '544a426205dc0a09088833c6',
			templateServiceId: '530d0eaf748a510e2093cf9b', // simple '56278e9abfbbba0bdcd568bc',
			businessunitId: '58e253ab0000ff00059fc0fe',
			businessunitName: 'www.eurospin-viaggi.it',
		},
		swiper: {
			direction: 'horizontal',
			slidesPerView: 'auto',
			spaceBetween: 8,
			grabCursor: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true
			}
		},
	}
};
