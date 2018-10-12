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
			{ id: 211, slug: '/destinazioni/italia/abruzzo', name: 'Abruzzo' },
			{ id: 211, slug: '/destinazioni/italia/basilicata', name: 'Basilicata' },
			{ id: 211, slug: '/destinazioni/italia/calabria', name: 'Calabria' },
			{ id: 211, slug: '/destinazioni/italia/campania', name: 'Campania' },
			{ id: 211, slug: '/destinazioni/italia/emilia-romagna', name: 'Emilia Romagna' },
			{ id: 211, slug: '/destinazioni/italia/friuli-venezia-giulia', name: 'Friuli Venezia Giulia' },
			{ id: 211, slug: '/destinazioni/italia/lazio', name: 'Lazio' },
			{ id: 211, slug: '/destinazioni/italia/liguria', name: 'Liguria' },
			{ id: 211, slug: '/destinazioni/italia/lombardia', name: 'Lombardia' },
			{ id: 211, slug: '/destinazioni/italia/marche', name: 'Marche' },
			{ id: 211, slug: '/destinazioni/italia/molise', name: 'Molise' },
			{ id: 211, slug: '/destinazioni/italia/piemonte', name: 'Piemonte' },
			{ id: 211, slug: '/destinazioni/italia/puglia', name: 'Puglia' },
			{ id: 211, slug: '/destinazioni/italia/sardegna', name: 'Sardegna' },
			{ id: 211, slug: '/destinazioni/italia/sicilia', name: 'Sicilia' },
			{ id: 211, slug: '/destinazioni/italia/toscana', name: 'Toscana' },
			{ id: 211, slug: '/destinazioni/italia/trentino-alto-adige', name: 'Trentino Alto Adige' },
			{ id: 211, slug: '/destinazioni/italia/umbria', name: 'Umbria' },
			{ id: 211, slug: '/destinazioni/italia/valle-d-aosta', name: 'Valle d\'Aosta' },
			{ id: 211, slug: '/destinazioni/italia/veneto', name: 'Veneto' }
		]
	}, {
		id: 22,
		name: 'Estero',
		items: [
			{ id: 221, slug: '/destinazioni/austria', name: 'Austria' },
			{ id: 221, slug: '/destinazioni/caraibi', name: 'Caraibi' },
			{ id: 221, slug: '/destinazioni/corsica', name: 'Corsica' },
			{ id: 221, slug: '/destinazioni/croazia', name: 'Croazia' },
			{ id: 221, slug: '/destinazioni/cuba', name: 'Cuba' },
			{ id: 221, slug: '/destinazioni/egitto', name: 'Egitto' },
			{ id: 221, slug: '/destinazioni/francia', name: 'Francia' },
			{ id: 221, slug: '/destinazioni/germania', name: 'Germania' },
			{ id: 221, slug: '/destinazioni/grecia', name: 'Grecia' },
			{ id: 221, slug: '/destinazioni/kenya', name: 'Kenya' },
			{ id: 221, slug: '/destinazioni/mediterraneo-occidentale', name: 'Mediterraneo Occidentale' },
			{ id: 221, slug: '/destinazioni/mediterraneo-orientale', name: 'Mediterraneo Orientale' },
			{ id: 221, slug: '/destinazioni/messico', name: 'Messico' },
			{ id: 221, slug: '/destinazioni/slovenia', name: 'Slovenia' },
			{ id: 221, slug: '/destinazioni/spagna', name: 'Spagna' },
			{ id: 221, slug: '/destinazioni/zanzibar', name: 'Tanzania' },
			{ id: 221, slug: '/destinazioni/ungheria', name: 'Ungheria' }
		]
	}, {
		id: 23,
		name: 'Aree turistiche',
		items: [
			{ id: 231, slug: '/destinazioni/altopiano-paganella', name: 'Altipiano della Paganella' },
			{ id: 231, slug: '/destinazioni/cilento', name: 'Cilento' },
			{ id: 231, slug: '/destinazioni/costa-degli-dei', name: 'Costa degli Dei' },
			{ id: 231, slug: '/destinazioni/altopiano-folgaria-lavarone', name: 'Folgaria e Lavarone' },
			{ id: 231, slug: '/destinazioni/gargano', name: 'Gargano' },
			{ id: 231, slug: '/destinazioni/isole', name: 'Isole' },
			{ id: 231, slug: '/destinazioni/lago-di-garda', name: 'Lago di Garda' },
			{ id: 231, slug: '/destinazioni/langhe', name: 'Langhe' },
			{ id: 231, slug: '/destinazioni/maremma', name: 'Maremma' },
			{ id: 231, slug: '/destinazioni/primiero', name: 'Primiero' },
			{ id: 231, slug: '/destinazioni/riviera-ligure-ponente', name: 'Riviera Ligure di Ponente' },
			{ id: 231, slug: '/destinazioni/salento', name: 'Salento' },
			{ id: 231, slug: '/destinazioni/riviera-veneto-friulana', name: 'Spiagge Veneto-Friuli' },
			{ id: 231, slug: '/destinazioni/colli-euganei', name: 'Terme Veneto' },
			{ id: 231, slug: '/destinazioni/val-di-cembra', name: 'Val di Cembra' },
			{ id: 231, slug: '/destinazioni/val-di-fassa', name: 'Val di Fassa' },
			{ id: 231, slug: '/destinazioni/val-di-fiemme', name: 'Val di Fiemme' },
			{ id: 231, slug: '/destinazioni/val-di-non', name: 'Val di Non' },
			{ id: 231, slug: '/destinazioni/val-di-sole', name: 'Val di Sole' },
			{ id: 231, slug: '/destinazioni/val-gardena', name: 'Val Gardena' },
			{ id: 231, slug: '/destinazioni/val-pusteria', name: 'Val Pusteria' },
			{ id: 231, slug: '/destinazioni/val-rendena', name: 'Val Rendena' },
			{ id: 231, slug: '/destinazioni/val-senales', name: 'Val Senales' },
			{ id: 231, slug: '/destinazioni/val-venosta', name: 'Val Venosta' },
			{ id: 231, slug: '/destinazioni/valle-isarco', name: 'Valle Isarco' }
		]
	}]
}, {
	id: 3,
	name: 'Categorie',
	slug: '/categorie',
	items: [
		{ id: 31, slug: '/destinazioni/mare-italia', name: 'Mare Italia' },
		{ id: 31, slug: '/destinazioni/sardegna-traghetto', name: 'Sardegna + traghetto' },
		{ id: 31, slug: '/destinazioni/montagna', name: 'Montagna' },
		{ id: 31, slug: '/destinazioni/crociera', name: 'Crociere' },
		{ id: 31, slug: '/destinazioni/terme-benessere', name: 'Terme &amp; benessere' },
		{ id: 31, slug: '/destinazioni/lago', name: 'Lago' },
		{ id: 31, slug: '/destinazioni/campagna', name: 'Campagna' },
		{ id: 31, slug: '/destinazioni/vacanze-a-tema', name: 'Vacanze a tema' },
		{ id: 31, slug: '/destinazioni/mare-estero', name: 'Mare estero' },
		{ id: 31, slug: '/destinazioni/città', name: 'Città' },
		{ id: 31, slug: '/destinazioni/vacanze-residence-appartamenti', name: 'Residence &amp; Appartamenti' },
		{ id: 31, slug: '/destinazioni/tour-organizzati', name: 'Tour' },
		{ id: 31, slug: '/destinazioni/last-second', name: 'Last Second' },
		{ id: 31, slug: '/destinazioni/le-nostre-stelle', name: '<span class="lenostrestelle">Le nostre stelle</span>' },
	]
}, {
	id: 4,
	name: 'Informazioni',
	slug: '/informazioni',
	items: [
		{ id: 41, slug: '/le_nostre_garanzie', name: 'Le nostre garanzie' },
		{ id: 41, slug: '/come_funziona', name: 'Come funziona' },
		{ id: 41, slug: '/condizioni_di_vendita', name: 'Modulo informativo per contratti di pacchetto turistico e condizioni di vendita' },
		{ id: 41, slug: '/faq', name: 'Informazioni utili' }
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
