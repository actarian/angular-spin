import { MenuItem } from '../core/models/menu';

export const menu: MenuItem[] = [{
	id: 1,
	name: 'Homepage',
	slug: '/'
}, {
	id: 2,
	name: 'Destinazioni',
	slug: '/destinazioni',
	items: [{
		id: 21,
		name: 'Italia',
		items: [
			{ id: 211, slug: 'viaggi_in_abruzzo', name: 'Abruzzo' },
			{ id: 211, slug: 'viaggi_in_basilicata', name: 'Basilicata' },
			{ id: 211, slug: 'viaggi_in_calabria', name: 'Calabria' },
			{ id: 211, slug: 'viaggi_in_campania', name: 'Campania' },
			{ id: 211, slug: 'viaggi_emilia_romagna', name: 'Emilia Romagna' },
			{ id: 211, slug: 'viaggi_friuli_venezia_giulia', name: 'Friuli Venezia Giulia' },
			{ id: 211, slug: 'viaggi_in_lazio', name: 'Lazio' },
			{ id: 211, slug: 'viaggi_in_liguria', name: 'Liguria' },
			{ id: 211, slug: 'viaggi_in_lombardia', name: 'Lombardia' },
			{ id: 211, slug: 'viaggi_marche', name: 'Marche' },
			{ id: 211, slug: 'viaggi_in_molise', name: 'Molise' },
			{ id: 211, slug: 'viaggi_in_piemonte', name: 'Piemonte' },
			{ id: 211, slug: 'viaggi_in_puglia', name: 'Puglia' },
			{ id: 211, slug: 'viaggi_in_sardegna', name: 'Sardegna' },
			{ id: 211, slug: 'viaggi_in_sicilia', name: 'Sicilia' },
			{ id: 211, slug: 'viaggi_in_toscana', name: 'Toscana' },
			{ id: 211, slug: 'viaggi_trentino_alto_adige', name: 'Trentino Alto Adige' },
			{ id: 211, slug: 'viaggi_in_umbria', name: 'Umbria' },
			{ id: 211, slug: 'viaggi_valle_aosta', name: 'Valle d\'Aosta' },
			{ id: 211, slug: 'viaggi_in_veneto', name: 'Veneto' }
		]
	}, {
		id: 22,
		name: 'Estero',
		items: [
			{ id: 221, slug: 'viaggi_in_austria', name: 'Austria' },
			{ id: 221, slug: 'viaggi_caraibi', name: 'Caraibi' },
			{ id: 221, slug: 'viaggi_in_corsica', name: 'Corsica' },
			{ id: 221, slug: 'viaggi_in_croazia', name: 'Croazia' },
			{ id: 221, slug: 'viaggi_a_cuba', name: 'Cuba' },
			{ id: 221, slug: 'viaggi_in_egitto', name: 'Egitto' },
			{ id: 221, slug: 'viaggi_in_francia', name: 'Francia' },
			{ id: 221, slug: 'viaggi_in_germania', name: 'Germania' },
			{ id: 221, slug: 'viaggi_in_grecia', name: 'Grecia' },
			{ id: 221, slug: 'viaggi_in_kenya', name: 'Kenya' },
			{ id: 221, slug: 'viaggi_mediterraneo_occidentale', name: 'Mediterraneo Occidentale' },
			{ id: 221, slug: 'viaggi_mediterraneo_orientale', name: 'Mediterraneo Orientale' },
			{ id: 221, slug: 'viaggi_in_messico', name: 'Messico' },
			{ id: 221, slug: 'viaggi_in_slovenia', name: 'Slovenia' },
			{ id: 221, slug: 'viaggi_in_spagna', name: 'Spagna' },
			{ id: 221, slug: 'viaggi_zanzibar', name: 'Tanzania' },
			{ id: 221, slug: 'viaggi_in_ungheria', name: 'Ungheria' }
		]
	}, {
		id: 23,
		name: 'Aree turistiche',
		items: [
			{ id: 231, slug: 'viaggi_altopiano_paganella', name: 'Altipiano della Paganella' },
			{ id: 231, slug: 'viaggi_cilento', name: 'Cilento' },
			{ id: 231, slug: 'viaggi_costa_degli_dei', name: 'Costa degli Dei' },
			{ id: 231, slug: 'viaggi_altopiano_folgaria_lavarone', name: 'Folgaria e Lavarone' },
			{ id: 231, slug: 'viaggi_gargano', name: 'Gargano' },
			{ id: 231, slug: 'viaggi_sulle_isole', name: 'Isole' },
			{ id: 231, slug: 'viaggi_sul_lago_di_garda', name: 'Lago di Garda' },
			{ id: 231, slug: 'viaggi_nelle_langhe', name: 'Langhe' },
			{ id: 231, slug: 'viaggi_nella_maremma', name: 'Maremma' },
			{ id: 231, slug: 'viaggi_primiero', name: 'Primiero' },
			{ id: 231, slug: 'viaggi_riviera_ligure_ponente', name: 'Riviera Ligure di Ponente' },
			{ id: 231, slug: 'viaggi_in_salento', name: 'Salento' },
			{ id: 231, slug: 'viaggi_riviera_veneto_friulana', name: 'Spiagge Veneto-Friuli' },
			{ id: 231, slug: 'viaggi_colli_euganei', name: 'Terme Veneto' },
			{ id: 231, slug: 'viaggi_val_di_cembra', name: 'Val di Cembra' },
			{ id: 231, slug: 'viaggi_val_di_fassa', name: 'Val di Fassa' },
			{ id: 231, slug: 'viaggi_val_di_fiemme', name: 'Val di Fiemme' },
			{ id: 231, slug: 'viaggi_val_di_non', name: 'Val di Non' },
			{ id: 231, slug: 'viaggi_val_di_sole', name: 'Val di Sole' },
			{ id: 231, slug: 'viaggi_val_gardena', name: 'Val Gardena' },
			{ id: 231, slug: 'viaggi_val_pusteria', name: 'Val Pusteria' },
			{ id: 231, slug: 'viaggi_val_rendena', name: 'Val Rendena' },
			{ id: 231, slug: 'viaggi_val_senales', name: 'Val Senales' },
			{ id: 231, slug: 'viaggi_val_venosta', name: 'Val Venosta' },
			{ id: 231, slug: 'viaggi_valle_isarco', name: 'Valle Isarco' }
		]
	}]
}, {
	id: 3,
	name: 'Categorie',
	slug: '/categorie',
	items: [
		{ id: 31, slug: 'viaggi_mare_italia', name: ' Mare Italia ' },
		{ id: 31, slug: 'viaggi_sardegna_traghetto', name: ' Sardegna + traghetto ' },
		{ id: 31, slug: 'viaggi_in_montagna', name: ' Montagna ' },
		{ id: 31, slug: 'viaggi_in_crociera', name: ' Crociere ' },
		{ id: 31, slug: 'viaggi_terme_benessere', name: ' Terme &amp; benessere ' },
		{ id: 31, slug: 'viaggi_lago', name: ' Lago ' },
		{ id: 31, slug: 'viaggi_campagna', name: ' Campagna ' },
		{ id: 31, slug: 'vacanze_a_tema', name: ' Vacanze a tema ' },
		{ id: 31, slug: 'viaggi_mare_estero', name: ' Mare estero ' },
		{ id: 31, slug: 'viaggi_in_città', name: ' Città ' },
		{ id: 31, slug: 'vacanze_residence_appartamenti', name: ' Residence &amp; Appartamenti ' },
		{ id: 31, slug: 'viaggi_tour_organizzati', name: ' Tour ' },
		{ id: 31, slug: 'viaggi_last_second', name: ' Last Second ' },
		{ id: 31, slug: 'le_nostre_stelle', name: '<span class="lenostrestelle">Le nostre stelle</span>' },
	]
}, {
	id: 4,
	name: 'Informazioni',
	slug: '/informazioni',
	items: [
		{ id: 41, slug: 'le_nostre_garanzie', name: 'Le nostre garanzie' },
		{ id: 41, slug: 'come_funziona', name: 'Come funziona' },
		{ id: 41, slug: 'condizioni_di_vendita', name: 'Modulo informativo per contratti di pacchetto turistico e condizioni di vendita' },
		{ id: 41, slug: 'faq', name: 'Informazioni utili' }
	]
}, {
	id: 5,
	name: 'Carta Regalo',
	slug: '/carta_regalo'
}, {
	id: 6,
	name: 'Contatti',
	slug: '/contatti'
}];
