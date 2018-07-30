import { Page } from '../core/pages';

export const page: Page[] = [
	{ id: 1001, name: 'Homepage', title: 'Homepage', slug: '/', component: 'HomeComponent' },
	{ id: 2002, name: 'Search', title: 'Search', slug: '/search', component: 'SerpComponent' },
	{ id: 2003, name: 'Profile', title: 'Profile', slug: '/profile', component: 'ProfileComponent' },
	{ id: 2004, name: 'Payment', title: 'Payment', slug: '/payment', component: 'PaymentComponent' },
	{ id: 2101, name: 'Sign', title: 'Sign', slug: '/accedi', component: 'SignComponent' },
	{ id: 2201, name: 'Sign Up', title: 'Sign Up', slug: '/registrati', component: 'SignUpComponent' },
	{ id: 2301, name: 'Sign In', title: 'Sign In', slug: '/login', component: 'SignInComponent' },
	{ id: 2401, name: 'Retrieve Password', title: 'Retrieve Password', slug: '/recupera-password', component: 'SignForgottenComponent' },
	{ id: 3001, name: 'Regions', title: 'Regions', slug: '/regions', component: 'RegionsComponent' },
	{ id: 4001, name: 'Abruzzo', title: 'Region Abruzzo', slug: '/abruzzo', component: 'RegionDetailComponent' },
	{ id: 4002, name: 'Basilicata', title: 'Region Basilicata', slug: '/basilicata', component: 'RegionDetailComponent' },
	{ id: 4003, name: 'Calabria', title: 'Region Calabria', slug: '/calabria', component: 'RegionDetailComponent' },
	{ id: 4004, name: 'Campania', title: 'Region Campania', slug: '/campania', component: 'RegionDetailComponent' },
	{ id: 4005, name: 'Emilia-Romagna', title: 'Region Emilia-Romagna', slug: '/emilia-romagna', component: 'RegionDetailComponent' },
	{ id: 4006, name: 'Friuli-Venezia Giulia', title: 'Region Friuli-Venezia Giulia', slug: '/friuli-venezia-giulia', component: 'RegionDetailComponent' },
	{ id: 4007, name: 'Lazio', title: 'Region Lazio', slug: '/lazio', component: 'RegionDetailComponent' },
	{ id: 4008, name: 'Liguria', title: 'Region Liguria', slug: '/liguria', component: 'RegionDetailComponent' },
	{ id: 4009, name: 'Lombardia', title: 'Region Lombardia', slug: '/lombardia', component: 'RegionDetailComponent' },
	{ id: 4010, name: 'Marche', title: 'Region Marche', slug: '/marche', component: 'RegionDetailComponent' },
	{ id: 4011, name: 'Molise', title: 'Region Molise', slug: '/molise', component: 'RegionDetailComponent' },
	{ id: 4012, name: 'Piemonte', title: 'Region Piemonte', slug: '/piemonte', component: 'RegionDetailComponent' },
	{ id: 4013, name: 'Puglia', title: 'Region Puglia', slug: '/puglia', component: 'RegionDetailComponent' },
	{ id: 4014, name: 'Sardegna', title: 'Region Sardegna', slug: '/sardegna', component: 'RegionDetailComponent' },
	{ id: 4015, name: 'Sicilia', title: 'Region Sicilia', slug: '/sicilia', component: 'RegionDetailComponent' },
	{ id: 4016, name: 'Toscana', title: 'Region Toscana', slug: '/toscana', component: 'RegionDetailComponent' },
	{ id: 4017, name: 'Trentino-Alto Adige', title: 'Region Trentino-Alto Adige', slug: '/trentino-alto-adige', component: 'RegionDetailComponent' },
	{ id: 4018, name: 'Umbria', title: 'Region Umbria', slug: '/umbria', component: 'RegionDetailComponent' },
	{ id: 4019, name: 'Valle d\'Aosta', title: 'Region Valle d\'Aosta', slug: '/valle-d-aosta', component: 'RegionDetailComponent' },
	{ id: 4020, name: 'Veneto', title: 'Region Veneto', slug: '/veneto', component: 'RegionDetailComponent' },
	{
		id: 9340,
		slug: '/villaggio_elisena_5',
		url: 'https://www.eurospin-viaggi.it/villaggio_elisena_5',
		name: 'Villaggio Elisena',
		title: 'Villaggio Elisena',
		description: 'PRENOTA ORA: Viaggi a Vieste, Puglia - VILLAGGIO ELISENA - Eurospin Viaggi',
		component: 'HotelComponent',
		meta: {
			description: 'PRENOTA ORA: Viaggi a Vieste, Puglia - VILLAGGIO ELISENA - Eurospin Viaggi',
			keywords: 'viaggi,viaggi eurospin,viaggi Vieste,viaggi Puglia',
			type: 'article',
			author: '',
			locale: 'it_IT',
			robots: 'index,follow',
		},
		images: [{
			id: 28819,
			url: '/media/immagini/28819_z_Villaggio Elisena_Vieste_vieste_G.jpg',
			title: 'VILLAGGIO ELISENA a Vieste. Foto 1 di Eurospin Viaggi',
			type: 1,
		}, {
			id: 28821,
			url: '/media/immagini/28821_z_Villaggio Elisena_Vieste_appartamenti_G.jpg',
			title: 'VILLAGGIO ELISENA a Vieste. Foto 2 di Eurospin Viaggi',
			type: 1,
		}, {
			id: 28822,
			url: '/media/immagini/28822_z_Villaggio Elisena_Vieste_spiaggia_G.jpg',
			title: 'VILLAGGIO ELISENA a Vieste. Foto 3 di Eurospin Viaggi',
			type: 1,
		}, {
			id: 28823,
			url: '/media/immagini/28823_z_Villaggio Elisena_Vieste_camera_G.jpg',
			title: 'VILLAGGIO ELISENA a Vieste. Foto 4 di Eurospin Viaggi',
			type: 1,
		}, {
			id: 28825,
			url: '/media/immagini/28825_z_Villaggio Elisena_Vieste_tennis_G.jpg',
			title: 'VILLAGGIO ELISENA a Vieste. Foto 5 di Eurospin Viaggi',
			type: 1,
		}, {
			id: 28824,
			url: '/media/immagini/28824_z_Villaggio Elisena_Vieste_piscina_G.jpg',
			title: 'VILLAGGIO ELISENA a Vieste. Foto 6 di Eurospin Viaggi',
			type: 1,
		}],
		features: [{
			id: 13,
			title: 'La quota comprende',
			description: '<p style="text-align:justify"><strong>Pensione completa </strong>con colazione italiana a buffet, pranzo e cena con servizio al tavolo con menu di 3 portate (il soggiorno inizia con la cena e termina con la colazione), <strong>bevande ai pasti</strong> (1/4 vino e 1/2 acqua), <strong>servizio spiaggia </strong>con 1 ombrellone e 2 lettini ad unità a partire dalla 4° fila, <strong>Tessera Club</strong> che comprende utilizzo della piscina, del campo da tennis e da calcetto, servizio navetta da/per la spiaggia (dalle 09:00 alle 12:30 e dalle 14:30 alle 18:00), animazione diurna e serale per adulti e bambini (per soggiorni dal 16/06 al 09/09), parcheggio secondo disponibilità, connessione<strong> </strong>Wi-Fi in zona piscina e ristorante.</p>'
		}, {
			id: 14,
			title: 'La quota non comprende',
			description: '<p style="text-align:justify">Eventuale tassa di soggiorno applicata in loco, aria condizionata (facoltativa - 10 euro&nbsp;al giorno da pagare in loco e da segnalare alla prenotazione),&nbsp;quota per animali domestici di piccola taglia (35 euro a soggiorno da pagare in loco), culla per infant 0-3 anni non compiuti su richiesta alla prenotazione secondo disponibilità (10 euro al giorno da pagare in loco), extra in genere e tutto quanto non specificato nel paragrafo "La quota comprende".&nbsp;</p>'
		}, {
			id: 31,
			title: 'Riduzioni',
			description: '<p style="text-align:justify"><strong>Riduzioni 3° / 4° letto</strong> (valide con almeno 2 persone paganti quota intera):<br> • 2 - 7 anni non compiuti <strong>GRATIS</strong><br> • 7 - 14 anni non compiuti 50%<br> • da 14 anni in poi 20%</p><p style="text-align:justify">Infant 0-2 anni non compiuti GRATIS nel letto con i genitori.</p>'
		}, {
			id: 32,
			title: 'Orario check-in/out',
			description: 'Check-in dalle ore 16:00 alle ore 20:00 <br> Check-out entro ore 10:00'
		}, {
			id: 9,
			title: 'Struttura',
			description: '<p style="text-align:justify">Il Villaggio Elisena si trova a circa 5 km dal centro di Vieste e a circa 2,3 km dalla spiaggia Scialmarino, sul litorale settentrionale della costa garganica. Immerso in una pineta secolare, piacevole riparo dalla calura estiva, offre uno splendido panorama sugli uliveti circostanti ed è la location ideale per chi ricerca relax e una vacanza a stretto contatto con la natura.</p>'
		}, {
			id: 10,
			title: 'Camere',
			description: '<p style="text-align:justify">Gli appartamenti Monolocali 2-4 persone sono dotati di servizi privati con doccia, asciugacapelli, set di cortesia, frigobar, TV-Sat, aria condizionata (facoltativa - 10 euro al giorno da pagare in loco e da segnalare alla prenotazione). Dispongono di letto matrimoniale ed eventuale letto singolo o a castello, disposti in in un unico ambiente.</p>'
		}, {
			id: 11,
			title: 'Servizi',
			description: '<p style="text-align:justify">A disposizione degli ospiti reception (dalle 08 alle 13 e dalle 16 alle 20), bar, bar in piscina, ristorante (su richiesta vengono forniti menu per intolleranze alimentari), connessione Wi-Fi in zona piscina e ristorante (gratuita), giardino, area giochi per bambini, campo da tennis, campo da calcetto, piscina esterna attrezzata con lettini secondo disponibilità, parcheggio secondo disponibilità (gratuito), culla per infant 0-3 anni non compiuti su richiesta al momento della prenotazione secondo disponibilità (10 euro al giorno da pagare in loco).</p><p style="text-align:justify"><strong>Tessera Club (inclusa):</strong><br> La Tessera Club è inclusa e comprende utilizzo della piscina e del campo da calcetto e da tennis, servizio navetta da/per la spiaggia ad orari prestabiliti, animazione diurna e serale per adulti e bambini (per soggiorni dal 16/06 al 09/09).</p>'
		}, {
			id: 21,
			title: 'Spiaggia',
			description: '<p style="text-align:justify">La struttura dispone di lido convenzionato, a circa 2,3 km ed è raggiungibile con servizio navetta (dalle 09:00 alle 12:30 e dalle 14:30 alle 18:00). Il servizio spiaggia è compreso e include 1 ombrellone e 2 lettini ad unità a partire dalla 4° fila.</p>'
		}, {
			id: 12,
			title: 'Amici a 4 zampe',
			description: '<p style="text-align:justify">Ammessi di piccola taglia (35 euro a soggiorno da pagare in loco - non sono ammessi negli spazi comuni), previa segnalazione al call center al momento della prenotazione.</p>'
		}, {
			id: 1033,
			title: 'Dettaglio periodi e prezzi',
			description: '<div class="table-wrap"><p>Arrivo giornaliero minimo 3 notti <em>*</em></p><table class="table"><tbody><tr><td class="data"><span>25/05/2018</span> <em>-</em> 16/06/2018</td><td><span class="price">€ 159 in Monolocale 2-4 persone</span></td></tr></tbody></table><p>Arrivo Sabato minimo 7 notti <em>*</em></p><table class="table"><tbody><tr><td class="data"><span>16/06/2018</span> <em>-</em> <span>07/07/2018</span></td><td>€ 399 in Monolocale 2-4 persone</td></tr><tr><td class="data"><span>07/07/2018</span> <em>-</em> <span>04/08/2018</span></td><td>€ 455 in Monolocale 2-4 persone</td></tr><tr><td class="data">04/08/2018 - 18/08/2018</td><td>€ 735 in Monolocale 2-4 persone</td></tr><tr><td class="data">18/08/2018 - 25/08/2018</td><td>€ 630 in Monolocale 2-4 persone</td></tr><tr><td class="data">25/08/2018 - 16/09/2018</td><td>€ 385 in Monolocale 2-4 persone</td></tr></tbody></table><small><em>*</em> Prezzi per persona<br> Nessun costo aggiuntivo di iscrizione o prenotazione </small>'
		}]
	},
];
