/* ============================================================================
   script.js — "Wortmeister" German Word Guessing Game
   ----------------------------------------------------------------------------
   HOW THE GAME WORKS (overview):
   1. The player picks a word length (5, 6, 7, 8+ or 13 letters).
   2. A random German word of that length is chosen; its letters are hidden
      behind blank tiles.
   3. The player guesses letters (by clicking the on-screen keyboard or typing
      on a physical keyboard). Correct letters are revealed on the tiles;
      wrong guesses cost one "try".
   4. The player wins by revealing the whole word before running out of tries.
      Winning extends the score streak; losing resets it to 0.
   ========================================================================== */

// 'use strict' enables JavaScript Strict Mode: the browser becomes stricter
// about silent errors (e.g., using an undeclared variable throws an error
// instead of silently creating a global). This helps catch bugs early.
'use strict';

/* ---------- Word data: frequent German nouns (A–Z only) ---------- */
// WORDS is a lookup table keyed by word length. Each key (5, 6, 7, 8, 13)
// holds an array of word entries used by the game:
//   w = the German word (uppercase, shown on the tiles)
//   m = the English meaning/translation revealed after the round ends

/* ---------- Word data: frequent German nouns (A–Z only)// ---------- */
const WORDS = {
  5: [
    { w:'APFEL', m:'apple' }, { w:'TISCH', m:'table' }, { w:'KATZE', m:'cat' },
    { w:'BLUME', m:'flower' }, { w:'STUHL', m:'chair' }, { w:'SPIEL', m:'game; play' },
    { w:'BRIEF', m:'letter (mail)' }, { w:'FISCH', m:'fish' }, { w:'VOGEL', m:'bird' },
    { w:'PFERD', m:'horse' }, { w:'MILCH', m:'milk' }, { w:'LICHT', m:'light' },
    { w:'NACHT', m:'night' }, { w:'REGEN', m:'rain' }, { w:'SCHNEE', m:'snow' },
    { w:'FEUER', m:'fire' }, { w:'WOCHE', m:'week' }, { w:'MONAT', m:'month' },
    { w:'HERBST', m:'autumn' }, { w:'STERN', m:'star' }, { w:'WOLKE', m:'cloud' },
    { w:'LEBEN', m:'life' }, { w:'VATER', m:'father' }, { w:'JUNGE', m:'boy' },
    { w:'STADT', m:'city' }, { w:'FLUSS', m:'river' }, { w:'LAMPE', m:'lamp' },
    { w:'MARKT', m:'market' }, { w:'KARTE', m:'card; map; ticket' }, { w:'KRAFT', m:'power; force' },
    { w:'TASSE', m:'cup' }, { w:'GABEL', m:'fork' }, { w:'FARBE', m:'color; paint' },
    { w:'BLITZ', m:'lightning' }, { w:'STURM', m:'storm' }, { w:'SONNE', m:'sun' },
    { w:'ABEND', m:'evening' }, { w:'INSEL', m:'island' }, { w:'HAFEN', m:'harbor' },
    { w:'IMMER', m:'always' }, { w:'FRAGE', m:'question' }, { w:'REISE', m:'journey' },
    { w:'GLÜCK', m:'luck' }, { w:'GEIST', m:'spirit' }, { w:'KLEID', m:'dress' },
    { w:'SCHUH', m:'shoe' }, { w:'STIFT', m:'pen' }, { w:'BODEN', m:'floor' }, { w:'WEISS', m:'white' },
    { w:'BRAUN', m:'brown' }, { w:'KLEIN', m:'small' }, { w:'GROSS', m:'large' }, { w:'STOLZ', m:'proud' },
    { w:'MÄUSE', m:'mice' }, { w:'HUNDE', m:'dogs' }, { w:'SÜSSE', m:'sweet' }, { w:'BITTE', m:'please' },
    { w:'DANKE', m:'thanks' }, { w:'GERNE', m:'gladly' }, { w:'STARK', m:'strong' }, { w:'RECHT', m:'right/law' },
    { w:'WÄRME', m:'warmth' }, { w:'KÄLTE', m:'coldness' }, { w:'STILL', m:'quiet' }, { w:'SÜDEN', m:'south' },
    { w:'OSTEN', m:'east' }, { w:'GRUND', m:'ground' }, { w:'STÜCK', m:'piece' },
    { w:'SENSE', m:'scythe' }, { w:'KUNDE', m:'customer' }, { w:'WAGEN', m:'car/wagon' },
    { w:'SORGE', m:'worry' },
    { w:'STROM', m:'current/electricity' }, { w:'SÜSSE', m:'sweetness' },
    { w:'BIRNE', m:'pear' }, { w:'ERBSE', m:'pea' }, { w:'BOHNE', m:'bean' },
    { w:'GURKE', m:'cucumber' }, { w:'SALAT', m:'salad; lettuce' }, { w:'SUPPE', m:'soup' },
    { w:'WURST', m:'sausage' }, { w:'NUDEL', m:'noodle' }, { w:'TORTE', m:'cake; tart' },
    { w:'HONIG', m:'honey' }, { w:'TIGER', m:'tiger' }, { w:'ZEBRA', m:'zebra' },
    { w:'KAMEL', m:'camel' }, { w:'SCHAF', m:'sheep' }, { w:'ZIEGE', m:'goat' },
    { w:'STIER', m:'bull' }, { w:'FUCHS', m:'fox' }, { w:'ADLER', m:'eagle' },
    { w:'TAUBE', m:'pigeon; dove' }, { w:'BIENE', m:'bee' }, { w:'WESPE', m:'wasp' },
    { w:'KÄFER', m:'beetle' }, { w:'BAUCH', m:'belly' }, { w:'STIRN', m:'forehead' },
    { w:'WANGE', m:'cheek' }, { w:'ZUNGE', m:'tongue' }, { w:'LIPPE', m:'lip' },
    { w:'MAGEN', m:'stomach' }, { w:'LEBER', m:'liver' }, { w:'NIERE', m:'kidney' },
    { w:'DECKE', m:'ceiling; blanket' }, { w:'REGAL', m:'shelf' }, { w:'BESEN', m:'broom' },
    { w:'EIMER', m:'bucket' }, { w:'KANNE', m:'pot; jug' }, { w:'SEIFE', m:'soap' },
    { w:'NADEL', m:'needle' }, { w:'FADEN', m:'thread' }, { w:'KNOPF', m:'button' },
    { w:'KETTE', m:'chain' }, { w:'WIESE', m:'meadow' }, { w:'ACKER', m:'field' },
    { w:'STEIN', m:'stone' }, { w:'HÜGEL', m:'hill' }, { w:'KÜSTE', m:'coast' },
    { w:'WELLE', m:'wave' }, { w:'NEBEL', m:'fog' }, { w:'RAUCH', m:'smoke' },
    { w:'ZWEIG', m:'branch' }, { w:'BLATT', m:'leaf' }, { w:'ONKEL', m:'uncle' },
    { w:'TANTE', m:'aunt' }, { w:'KÖNIG', m:'king' }, { w:'BAUER', m:'farmer' },
    { w:'JÄGER', m:'hunter' }, { w:'MALER', m:'painter' }, { w:'JACKE', m:'jacket' },
    { w:'BLUSE', m:'blouse' }, { w:'ANZUG', m:'suit' }, { w:'MÜTZE', m:'cap' },
    { w:'LEISE', m:'quiet; soft' }, { w:'RUHIG', m:'calm' }, { w:'KRANK', m:'sick' },
    { w:'REICH', m:'rich' }, { w:'TEUER', m:'expensive' }, { w:'HEISS', m:'hot' },
    { w:'OFFEN', m:'open' }, { w:'JETZT', m:'now' }, { w:'HABEN', m:'to have' },
    { w:'GEHEN', m:'to go' }, { w:'ESSEN', m:'to eat; food' }, { w:'LESEN', m:'to read' },
    { w:'SEHEN', m:'to see' }, { w:'HÖREN', m:'to hear' }, { w:'MUSIK', m:'music' },
    { w:'LIEBE', m:'love' }, { w:'TRAUM', m:'dream' }, { w:'PREIS', m:'price' },
    { w:'MÜNZE', m:'coin' }, { w:'PUNKT', m:'point; dot' }
  ],
  6: [
{ w:'WASSER', m:'water' }, { w:'ZIMMER', m:'room' }, { w:'SCHULE', m:'school' }, { w:'LEHRER', m:'teacher' },
{ w:'KLASSE', m:'class; classroom' }, { w:'MUTTER', m:'mother' }, { w:'BRUDER', m:'brother' }, { w:'MENSCH', m:'human; person' },
{ w:'FREUND', m:'friend' }, { w:'GARTEN', m:'garden' }, { w:'PAPIER', m:'paper' }, { w:'BILDER', m:'pictures' },
{ w:'FINGER', m:'finger' }, { w:'STIMME', m:'voice' }, { w:'KINDER', m:'children' }, { w:'FRAUEN', m:'women' },
{ w:'ARBEIT', m:'work' }, { w:'TREPPE', m:'stairs' }, { w:'KELLER', m:'cellar; basement' }, { w:'SCHIFF', m:'ship' },
{ w:'STRAND', m:'beach' }, { w:'WINTER', m:'winter' }, { w:'SOMMER', m:'summer' }, { w:'FLAMME', m:'flame' },
{ w:'STUNDE', m:'hour' }, { w:'MINUTE', m:'minute' }, { w:'MORGEN', m:'morning; tomorrow' }, { w:'MITTAG', m:'midday; noon' },
{ w:'ANFANG', m:'beginning' }, { w:'KLEINE', m:'small one' }, { w:'KIRCHE', m:'church' }, { w:'TELLER', m:'plate' },
{ w:'MESSER', m:'knife' }, { w:'PFANNE', m:'pan' }, { w:'PINSEL', m:'brush' }, { w:'MUSEUM', m:'museum' },
{ w:'HIMMEL', m:'sky; heaven' }, { w:'DONNER', m:'thunder' }, { w:'NUMMER', m:'number' }, { w:'FERIEN', m:'vacation; holidays' },
{ w:'SIEGER', m:'winner' }, { w:'PUNKTE', m:'points' }, { w:'KÜCHEN', m:'kitchens' },
{ w:'TÜRMEN', m:'towers' },
{ w:'WÄLDER', m:'forests' }, { w:'REISEN', m:'travels' },
{ w:'KÖNIGE', m:'kings' }, { w:'PRINZE', m:'princes' }, { w:'SÜSSEN', m:'sweet' }, { w:'BITTER', m:'bitter' },
{ w:'GEWALT', m:'violence; force' },
{ w:'KNIEEN', m:'knees' }, { w:'HÄNDEN', m:'hands' }, { w:'FÜSSEN', m:'feet' },
{ w:'KÖRPER', m:'body' }, { w:'GEHIRN', m:'brain' }, { w:'HERZEN', m:'hearts' }, { w:'BLUTEN', m:'to bleed' },
{ w:'ATEMEN', m:'to breathe' }, { w:'SCHLAF', m:'sleep' }, { w:'GLÜCKE', m:'luck' },
{ w:'WUNSCH', m:'wish' }, { w:'GEFÜHL', m:'feeling' }, { w:'SPRUCH', m:'saying' },
{ w:'STIFTE', m:'pens' },
{ w:'TAFELN', m:'blackboards' }, { w:'STÜHLE', m:'chairs' }, { w:'TISCHE', m:'tables' },
{ w:'BUTTER', m:'butter' }, { w:'ZUCKER', m:'sugar' }, { w:'BANANE', m:'banana' }, { w:'MELONE', m:'melon' },
{ w:'ORANGE', m:'orange' }, { w:'ANANAS', m:'pineapple' }, { w:'TOMATE', m:'tomato' }, { w:'SPINAT', m:'spinach' },
{ w:'GEMÜSE', m:'vegetables' }, { w:'FRUCHT', m:'fruit' }, { w:'BEEREN', m:'berries' }, { w:'NUDELN', m:'noodles' },
{ w:'ERBSEN', m:'peas' }, { w:'BOHNEN', m:'beans' }, { w:'KAFFEE', m:'coffee' }, { w:'KUCHEN', m:'cakes' },
{ w:'WAFFEL', m:'waffle' }, { w:'BREZEL', m:'pretzel' }, { w:'BONBON', m:'candy' }, { w:'HERING', m:'herring' },
{ w:'KRABBE', m:'crab' }, { w:'LACHSE', m:'salmon' }, { w:'HECHTE', m:'pike' }, { w:'BARSCH', m:'bass' },
{ w:'DORADE', m:'dorade' }, { w:'KAVIAR', m:'caviar' }, { w:'PUNSCH', m:'punch (drink)' }, { w:'RADLER', m:'radler (beer-lemonade mix)' },
{ w:'WHISKY', m:'whisky' }, { w:'KOGNAC', m:'cognac' }, { w:'HIRSCH', m:'deer' }, { w:'PFERDE', m:'horses' },
{ w:'SCHAFE', m:'sheep' }, { w:'ZIEGEN', m:'goats' }, { w:'KAMELE', m:'camels' }, { w:'PAVIAN', m:'pavian (monkey)' },
{ w:'DACHSE', m:'badger' }, { w:'MARDER', m:'marten' }, { w:'WIESEL', m:'weasel' }, { w:'GEPARD', m:'cheetah' },
{ w:'JAGUAR', m:'jaguar' }, { w:'KOYOTE', m:'coyote' }, { w:'AMEISE', m:'ant' }, { w:'BIENEN', m:'bees' },
{ w:'WESPEN', m:'wasps' }, { w:'HUMMEL', m:'bumblebee' }, { w:'MOTTEN', m:'moths' }, { w:'MÜCKEN', m:'mosquitoes' },
{ w:'FLIEGE', m:'fly' }, { w:'BREMSE', m:'brake' }, { w:'GRILLE', m:'grill' }, { w:'SPINNE', m:'spider' },
{ w:'WÜRMER', m:'worms' }, { w:'RAUPEN', m:'caterpillars' }, { w:'KRÖTEN', m:'frogs' }, { w:'FROSCH', m:'frog' },
{ w:'MOLCHE', m:'newts' }, { w:'ECHSEN', m:'lizards' }, { w:'PYTHON', m:'python' }, { w:'KAIMAN', m:'caiman' },
{ w:'DRACHE', m:'dragon' }, { w:'FALKEN', m:'falcons' }, { w:'STORCH', m:'stork' }, { w:'REIHER', m:'heron' },
{ w:'KAKADU', m:'kakadu' }, { w:'ELSTER', m:'starling' }, { w:'SPECHT', m:'woodpecker' }, { w:'FASANE', m:'peafowl' },
{ w:'HÜHNER', m:'chickens' }, { w:'MÜNDER', m:'mouths' }, { w:'LIPPEN', m:'lips' }, { w:'WANGEN', m:'cheeks' },
{ w:'NACKEN', m:'neck' }, { w:'DAUMEN', m:'thumbs' }, { w:'BRÜSTE', m:'breasts' }, { w:'BÄUCHE', m:'belly' },
{ w:'RÜCKEN', m:'back' }, { w:'HÜFTEN', m:'hips' }, { w:'SOHLEN', m:'soles (of feet)' }, { w:'MUSKEL', m:'muscle' },
{ w:'GELENK', m:'joint' }, { w:'SEHNEN', m:'tendons' }, { w:'LUNGEN', m:'lungs' }, { w:'LEBERN', m:'liver' },
{ w:'NIEREN', m:'kidneys' }, { w:'NERVEN', m:'nerves' }, { w:'ZELLEN', m:'cells' }, { w:'GEWEBE', m:'tissue' },
{ w:'ORGANE', m:'organs' }, { w:'PROFIL', m:'profile' }, { w:'MANTEL', m:'coat' }, { w:'JACKEN', m:'jackets' },
{ w:'HEMDEN', m:'shirts' }, { w:'BLUSEN', m:'blouses' }, { w:'ANZÜGE', m:'suits' }, { w:'KOSTÜM', m:'costume' },
{ w:'SOCKEN', m:'socks' }, { w:'MÜTZEN', m:'hats' }, { w:'TÜCHER', m:'handkerchiefs' }, { w:'GÜRTEL', m:'belt' },
{ w:'KNÖPFE', m:'buttons' }, { w:'TASCHE', m:'bag' }, { w:'KOFFER', m:'suitcase' }, { w:'BRILLE', m:'glasses' },
{ w:'KETTEN', m:'chains' }, { w:'PERLEN', m:'pearls' }, { w:'SILBER', m:'silver' }, { w:'BRONZE', m:'bronze' },
{ w:'KUPFER', m:'copper' }, { w:'NICKEL', m:'nickel' }, { w:'PLATIN', m:'platinum' }, { w:'SESSEL', m:'chair' },
{ w:'BETTEN', m:'beds' }, { w:'KISSEN', m:'pillows' }, { w:'DECKEN', m:'blankets' }, { w:'FLUREN', m:'hallways' },
{ w:'DUSCHE', m:'shower' }, { w:'ROHREN', m:'pipes' }, { w:'HAHNEN', m:'roosters' }, { w:'ABFALL', m:'trash' },
{ w:'KLECKS', m:'splatter' }, { w:'KRÜMEL', m:'crumbs' }, { w:'LAMPEN', m:'lamps' }, { w:'FACKEL', m:'torch' },
{ w:'BIRNEN', m:'pears' }, { w:'GLÄSER', m:'glasses (drinking)' }, { w:'TASSEN', m:'cups' }, { w:'TÖPFEN', m:'pots' },
{ w:'KANNEN', m:'jugs' }, { w:'KRÜGEN', m:'pitchers' }, { w:'SCHALE', m:'bowl' }, { w:'NÄPFEN', m:'bowls (for animals)' },
{ w:'LÖFFEL', m:'spoon' }, { w:'GABELN', m:'forks' }, { w:'HERDEN', m:'herds' }, { w:'LÜFTER', m:'fan' },
{ w:'KAMINE', m:'fireplaces' }, { w:'TRUHEN', m:'trunks' }, { w:'REGALE', m:'shelves' }, { w:'HOCKER', m:'stool' },
{ w:'MATTEN', m:'mats' }, { w:'LÄUFER', m:'runner (of a carpet)' }, { w:'DÄCHER', m:'roofs' }, { w:'WÄNDEN', m:'walls' },
{ w:'MAUERN', m:'walls (of buildings)' }, { w:'RIEGEN', m:'rows' }, { w:'GITTER', m:'grille' }, { w:'ZÄUNEN', m:'fences' },
{ w:'HECKEN', m:'hedges' }, { w:'STANGE', m:'pole' }, { w:'STÄBEN', m:'sticks' }, { w:'LATTEN', m:'laths' },
{ w:'PLATTE', m:'plate (flat object)' }, { w:'FOLIEN', m:'films' }, { w:'KARTON', m:'cardboard box' }, { w:'PAPPEN', m:'cardboard' },
{ w:'LEIMEN', m:'glue' }, { w:'KLEBER', m:'glue' }, { w:'KITTEN', m:'putty' }, { w:'HAMMER', m:'hammer' },
{ w:'HÄMMER', m:'hammer' }, { w:'ZANGEN', m:'pliers' }, { w:'BOLZEN', m:'bolts' }, { w:'NÄGELN', m:'nails' },
{ w:'DÜBELN', m:'anchors (for walls)' }, { w:'BOHRER', m:'drill' }, { w:'FEILEN', m:'files' }, { w:'BEILEN', m:'axes' },
{ w:'SPITZE', m:'tip' }, { w:'KLINGE', m:'blade' }, { w:'GRIFFE', m:'handle' }, { w:'HENKEL', m:'handle' },
{ w:'KNÄUFE', m:'knobs' }, { w:'GEIGEN', m:'violin' }, { w:'LAUTEN', m:'lute' }, { w:'HARFEN', m:'harp' },
{ w:'FLÜGEL', m:'piano' }, { w:'ORGELN', m:'organ' }, { w:'ZITHER', m:'zither' }, { w:'LEIERN', m:'to sing' },
{ w:'HÖRNER', m:'horns' }, { w:'FLÖTEN', m:'flutes' }, { w:'FAGOTT', m:'bagpipe' }, { w:'KLÄNGE', m:'sound' },
{ w:'AKKORD', m:'chord' }, { w:'TAKTEN', m:'beats' }, { w:'TÄNZEN', m:'to dance' }, { w:'CHÖREN', m:'to listen' },
{ w:'GRUPPE', m:'group' }, { w:'SÄNGER', m:'singer' }, { w:'BÜHNEN', m:'stages' }, { w:'KARTEN', m:'cards' },
{ w:'KASSEN', m:'cash registers' }, { w:'PLÄTZE', m:'places' }, { w:'REIHEN', m:'rows' }, { w:'RÄNGEN', m:'ranks' },
{ w:'KÜNSTE', m:'arts' }, { w:'WERKEN', m:'to work (craft)' }, { w:'SKIZZE', m:'sketch' }, { w:'MUSTER', m:'pattern' },
{ w:'MODELL', m:'model' }, { w:'FORMEN', m:'shapes' }, { w:'FARBEN', m:'colors' }, { w:'DUNKEL', m:'dark' },
{ w:'SCHEIN', m:'shine' }, { w:'STRAHL', m:'ray' }, { w:'GLUTEN', m:'glow' }, { w:'ASCHEN', m:'ashes' },
{ w:'QUALME', m:'smell' }, { w:'FUNKEN', m:'to spark' }, { w:'ZÜNDER', m:'lighter' }, { w:'KERZEN', m:'candles' },
{ w:'DOCHTE', m:'torch' }, { w:'WACHSE', m:'wax' }, { w:'BÄUMEN', m:'trees' }, { w:'ZWEIGE', m:'branches' },
{ w:'WURZEL', m:'root' }, { w:'STÄMME', m:'trunks' }, { w:'RINDEN', m:'bark' }, { w:'GRÄSER', m:'grasses' },
{ w:'MOOSEN', m:'moss' }, { w:'FARNEN', m:'ferns' }, { w:'NELKEN', m:'carnations' }, { w:'LILIEN', m:'lilies' },
{ w:'KÖRNER', m:'grains' }, { w:'WEIZEN', m:'wheat' }, { w:'GERSTE', m:'barley' }, { w:'HAFERN', m:'oats' },
{ w:'WIESEN', m:'meadows' }, { w:'FELDER', m:'fields' }, { w:'FELDEN', m:'fields' }, { w:'ACKERN', m:'fields (for crops)' },
{ w:'SANDEN', m:'sands' }, { w:'STEINE', m:'stones' }, { w:'FELSEN', m:'rocks' }, { w:'HÜGELN', m:'hills' },
{ w:'KLIPPE', m:'cliff' }, { w:'KÜSTEN', m:'coasts' }, { w:'WELLEN', m:'waves' }, { w:'FRÖSTE', m:'frost' },
{ w:'HAGELN', m:'hail' }, { w:'NEBELN', m:'fog' }, { w:'DÜNSTE', m:'fumes' }, { w:'WOLKEN', m:'clouds' },
{ w:'BLITZE', m:'lightning' }, { w:'STÜRME', m:'storms' }, { w:'WINDEN', m:'winds' }, { w:'BRISEN', m:'breezes' },
{ w:'LÜFTEN', m:'to ventilate' }, { w:'KLIMAS', m:'climate' }, { w:'ABENDE', m:'evenings' }, { w:'NÄCHTE', m:'nights' },
{ w:'WOCHEN', m:'weeks' }, { w:'MONATE', m:'months' }, { w:'JAHREN', m:'years' }, { w:'MOMENT', m:'moment' },
{ w:'DAUERN', m:'duration' }, { w:'TERMIN', m:'appointment' }, { w:'VERZUG', m:'departure' }, { w:'TEMPOS', m:'tempos' },
{ w:'WEISEN', m:'ways' }, { w:'TENNIS', m:'tennis' }, { w:'SCHACH', m:'chess' }, { w:'WÜRFEL', m:'die' },
{ w:'SIEGEN', m:'to win' }, { w:'REGELN', m:'rules' }, { w:'SPRUNG', m:'jump' }, { w:'WÜRFEN', m:'to throw' },
{ w:'HANTEL', m:'dumbbell' }, { w:'BÄLLEN', m:'balls' }, { w:'NETZEN', m:'to net' }, { w:'TRIKOT', m:'jersey' },
{ w:'SCHUTZ', m:'protection' }, { w:'DOKTOR', m:'doctor' }, { w:'ÄRZTEN', m:'doctors' }, { w:'PRAXIS', m:'practice (medical)' },
{ w:'PRAXEN', m:'practices' }, { w:'KLINIK', m:'clinic' }, { w:'PILLEN', m:'pills' }, { w:'SALBEN', m:'ointments' },
{ w:'BESUCH', m:'visit' }, { w:'VISITE', m:'visit (medical)' }, { w:'PFLEGE', m:'nursing' }, { w:'GESUND', m:'healthy' },
{ w:'FIEBER', m:'fever' }, { w:'WUNDEN', m:'wounds' }, { w:'NARBEN', m:'scars' }, { w:'BRÜCHE', m:'fractures' },
{ w:'LÄNDER', m:'countries' }, { w:'NATION', m:'nation' }, { w:'VÖLKER', m:'peoples' }, { w:'BÜRGER', m:'citizens' },
{ w:'WAHLEN', m:'to vote' }, { w:'WÄHLER', m:'voters' }, { w:'PARTEI', m:'party' }, { w:'GESETZ', m:'law' },
{ w:'RECHTE', m:'rights' }, { w:'ANWALT', m:'lawyer' }, { w:'KLAGEN', m:'to complain' }, { w:'URTEIL', m:'judgment' },
{ w:'STRAFE', m:'punishment' }, { w:'KNÄSTE', m:'knees' }, { w:'WACHEN', m:'to watch' }, { w:'SOLDAT', m:'soldier' },
{ w:'ARMEEN', m:'armies' }, { w:'HEEREN', m:'armies' }, { w:'MARINE', m:'navy' }, { w:'KRIEGE', m:'wars' },
{ w:'WAFFEN', m:'weapons' }, { w:'SPEERE', m:'spears' }, { w:'PFEILE', m:'arrows' }, { w:'SCHILD', m:'shield' },
{ w:'HELMEN', m:'helmets' }, { w:'PANZER', m:'tank' }, { w:'KANONE', m:'cannon' }, { w:'GEWEHR', m:'rifle' },
{ w:'KUGELN', m:'bullets' }, { w:'BOMBEN', m:'bombs' }, { w:'WELTEN', m:'worlds' }, { w:'PLANET', m:'planet' },
{ w:'STERNE', m:'stars' }, { w:'METEOR', m:'meteor' }, { w:'MONDEN', m:'moons' }, { w:'SONNEN', m:'sun' },
{ w:'RAKETE', m:'rocket' }, { w:'KOSMOS', m:'cosmos' }, { w:'ATOMEN', m:'atoms' }, { w:'UMWELT', m:'environment' },
{ w:'WETTER', m:'weather' }, { w:'FLORAS', m:'flora' }, { w:'FAUNAS', m:'fauna' }, { w:'RASSEN', m:'races' },
{ w:'SIPPEN', m:'clans' }, { w:'GEBURT', m:'birth' }, { w:'ZUFALL', m:'accident' }, { w:'ZAHLEN', m:'numbers' },
{ w:'MENGEN', m:'amounts' }, { w:'ANZAHL', m:'quantity' }, { w:'SUMMEN', m:'sums' }, { w:'MITTEL', m:'middle' },
{ w:'MAXIMA', m:'maxima' }, { w:'MINIMA', m:'minima' }, { w:'NULLEN', m:'zeros' }, { w:'SIEBEN', m:'seven' },
{ w:'ZWEITE', m:'second (ordinal)' }, { w:'DRITTE', m:'third (ordinal)' }, { w:'VIERTE', m:'fourth (ordinal)' },
{ w:'FÜNFTE', m:'fifth (ordinal)' }, { w:'SIEBTE', m:'seventh (ordinal)' }, { w:'NEUNTE', m:'ninth (ordinal)' },
{ w:'LETZTE', m:'last (ordinal)' }, { w:'MONTAG', m:'Monday' },
{ w:'JANUAR', m:'January' }, { w:'AUGUST', m:'August' }, { w:'NORDEN', m:'north' }, { w:'WESTEN', m:'west' },
{ w:'RECHTS', m:'right' }, { w:'HINTEN', m:'behind' }, { w:'SOFORT', m:'immediately' }, { w:'GLEICH', m:'equal' },
{ w:'SPÄTER', m:'later' }, { w:'FRÜHER', m:'earlier' }, { w:'DAMALS', m:'then' }, { w:'SELTEN', m:'rarely' },
{ w:'GERADE', m:'straight' }, { w:'BISHER', m:'until now' }
  ],
  7: [
    { w:'ZEITUNG', m:'newspaper' }, { w:'STRASSE', m:'street' },
    { w:'FAMILIE', m:'family' }, { w:'WOHNUNG', m:'apartment; flat' }, { w:'GESICHT', m:'face' },
    { w:'BAHNHOF', m:'train station' }, { w:'FAHRRAD', m:'bicycle' }, { w:'HEIZUNG', m:'heating' },
    { w:'SPIEGEL', m:'mirror' }, { w:'FLASCHE', m:'bottle' }, { w:'SCHRANK', m:'wardrobe; cabinet' },
    { w:'THEATER', m:'theater' }, { w:'KONZERT', m:'concert' }, { w:'SPIELER', m:'player' },
    { w:'SPRACHE', m:'language' }, { w:'DEUTSCH', m:'German (language)' }, { w:'VERKAUF', m:'sale' },
    { w:'SCHLOSS', m:'castle; palace' }, { w:'RATHAUS', m:'town hall' }, { w:'BRUNNEN', m:'fountain; well' },
    { w:'GEBIRGE', m:'mountain range' }, { w:'FREITAG', m:'Friday' }, { w:'SAMSTAG', m:'Saturday' },
    { w:'SONNTAG', m:'Sunday' }, { w:'BESTECK', m:'cutlery; set of forks/knives' },
    { w:'GEBÄUDE', m:'building' }, { w:'KLEIDUNG', m:'clothing' }, { w:'RECHNUNG', m:'bill' },
    { w:'GEDANKE', m:'thought' }, { w:'GEFÜHLE', m:'feelings' }, { w:'KÜHLUNG', m:'cooling' },
    { w:'SÜDWEST', m:'southwest' }, { w:'NORDOST', m:'northeast' }, { w:'SÜDWIND', m:'south wind' }, { w:'KÜSSTEN', m:'coasts' },
     { w:'SCHÜLER', m:'pupil' }, { w:'NACHBAR', m:'neighbor' }, { w:'KELLNER', m:'waiter' },
     { w:'METZGER', m:'butcher' }, { w:'FISCHER', m:'fisherman' }, { w:'MEISTER', m:'master; champion' }, { w:'PATIENT', m:'patient' },
     { w:'SEKUNDE', m:'second' }, { w:'FEBRUAR', m:'February' }, { w:'OKTOBER', m:'October' }, { w:'UHRZEIT', m:'time (of day)' },
     { w:'NEUJAHR', m:'New Year' }, { w:'TELEFON', m:'telephone' }, { w:'TOASTER', m:'toaster' },
     { w:'LATERNE', m:'lantern; street lamp' }, { w:'PFLANZE', m:'plant' }, { w:'FLEISCH', m:'meat' },
     { w:'PFEFFER', m:'pepper' }, { w:'ZWIEBEL', m:'onion' }, { w:'KAROTTE', m:'carrot' },
     { w:'ZITRONE', m:'lemon' }, { w:'PFLAUME', m:'plum' }, { w:'KIRSCHE', m:'cherry' },
     { w:'AVOCADO', m:'avocado' }, { w:'OMELETT', m:'omelette' }, { w:'EINTOPF', m:'stew' },
     { w:'AUFLAUF', m:'casserole' }, { w:'GERICHT', m:'dish; court' }, { w:'BEILAGE', m:'side dish' }, { w:'DESSERT', m:'dessert' },
     { w:'SCHEIBE', m:'slice; disc' }, { w:'STADION', m:'stadium' },
     { w:'KAPELLE', m:'chapel' }, { w:'DENKMAL', m:'monument' }, { w:'SCHEUNE', m:'barn' }, { w:'GALERIE', m:'gallery' },
     { w:'FUSSWEG', m:'footpath' }, { w:'STRECKE', m:'route; distance' }, { w:'ANTWORT', m:'answer' }, { w:'MEINUNG', m:'opinion' },
     { w:'ZUKUNFT', m:'future' }, { w:'AUFGABE', m:'task' }, { w:'ANGEBOT', m:'offer' }, { w:'PROJEKT', m:'project' },
     { w:'PRODUKT', m:'product' }, { w:'ENERGIE', m:'energy' }, { w:'SCHMERZ', m:'pain' }, { w:'FRIEDEN', m:'peace' },
     { w:'PRÜFUNG', m:'exam' }, { w:'ZEUGNIS', m:'report card' }, { w:'STUDIUM', m:'studies' }, { w:'MEDIZIN', m:'medicine' },
     { w:'VERBAND', m:'bandage' }, { w:'EINKAUF', m:'purchase; shopping' }, { w:'VERLUST', m:'loss' },
     { w:'URKUNDE', m:'certificate' }, { w:'WELTALL', m:'outer space' }, { w:'GALAXIE', m:'galaxy' }, { w:'UNKRAUT', m:'weeds' },
     { w:'STRAUCH', m:'shrub' }, { w:'SCHAUER', m:'shower' },
     { w:'GESTEIN', m:'rock' }, { w:'STIEFEL', m:'boots' },
     { w:'DIAMANT', m:'diamond' }, { w:'ARMBAND', m:'bracelet' }, { w:'OHRRING', m:'earring' }, { w:'ARMREIF', m:'bangle' }, { w:'GITARRE', m:'guitar' },
     { w:'KLAVIER', m:'piano' }, { w:'TROMMEL', m:'drum' }, { w:'MELODIE', m:'melody' }, { w:'GEMÄLDE', m:'painting' }, { w:'DICHTER', m:'poet' },
     { w:'SCHRIFT', m:'writing' }, { w:'POLIZEI', m:'police' }, { w:'SCHWERT', m:'sword' }, { w:'ADRESSE', m:'address' }, { w:'MESSING', m:'brass' },
     { w:'PLASTIK', m:'plastic' }, { w:'SCHWEIN', m:'pig' }, { w:'TURNIER', m:'tournament' }, { w:'WECHSEL', m:'change' },
     { w:'KLAUSUR', m:'written exam' }, { w:'STUDENT', m:'student' },
     { w:'MÄDCHEN', m:'girl' }, { w:'EHEMANN', m:'husband' }, { w:'EHEFRAU', m:'wife' },
    { w:'TOCHTER', m:'daughter' }, { w:'BILDUNG', m:'education' }, { w:'BERICHT', m:'report' },
    { w:'BEITRAG', m:'contribution' }, { w:'AUSGANG', m:'exit' }, { w:'AUSFLUG', m:'excursion; trip' },
    { w:'VERKEHR', m:'traffic' }, { w:'VORHANG', m:'curtain' }, { w:'TEPPICH', m:'carpet' },
    { w:'GEWICHT', m:'weight' }, { w:'ORDNUNG', m:'order' }, { w:'ELEFANT', m:'elephant' },
    { w:'EINHORN', m:'unicorn' }, { w:'DRACHEN', m:'dragon; kite' }, { w:'KAPITÄN', m:'captain' },
    { w:'KAPITEL', m:'chapter' }, { w:'KATALOG', m:'catalog' }, { w:'KLINGEL', m:'doorbell' },
    { w:'KOLLEGE', m:'colleague' }, { w:'KOMPOTT', m:'compote' }, { w:'LEITUNG', m:'pipe; line; management' },
    { w:'MUSIKER', m:'musician' }, { w:'PFARRER', m:'priest; pastor' }, { w:'PINGUIN', m:'penguin' },
    { w:'PRALINE', m:'praline; chocolate' }, { w:'RECHNER', m:'computer; calculator' }, { w:'GIRAFFE', m:'giraffe' },
    { w:'WALROSS', m:'walrus' }, { w:'NASHORN', m:'rhinoceros' }, { w:'LEOPARD', m:'leopard' },
    { w:'PANTHER', m:'panther' }, { w:'ZENTRUM', m:'center' }, { w:'PERIODE', m:'period' },
    { w:'DIALEKT', m:'dialect' }, { w:'ZEICHEN', m:'sign; character' }, { w:'GESTALT', m:'shape; figure' },
    { w:'MALEREI', m:'painting (art form)' }, { w:'URSACHE', m:'cause' }, { w:'WIRKUNG', m:'effect' },
    { w:'ZWEIFEL', m:'doubt' }, { w:'KLOSTER', m:'monastery' }, { w:'KNOCHEN', m:'bone' },
    { w:'KRIEGER', m:'warrior' }, { w:'GEHÄUSE', m:'housing; case' }, { w:'GELÄNDE', m:'terrain' },
    { w:'BISKUIT', m:'biscuit; sponge cake' }, { w:'EIGNUNG', m:'aptitude; suitability' },
    { w:'MALERIN', m:'female painter' }, { w:'JUPITER', m:'Jupiter' }, { w:'JOGHURT', m:'yogurt' },
    { w:'SCHNAPS', m:'schnapps' }, { w:'WALNUSS', m:'walnut' }, { w:'ERDNUSS', m:'peanut' },
    { w:'PAPRIKA', m:'paprika; bell pepper' }, { w:'SPARGEL', m:'asparagus' }, { w:'FENCHEL', m:'fennel' },
    { w:'THYMIAN', m:'thyme' }, { w:'GARDINE', m:'curtain' }, { w:'LEUCHTE', m:'light; lamp' },
    { w:'PARKETT', m:'parquet' }, { w:'STECKER', m:'plug' }, { w:'DRUCKER', m:'printer' },
    { w:'STEMPEL', m:'stamp; stamping device' }, { w:'STRAUSS', m:'bouquet; ostrich' }, { w:'GESTECK', m:'flower arrangement' },
    { w:'SENDUNG', m:'broadcast; shipment' }, { w:'VERSAND', m:'shipping; dispatch' }, { w:'ANSICHT', m:'view; opinion' },
    { w:'SCHMUTZ', m:'dirt' }, { w:'WIRSING', m:'savoy cabbage' }, { w:'ROTKOHL', m:'red cabbage' },
    { w:'STRUDEL', m:'strudel' }
  ],
  8: [
    { w:'WÖRTERBUCH', m:'dictionary' },  { w:'GEBURTSTAG', m:'birthday' }, { w:'FREUNDSCHAFT', m:'friendship' },  { w:'GESCHÄFT', m:'business' },
    { w:'LEBENSMITTEL', m:'food' },  { w:'ARBEITSZIMMER', m:'study/office' },  { w:'WOHNZIMMER', m:'living room' },  { w:'SCHULKIND', m:'schoolchild' },
    { w:'GESCHWISTER', m:'siblings' },  { w:'GEBÄUDE', m:'building' },  { w:'KÜCHENGERÄT', m:'kitchen appliance' },  { w:'WASCHMASCHINE', m:'washing machine' },
    { w:'KÜHLSCHRANK', m:'refrigerator' },  { w:'FERNSEHER', m:'television' },  { w:'COMPUTER', m:'computer' },  { w:'HANDSCHUH', m:'glove' },
    { w:'SCHULTER', m:'shoulder' },  { w:'GEMEINDE', m:'community' },  { w:'BEVÖLKERUNG', m:'population' },  { w:'REGENWALD', m:'rainforest' },
    { w: 'AUTOMOBIL', m: 'automobile' }, { w: 'BIBLIOTHEK', m: 'library' },  { w: 'BLUMENTOPF', m: 'flower pot' },
    { w: 'BUCHHANDLUNG', m: 'bookstore' },  { w: 'DONNERSTAG', m: 'Thursday' },  { w: 'ELEKTRIZITÄT', m: 'electricity' },  { w: 'FOTOGRAFIE', m: 'photography' },
    { w: 'GEBIRGSZUG', m: 'mountain range' },  { w: 'GEMEINSCHAFT', m: 'community' },  { w: 'GESCHICHTE', m: 'history' },  { w: 'GESUNDHEIT', m: 'health' },
    { w: 'HAUSHALT', m: 'household' },  { w: 'INTERNET', m: 'internet' },  { w: 'KALENDER', m: 'calendar' },  { w: 'KINDERGARTEN', m: 'kindergarten' },
    { w: 'KRANKENHAUS', m: 'hospital' },  { w: 'KÜCHENTISCH', m: 'kitchen table' },  { w: 'LEHRERZIMMER', m: 'teachers\' lounge' },
    { w: 'MITTWOCH', m: 'Wednesday' }, { w: 'OBSTGARTEN', m: 'orchard' },  { w: 'PARKHAUS', m: 'parking garage' },
    { w: 'REISEBÜRO', m: 'travel agency' },  { w: 'SCHULRANZEN', m: 'school backpack' },  { w: 'SCHWIMMBAD', m: 'swimming pool' },  { w: 'SONNENBLUME', m: 'sunflower' },
    { w: 'SPORTPLATZ', m: 'sports field' }, { w: 'STRAßENBAHN', m: 'tram' },
    { w: 'UNTERNEHMEN', m: 'company' },  { w: 'VERKEHRSMITTEL', m: 'means of transport' },  { w: 'WASCHBECKEN', m: 'sink' },
    { w: 'ZIMMERPFLANZE', m: 'houseplant' },  { w: 'ZUGFAHRAUSWEIS', m: 'train ticket' },  
    { w: 'ABENTEUER', m: 'adventure' }, { w: 'ABTEILUNG', m: 'department' }, { w: 'ALLERGIE', m: 'allergy' }, { w: 'ALTSTADT', m: 'old town' },
{ w: 'ANGESTELLTE', m: 'employee' }, { w: 'ANSCHRIFT', m: 'address' }, { w: 'APOTHEKE', m: 'pharmacy' }, { w: 'ARBEITER', m: 'worker' },
{ w: 'ARBEITSPLATZ', m: 'workplace' }, { w: 'AUSBILDUNG', m: 'vocational training' }, { w: 'AUSSICHT', m: 'view' }, { w: 'AUSSPRACHE', m: 'pronunciation' },
{ w: 'AUSSTELLUNG', m: 'exhibition' }, { w: 'AUTOBAHN', m: 'highway' }, { w: 'BÄCKEREI', m: 'bakery' }, { w: 'BADEWANNE', m: 'bathtub' },
{ w: 'BAHNSTEIG', m: 'platform' }, { w: 'BAUCHSCHMERZ', m: 'stomach ache' }, { w: 'BAUMARKT', m: 'hardware store' }, { w: 'BEDIENUNG', m: 'service' },
{ w: 'BEHANDLUNG', m: 'treatment' }, { w: 'BEISPIEL', m: 'example' }, { w: 'BEKANNTSCHAFT', m: 'acquaintance' }, { w: 'BESCHREIBUNG', m: 'description' },
{ w: 'BESUCHER', m: 'visitor' }, { w: 'BETTWÄSCHE', m: 'bed linen' }, { w: 'BEWOHNER', m: 'resident' }, { w: 'BILDSCHIRM', m: 'screen' },
{ w: 'BILDERRAHMEN', m: 'picture frame' }, { w: 'BLUMENSTRAUß', m: 'bouquet' }, { w: 'BOTSCHAFT', m: 'message' }, { w: 'BRATWURST', m: 'fried sausage' },
{ w: 'BRIEFKASTEN', m: 'mailbox' }, { w: 'BRIEFMARKE', m: 'postage stamp' }, { w: 'BROMBEERE', m: 'blackberry' }, { w: 'BUCHSTABE', m: 'letter (of the alphabet)' },
{ w: 'BÜCHERREGAL', m: 'bookshelf' }, { w: 'BÜGELEISEN', m: 'clothes iron' }, { w: 'CHAMPIGNON', m: 'mushroom' }, { w: 'DAUERWELLE', m: 'perm (hairstyle)' },
{ w: 'DIENSTAG', m: 'Tuesday' }, { w: 'DISKUSSION', m: 'discussion' }, { w: 'DOKUMENT', m: 'document' }, { w: 'DOKUMENTATION', m: 'documentary' },
{ w: 'DOPPELBETT', m: 'double bed' }, { w: 'EICHÖRNCHEN', m: 'squirrel' }, { w: 'EINLADUNG', m: 'invitation' }, { w: 'EINRICHTUNG', m: 'furnishings' },
{ w: 'EINWOHNER', m: 'inhabitant' }, { w: 'ERDBEERE', m: 'strawberry' }, { w: 'ERFAHRUNG', m: 'experience' }, { w: 'ERGEBNIS', m: 'result' },
{ w: 'ERKÄLTUNG', m: 'cold (illness)' }, { w: 'ERKLÄRUNG', m: 'explanation' }, { w: 'ERLEBNIS', m: 'experience' }, { w: 'ERZIEHUNG', m: 'upbringing' },
{ w: 'FANTASIE', m: 'imagination' }, { w: 'FAHRRADWEG', m: 'cycle path' }, { w: 'FAHRSCHULE', m: 'driving school' }, { w: 'FAHRSCHEIN', m: 'ticket (transport)' },
{ w: 'FAHRSTUHL', m: 'elevator' }, { w: 'FAHRZEUG', m: 'vehicle' }, { w: 'FEIERABEND', m: 'evening after work' }, { w: 'FEIERTAG', m: 'public holiday' },
{ w: 'FENSTERBANK', m: 'windowsill' }, { w: 'FESTPLATTE', m: 'hard drive' }, { w: 'FEUERWEHR', m: 'fire department' }, { w: 'FLUGHAFEN', m: 'airport' },
{ w: 'FLUGZEUG', m: 'airplane' }, { w: 'FLÜSSIGKEIT', m: 'liquid' }, { w: 'FRAGEBOGEN', m: 'questionnaire' }, { w: 'FREIZEIT', m: 'free time' },
{ w: 'FREMDSPRACHE', m: 'foreign language' }, { w: 'FREUNDLICHKEIT', m: 'friendliness' }, { w: 'FRÜHSTÜCK', m: 'breakfast' }, { w: 'FUSSBALL', m: 'soccer' },
{ w: 'FUßBODEN', m: 'floor' }, { w: 'FUßGÄNGER', m: 'pedestrian' }, { w: 'FUßGÄNGERZONE', m: 'pedestrian zone' }, { w: 'GARTENHAUS', m: 'garden shed' },
{ w: 'GARTENMÖBEL', m: 'garden furniture' }, { w: 'GARTENTOR', m: 'garden gate' }, { w: 'GARTENZAUN', m: 'garden fence' }, { w: 'GASTFAMILIE', m: 'host family' },
{ w: 'GASTHAUS', m: 'inn' }, { w: 'GEGENSTAND', m: 'object' }, { w: 'GELDBEUTEL', m: 'wallet' },
{ w: 'GEMÜSEGARTEN', m: 'vegetable garden' }, { w: 'GENERATION', m: 'generation' }, { w: 'GESCHENK', m: 'gift' }, { w: 'GESELLSCHAFT', m: 'society' },
{ w: 'GESPRÄCH', m: 'conversation' }, { w: 'GETRÄNKEKARTE', m: 'drinks menu' }, { w: 'GEWISSEN', m: 'conscience' }, { w: 'GEWITTER', m: 'thunderstorm' },
{ w: 'GEWOHNHEIT', m: 'habit' }, { w: 'GLÜCKWUNSCH', m: 'congratulation' }, { w: 'GROßMUTTER', m: 'grandmother' }, { w: 'GROßVATER', m: 'grandfather' },
{ w: 'HALBINSEL', m: 'peninsula' }, { w: 'HALTESTELLE', m: 'bus stop' }, { w: 'HANDTUCH', m: 'towel' }, { w: 'HANDBALL', m: 'handball' },
{ w: 'HAUSAUFGABE', m: 'homework' }, { w: 'HAUSTIER', m: 'pet' }, { w: 'HEIDELBEERE', m: 'blueberry' }, { w: 'HOFFNUNG', m: 'hope' },
{ w: 'HOCHHAUS', m: 'high-rise building' }, { w: 'HOCHZEIT', m: 'wedding' }, { w: 'HÖFLICHKEIT', m: 'politeness' }, { w: 'JAHRESZEIT', m: 'season' },
{ w: 'JAHRHUNDERT', m: 'century' }, { w: 'JUGENDHERBERGE', m: 'youth hostel' }, { w: 'JUGENDLICHE', m: 'teenager' }, { w: 'KARTOFFEL', m: 'potato' },
{ w: 'KAUFHAUS', m: 'department store' }, { w: 'KINDERHEIM', m: 'children\'s home' }, { w: 'KINDERWAGEN', m: 'stroller/pram' }, { w: 'KLASSENZIMMER', m: 'classroom' },
{ w: 'KLEIDERSCHRANK', m: 'wardrobe' }, { w: 'KLEIDUNG', m: 'clothing' }, { w: 'KOPFHÖRER', m: 'headphones' }, { w: 'KOPFSCHMERZ', m: 'headache' },
{ w: 'KRAWATTE', m: 'necktie' }, { w: 'KREUZUNG', m: 'intersection' }, { w: 'KROKODIL', m: 'crocodile' }, { w: 'KUGELSCHREIBER', m: 'ballpoint pen' },
{ w: 'KUNSTWERK', m: 'work of art' }, { w: 'LANDSCHAFT', m: 'landscape' }, { w: 'LANDSTRASSE', m: 'country road' }, { w: 'LAUTSPRECHER', m: 'loudspeaker' },
{ w: 'LEBENSLAUF', m: 'résumé/CV' }, { w: 'LEHRERIN', m: '(female) teacher' }, { w: 'LEUCHTTURM', m: 'lighthouse' }, { w: 'LIEBLINGSFACH', m: 'favorite subject' },
{ w: 'LIMONADE', m: 'lemonade' }, { w: 'LITERATUR', m: 'literature' }, { w: 'MATHEMATIK', m: 'mathematics' }, { w: 'MEDIKAMENT', m: 'medication' },
{ w: 'MINERALWASSER', m: 'mineral water' }, { w: 'MITARBEITER', m: 'colleague' }, { w: 'MITGLIED', m: 'member' }, { w: 'MITTEILUNG', m: 'notice' },
{ w: 'MITTAGESSEN', m: 'lunch' }, { w: 'MITTAGSPAUSE', m: 'lunch break' }, { w: 'MOTORRAD', m: 'motorcycle' }, { w: 'MUTTERSPRACHE', m: 'native language' },
{ w: 'NACHBARSCHAFT', m: 'neighborhood' }, { w: 'NACHMITTAG', m: 'afternoon' }, { w: 'NACHRICHT', m: 'message' }, { w: 'PAPIERKORB', m: 'wastepaper basket' },
{ w: 'PASSAGIER', m: 'passenger' }, { w: 'PASSWORT', m: 'password' }, { w: 'PFIRSICH', m: 'peach' }, { w: 'POSTLEITZAHL', m: 'postal code' },
{ w: 'RECHNUNG', m: 'bill/invoice' }, { w: 'REGENSCHIRM', m: 'umbrella' }, { w: 'REGIERUNG', m: 'government' }, { w: 'REISEPASS', m: 'passport' },
{ w: 'REISEZIEL', m: 'travel destination' }, { w: 'RESTAURANT', m: 'restaurant' }, { w: 'RICHTUNG', m: 'direction' }, { w: 'ROLLTREPPE', m: 'escalator' },
{ w: 'RÜCKENSCHMERZ', m: 'back pain' }, { w: 'SACHBUCH', m: 'non-fiction book' }, { w: 'SCHAUSPIELER', m: 'actor' }, { w: 'SCHAUFENSTER', m: 'display window' },
{ w: 'SCHLAFZIMMER', m: 'bedroom' }, { w: 'SCHLÜSSEL', m: 'key' }, { w: 'SCHMETTERLING', m: 'butterfly' }, { w: 'SCHOKOLADE', m: 'chocolate' },
{ w: 'SCHRIFTSTELLER', m: 'writer' }, { w: 'SCHULJAHR', m: 'school year' }, { w: 'SCHULKLASSE', m: 'school class' }, { w: 'SCHWESTER', m: 'nurse' },
{ w: 'SICHERHEIT', m: 'safety/security' }, { w: 'SONNENAUFGANG', m: 'sunrise' }, { w: 'SONNENBRILLE', m: 'sunglasses' }, { w: 'SONNENSCHEIN', m: 'sunshine' },
{ w: 'SPEISEKARTE', m: 'menu' }, { w: 'SPIELPLATZ', m: 'playground' }, { w: 'SPIELZEUG', m: 'toys' }, { w: 'SPRACHKURS', m: 'language course' },
{ w: 'STADTPLAN', m: 'city map' }, { w: 'STAUBSAUGER', m: 'vacuum cleaner' }, { w: 'STECKDOSE', m: 'power socket' }, { w: 'SUPERMARKT', m: 'supermarket' },
{ w: 'TANKSTELLE', m: 'gas station' }, { w: 'TASCHENLAMPE', m: 'flashlight' }, { w: 'TASCHENTUCH', m: 'handkerchief' }, { w: 'TEMPERATUR', m: 'temperature' },
{ w: 'TISCHLAMPE', m: 'table lamp' }, { w: 'TOILETTE', m: 'toilet' }, { w: 'TÜRKLINKE', m: 'door handle' }, { w: 'ÜBERSETZUNG', m: 'translation' },
{ w: 'UMWELTSCHUTZ', m: 'environmental protection' }, { w: 'UNIVERSITÄT', m: 'university' }, { w: 'UNTERHALTUNG', m: 'entertainment' }, { w: 'UNTERKUNFT', m: 'accommodation' },
{ w: 'VERABREDUNG', m: 'appointment' }, { w: 'VERANTWORTUNG', m: 'responsibility' }, { w: 'VERBINDUNG', m: 'connection' }, { w: 'VERGANGENHEIT', m: 'the past' },
{ w: 'VERSICHERUNG', m: 'insurance' }, { w: 'VERSPÄTUNG', m: 'delay' }, { w: 'VERSTÄNDNIS', m: 'understanding' }, { w: 'VERWANDTE', m: 'relatives' },
{ w: 'VOLLEYBALL', m: 'volleyball' }, { w: 'VORLESUNG', m: 'lecture' }, { w: 'VORSTADT', m: 'suburb' }, { w: 'WAHRHEIT', m: 'truth' },
{ w: 'WANDERUNG', m: 'hike' }, { w: 'WÄSCHEREI', m: 'laundry' }, { w: 'WASSERFALL', m: 'waterfall' }, { w: 'WASSERKOCHER', m: 'kettle' },
{ w: 'WASSERMELONE', m: 'watermelon' }, { w: 'WEIHNACHTEN', m: 'Christmas' }, { w: 'WEINBERG', m: 'vineyard' }, { w: 'WERKSTATT', m: 'workshop' },
{ w: 'WETTERBERICHT', m: 'weather report' }, { w: 'WISSENSCHAFT', m: 'science' }, { w: 'WOCHENENDE', m: 'weekend' }, { w: 'WOCHENTAG', m: 'day of the week' },
{ w: 'WOHNHEIM', m: 'dormitory' }, { w: 'WOLKENKRATZER', m: 'skyscraper' }, { w: 'WORTSCHATZ', m: 'vocabulary' }, { w: 'ZAHNARZT', m: 'dentist' },
{ w: 'ZAHNPASTA', m: 'toothpaste' }, { w: 'ZAUBERER', m: 'magician' }, { w: 'ZEICHNUNG', m: 'drawing' }, { w: 'ZEITSCHRIFT', m: 'magazine' },
{ w: 'ZUSCHAUER', m: 'spectator' }, { w: 'ZWILLING', m: 'twin' }
  ],
  13: [ // Added longer words
    { w: 'WORTMEISTER', m: 'word master' },
    { w: 'GESCHWINDIGKEIT', m: 'speed' },
    { w: 'VERANTWORTUNG', m: 'responsibility' },
    { w: 'ZUSAMMENARBEIT', m: 'collaboration' },
    { w: 'WELTMEISTERSCHAFT', m: 'world championship' }
  ]
};
// TRIES maps each word length to the number of WRONG guesses the player is
// allowed before losing the round (e.g., a 6-letter word allows 3 misses).
const TRIES = { 5:3, 6:4, 7:4, 8:4, 13:4 };

// ROWS defines the on-screen keyboard layout, top row to bottom row.
// It follows the German QWERTZ layout and includes the umlaut keys Ä Ö Ü.
//const ROWS = ['QWERTZUIOPÄÖÜß', 'ASDFGHJKL', 'YXCVBNM'];
const ROWS = ['QWERTZUIOPÄÖÜ\u00DF', 'ASDFGHJKL', 'YXCVBNM'];

/* ---------- DOM elements ---------- */
// $ is a shorthand helper: document.querySelector('#id') becomes $('#id').
const $ = (s) => document.querySelector(s);

// els caches references to all HTML elements the game manipulates,
// so we don't have to search the DOM over and over again.
const els = {
  start: $('#screen-start'),    // the start/menu screen
  game: $('#screen-game'),      // the main game screen
  tiles: $('#tiles'),           // container holding the letter tiles
  //tilesWrap: $('#tilesWrap'),   // wrapper around the tiles (layout)
  message: $('#message'),       // status/instruction text line
  stamp: $('#stamp'),           // decorative "stamp" overlay element
  dots: $('#dots'),             // row of dots showing remaining wrong guesses
  lenBadge: $('#lenBadge'),     // badge showing the chosen word length
  keyboard: $('#keyboard'),     // on-screen keyboard container
  result: $('#resultPanel'),    // end-of-round result panel
  //resultWord: $('#resultWord'), // headline inside the result panel
  //resultSub: $('#resultSub'),   // sub-line (score) inside the result panel
  scoreChip: $('#scoreChip'),   // small chip displaying the current score
  soundBtn: $('#soundBtn'),     // sound on/off toggle button
  below: $('#below'),           // area below the board (buttons etc.)
  stage: $('#stage')            // board/stage area used for width measuring
};

// state holds everything that changes while playing a round.
const state = {
  len: 6,            // currently selected word length
  word: '',          // the secret word for this round
  meaning: '',       // English translation of the secret word
  revealed: [],      // one slot per letter: null = hidden, letter = revealed
  triesLeft: 0,      // wrong guesses remaining this round
  maxTries: 0,       // total wrong guesses allowed this round
  used: new Set(),   // letters already guessed (prevents duplicate guesses)
  active: false,     // true while a round is in progress and guesses count
  lastWord: ''       // the previous word, so we avoid picking it twice in a row
};

// Scores are persisted in the browser's localStorage so they survive page
// reloads. The "+(...)" converts the stored string into a number; if nothing
// is stored (null), the expression falls back to 0.
let score = +(localStorage.getItem('wm_score') || 0);          // current win streak
let bestScore = +(localStorage.getItem('wm_best_score') || 0); // best streak ever
let resizeTimeout; // used to debounce window-resize handling (see handleResize)

/* ---------- Sound engine ---------- */
// Sound is a small self-contained audio module built on the Web Audio API.
// It is wrapped in an IIFE (Immediately Invoked Function Expression): the
// function runs once, and only the returned object (the public API at the
// bottom) is exposed — internal variables like ctx and muted stay private.
const Sound = (() => {
  let ctx = null;                                       // the AudioContext, created lazily
  let muted = localStorage.getItem('wm_muted') === '1'; // mute preference, persisted

  // ac() returns the shared AudioContext, creating it on first use.
  // Browsers block audio until the user interacts with the page, so the
  // context is also "resumed" here if the browser suspended it.
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // env() shapes a note's volume over time (a volume "envelope"):
  // start at 0 → quickly ramp up to `peak` (attack) → decay exponentially to
  // near-silence. This avoids harsh clicks at the start/end of each sound.
  function env(g, t, a = 0.005, d = 0.15, peak = 0.2) {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  // tone() plays one synthesized note.
  //   freq  = pitch in Hz
  //   type  = oscillator waveform (sine, square, triangle, sawtooth…)
  //   dur   = duration in seconds
  //   peak  = volume
  //   slide = optional end frequency (creates a pitch-bend effect)
  //   when  = optional delay in seconds before the note starts
  function tone(freq, { type = 'sine', dur = 0.15, peak = 0.18, slide = null, when = 0 } = {}) {
    if (muted) return;              // do nothing when sound is muted
    const c = ac();
    const t = c.currentTime + when;
    const o = c.createOscillator(); // the sound source (a wave)
    const g = c.createGain();       // node that controls the volume
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur); // pitch slide
    env(g, t, 0.005, dur, peak);
    o.connect(g).connect(c.destination); // oscillator → volume → speakers
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // noise() generates a short burst of white noise (random audio samples) —
  // used for percussive effects like the "stamp" thump. A lowpass filter
  // removes high frequencies so it sounds deep and muffled, not hissy.
  function noise(dur = 0.08, peak = 0.12, when = 0) {
    if (muted) return;
    const c = ac();
    const t = c.currentTime + when;
    // create an audio buffer filled with random values (white noise)
    const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); // fades out linearly
    const s = c.createBufferSource();
    s.buffer = b;
    const g = c.createGain();
    g.gain.value = peak;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900; // cut everything above 900 Hz for a softer sound
    s.connect(f).connect(g).connect(c.destination);
    s.start(t);
  }

  // Public API of the Sound module — the named sound effects used by the game:
  return {
    get muted() { return muted; },   // read-only access to the mute state
    toggle() {                       // flip mute on/off and remember the choice
      muted = !muted;
      localStorage.setItem('wm_muted', muted ? '1' : '0');
      return muted;
    },
    tick() { tone(720, { type: 'square', dur: 0.04, peak: 0.05 }); },  // short key-click
    stamp() { noise(0.09, 0.22); tone(150, { type: 'sine', dur: 0.12, peak: 0.25, slide: 70 }); }, // letter-reveal thump
    error() {                        // descending "wrong guess" buzz
      tone(190, { type: 'sawtooth', dur: 0.22, peak: 0.14, slide: 90 });
      tone(95, { type: 'sawtooth', dur: 0.28, peak: 0.12, slide: 55, when: 0.02 });
    },
    win() {                          // rising victory arpeggio (C–E–G–C)
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(f, { type: 'triangle', dur: 0.16, peak: 0.14, when: i * 0.09 })
      );
      noise(0.06, 0.1);
    },
    lose() {                         // sad descending tones
      tone(220, { type: 'triangle', dur: 0.25, peak: 0.14, slide: 160 });
      tone(160, { type: 'triangle', dur: 0.4, peak: 0.12, slide: 110, when: 0.18 });
    },
    thud() { noise(0.12, 0.3); tone(90, { type: 'sine', dur: 0.18, peak: 0.3, slide: 45 }); }
  };
})();

/* ---------- Keyboard ---------- */
// keyEls stores a reference to each on-screen key button, keyed by its letter
// (e.g., keyEls['A']), so the game can highlight/disable keys later.
const keyEls = {};

// buildKeyboard() creates the on-screen keyboard buttons from the ROWS layout.
function buildKeyboard() {
  els.keyboard.innerHTML = ''; // clear any existing keys first
  ROWS.forEach((row, r) => {
    const div = document.createElement('div');
    div.className = 'kb-row';  // one visual row of keys
    [...row].forEach(L => {    // [...row] splits the string into single letters
      const b = document.createElement('button');
      b.className = 'key';
      b.textContent = L;
      b.dataset.key = L;       // store the letter on the element (data-key="L")

      // 🔍 DEBUG: Log what's actually being created
      console.log('Creating key:', L, 'Code:', L.charCodeAt(0).toString(16));
      
      b.addEventListener('click', () => {
        Sound.tick();          // click feedback...
        guess(L);              // ...then process the guess
      });
      keyEls[L] = b;           // remember this button for later updates
      div.appendChild(b);
    });
    els.keyboard.appendChild(div);
  });
}

/* ---------- Game logic ---------- */

// startRound(len) begins a new round using words of the given length.
function startRound(len) {
  state.len = len;
  let pool = []; // the list of candidate words to pick from

  if (len === 8) {
    // Combine all words with 8 or more letters
    Object.keys(WORDS).forEach(key => {
      if (parseInt(key) >= 8) {
        pool.push(...WORDS[key]);
      }
    });
    // Sort by length to get a variety of word lengths
    // (with a random comparator this actually SHUFFLES the pool randomly)
    pool.sort(() => Math.random() - 0.5);
  } else {
    pool = WORDS[len];
  }

  // Select a word, avoiding repeats
  let entry;
  do {
    entry = pool[Math.floor(Math.random() * pool.length)];
  } while (pool.length > 1 && entry.w === state.lastWord);

  state.lastWord = entry.w;                          // remember for the next round
  state.word = entry.w;                              // the secret word
  state.meaning = entry.m;                           // its translation
  state.maxTries = TRIES[len] || 3;                  // allowed misses (fallback: 3)
  state.triesLeft = state.maxTries;
  state.revealed = Array(entry.w.length).fill(null); // all letters start hidden
  state.used = new Set();                            // no letters guessed yet
  state.active = true;                               // round is now playable

  // Update badge text
  els.lenBadge.textContent = len === 8 ? '8 LETTERS+' : `${len} LETTERS`;

  renderTries();  // draw the miss-dots
  renderTiles();  // draw the blank letter tiles
  Object.values(keyEls).forEach(k => {
    k.disabled = false;                 // re-enable every key...
    k.classList.remove('hit', 'miss');  // ...and clear the previous round's colors
  });

  els.stamp.hidden = true;   // hide leftover decorations
  els.stamp.className = 'stamp';
  els.result.hidden = true;  // hide the result panel

  setMessage(`Pick letters — you can miss ${state.maxTries} time${state.maxTries > 1 ? 's' : ''}.`, '');
  showScreen('game');

  // Delay fitTiles to ensure DOM is ready
  setTimeout(() => {
    fitTiles(); // size the tiles once the new tiles are actually in the DOM
    window.addEventListener('resize', handleResize); // keep tiles sized on resize
  }, 50);
}

// renderTiles() builds one blank tile per letter of the secret word.
function renderTiles() {
  els.tiles.innerHTML = ''; // remove old tiles
  const wordLength = state.word.length;

  // Add long-word class for words with 10+ letters
  if (wordLength >= 10) {
    els.tiles.classList.add('long-word'); // CSS makes long words more compact
  } else {
    els.tiles.classList.remove('long-word');
  }

  [...state.word].forEach((ch, i) => {
    const t = document.createElement('div');
    t.className = 'tile';
    t.style.setProperty('--i', i); // CSS variable used for staggered animations
    const s = document.createElement('span');
    s.className = 'letter';        // this span will hold the revealed letter
    t.appendChild(s);
    els.tiles.appendChild(t);
  });

  // Force recalculation after rendering
  requestAnimationFrame(() => fitTiles()); // size tiles on the next animation frame
}

// fitTiles() responsively calculates the tile size so the whole word fits
// within the visible width of the stage, then applies it via CSS variables.
function fitTiles() {
  if (!state.word) return; // nothing to size before a round starts

  const n = state.word.length;       // number of letters/tiles
  const stageWidth = els.stage.clientWidth;

  // Calculate available width considering padding
  const avail = stageWidth - 16;

  // Dynamic gap based on word length — longer words get tighter spacing
  const gap = n > 12 ? 2 : n > 10 ? 3 : n > 8 ? 4 : Math.min(8, Math.max(4, 8 - (n * 0.5)));

  // Calculate ideal tile size: divide the available width evenly among tiles
  const idealSize = Math.floor((avail - (n - 1) * gap) / n);

  // Dynamic min/max sizes based on word length (longer words → smaller tiles)
  const minSize = n > 12 ? 16 : n > 10 ? 18 : n > 8 ? 20 : 24;
  const maxSize = n > 12 ? 28 : n > 10 ? 32 : n > 8 ? 36 : 40;

  // Clamp the ideal size between the min and max bounds
  const size = Math.max(minSize, Math.min(maxSize, idealSize));

  // Apply the calculated size
  els.tiles.style.setProperty('--tile', `${size}px`); // consumed by the CSS
  els.tiles.style.gap = `${gap}px`;

  // Adjust font size for very small tiles
  if (size < 20) {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.6'); // smallest tiles → biggest font ratio
  } else if (size < 25) {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.55');
  } else {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.5'); // normal tiles
  }
}

// handleResize() recalculates tile sizes when the browser window is resized,
// but "debounced": it waits 100ms after the LAST resize event before running,
// so dragging the window doesn't trigger dozens of recalculations.
function handleResize() {
  clearTimeout(resizeTimeout); // cancel any pending recalculation
  resizeTimeout = setTimeout(() => {
    if (els.game.classList.contains('active')) {
      fitTiles(); // only recalculate if the game screen is visible
    }
  }, 100);
}

// revealLetter(L) uncovers every occurrence of letter L in the word,
// animates the tiles, updates the keyboard, and returns the number of hits.
function revealLetter(L) {
  const hits = [];
  [...state.word].forEach((ch, i) => {
    if (ch === L) hits.push(i); // collect all positions where L appears
  });
  const key = keyEls[L];
  key.classList.add('hit');   // mark the key green (via CSS)
  key.disabled = true;        // this letter can't be guessed again
  hits.forEach((i, k) => {
    const tile = els.tiles.children[i];
    // random slight tilt between -2.5° and +2.5° for a natural "stamped" look
    tile.style.setProperty('--tilt', (Math.random() * 5 - 2.5).toFixed(2) + 'deg');
    tile.style.animationDelay = (k * 110) + 'ms'; // stagger multiple reveals
    tile.classList.add('revealed');               // triggers the reveal animation
    tile.firstElementChild.textContent = L;       // show the letter on the tile
    state.revealed[i] = L;                        // record it in the game state
  });
  Sound.stamp();
  return hits.length;
}

// guess(L) is the heart of the game: it handles one letter guess from
// start to finish (correct reveal OR wrong-guess penalty).
function guess(L) {
  // ignore the guess if the round is over or the letter was already tried
  if (!state.active || state.used.has(L)) return;
  state.used.add(L);
  const hits = [];
  [...state.word].forEach((ch, i) => {
    if (ch === L) hits.push(i); // find all matching positions
  });

  if (hits.length) {
    // --- Correct guess ---
    revealLetter(L);
    const n = hits.length;
    setMessage(n > 1 ? `“${L}” is in the word — ${n}×!` : `“${L}” is in the word!`, 'good');
    if (state.revealed.every(Boolean)) endRound(true); // every letter revealed → win!
  } else {
    // --- Wrong guess ---
    const key = keyEls[L];
    key.classList.add('miss');  // mark the key red (via CSS)
    key.disabled = true;
    state.triesLeft--;          // use up one try
    renderTries();              // update the dots display
    shake();                    // shake the tile row for feedback
    Sound.error();
    const left = state.triesLeft;
    setMessage(left > 0 ? `No “${L}” here — ${left} tr${left === 1 ? 'y' : 'ies'} left.` : `No “${L}” here — that was your last try.`, 'bad');
    if (left <= 0) endRound(false); // out of tries → lose
  }
}

// shake() plays the CSS "shake" animation on the tile row (wrong-guess feedback).
function shake() {
  const t = els.tiles;
  t.classList.remove('shake');
  void t.offsetWidth;  // force a browser reflow so the animation can restart
  t.classList.add('shake');
  t.addEventListener('animationend', () => t.classList.remove('shake'), { once: true });
}

// renderTries() redraws the row of dots showing how many wrong guesses remain.
function renderTries() {
  els.dots.innerHTML = '';
  for (let i = 0; i < state.maxTries; i++) {
    const d = document.createElement('span');
    // dots at/after triesLeft have been "used" (spent misses)
    d.className = 'dot' + (i >= state.triesLeft ? ' used' : '');
    if (i === state.triesLeft) d.classList.add('just'); // highlight the dot just lost
    els.dots.appendChild(d);
  }
}

// setMessage(text, kind) updates the status line. kind is '', 'good' or 'bad'
// and controls the message color. The 'pop' animation restarts each time.
function setMessage(text, kind) {
  els.message.textContent = text;
  els.message.className = 'message' + (kind ? ' ' + kind : '');
  els.message.classList.remove('pop');
  void els.message.offsetWidth;      // reflow trick to restart the animation
  els.message.classList.add('pop');
}

// endRound(win) finishes the round: updates the score, plays sounds and
// animations, reveals the answer, and shows the result panel.
function endRound(win) {
  state.active = false;                                  // stop accepting guesses
  Object.values(keyEls).forEach(k => k.disabled = true); // lock the keyboard

  if (win) {
    score++;                                             // extend the win streak
    if (score > bestScore) {
      bestScore = score;                                 // new personal best
      localStorage.setItem('wm_best_score', bestScore);
    }
    localStorage.setItem('wm_score', score);             // persist the streak
    updateScoreChip();
    bounceTiles();  // celebratory tile animation
    Sound.win();
    setMessage(`Correct! The word means: "${state.meaning}"`, 'good');
    setTimeout(showResult, 1000);                        // show result panel after 1s
  } else {
    score = 0;                                           // losing resets the streak
    localStorage.setItem('wm_score', 0);
    updateScoreChip();
    // Reveal the missed letters one by one so the player sees the full answer
    [...state.word].forEach((ch,i)=>{
      if (!state.revealed[i]){
        const tile = els.tiles.children[i];
        tile.style.setProperty('--tilt','0deg');
        // staggered reveal: starts after 250ms, 70ms apart per letter
        setTimeout(()=>{ tile.classList.add('miss'); tile.firstElementChild.textContent = ch; }, 250 + i*70);
      }
    });
    setTimeout(()=>{ setMessage(`Game over! The word was "${state.word}" and means: "${state.meaning}"`, 'bad'); }, 650);
    setTimeout(()=>{ Sound.lose(); }, 650);
    setTimeout(showResult, 1500);                        // show result panel after 1.5s
  }
}

// bounceTiles() makes every tile bounce, staggered left-to-right (win animation).
function bounceTiles() {
  [...els.tiles.children].forEach((t, i) => {
    t.style.animationDelay = '0ms';
    setTimeout(() => { t.classList.add('bounce'); }, i * 70); // 70ms apart
  });
}

// showResult() displays the end-of-round panel with the outcome and score.
//function showResult() {
//  els.resultWord.innerHTML = state.revealed.every(Boolean)
//    ? `<strong>Correct!</strong>`  // all letters were revealed → win
//    : `Game over`;                 // ran out of tries → loss
//  els.resultSub.textContent = `Score: ${score}`;
//  els.result.hidden = false;
//}

function showResult() {
  const resultWord = els.result.querySelector('.result-word');   // ✅ Query from existing element
  const resultSub = els.result.querySelector('.result-sub');     // ✅ Query from existing element
  
  if (resultWord) {
    resultWord.innerHTML = state.revealed.every(Boolean)
      ? `<strong>Correct!</strong>`
      : `Game over`;
  }
  
  if (resultSub) {
    resultSub.textContent = `Score: ${score}`;
  }
  
  els.result.hidden = false;
}

// updateScoreChip() refreshes the small score display (e.g., "SCORE 4").
function updateScoreChip() {
  els.scoreChip.innerHTML = `SCORE <b>${score}</b>`;
}

// showScreen(name) switches between the 'start' menu and the 'game' screen
// by toggling the CSS 'active' class on each screen element.
function showScreen(name) {
  els.start.classList.toggle('active', name === 'start');
  els.game.classList.toggle('active', name === 'game');

  if (name === 'start') {
    window.removeEventListener('resize', handleResize); // not needed on the menu
  }
}

/* ---------- Event listeners ---------- */

// Everything below runs once the HTML has finished loading, so all elements
// referenced here are guaranteed to exist in the page.
document.addEventListener('DOMContentLoaded', function() {
  buildKeyboard();    // create the on-screen keyboard
  updateScoreChip();  // show the saved score
  renderSoundIcon();  // show the correct speaker icon
  fitTiles();         // initial tile sizing

  const nextBtn = $('#nextBtn');     // "next word" button (same length)
  const backBtn = $('#backBtn');     // "back to menu" button
  const randomBtn = $('#randomBtn'); // "random length" button
  const soundBtn = $('#soundBtn');   // mute toggle button

  if (nextBtn) nextBtn.addEventListener('click', () => startRound(state.len));
  if (backBtn) backBtn.addEventListener('click', () => showScreen('start'));
  if (randomBtn) randomBtn.addEventListener('click', () => {
    const lens = [5, 6, 7, 8, 13];
    startRound(lens[Math.floor(Math.random() * lens.length)]); // pick a random length
  });
  if (soundBtn) soundBtn.addEventListener('click', () => {
    Sound.toggle();       // flip mute state (also saved to localStorage)
    renderSoundIcon();    // update the speaker icon
    if (!Sound.muted) Sound.tick(); // confirmation click when unmuting
  });

  // The word-length option buttons on the start screen (data-len="5" etc.)
  document.querySelectorAll('.opt').forEach(o => {
    o.addEventListener('click', () => startRound(+o.dataset.len)); // "+" converts string to number
  });
});

// renderSoundIcon() shows the speaker-on or speaker-off icon depending on
// whether sound is currently muted.
function renderSoundIcon() {
  const iconSoundOn = $('#iconSoundOn');
  const iconSoundOff = $('#iconSoundOff');
  if (iconSoundOn && iconSoundOff) {
    iconSoundOn.style.display = Sound.muted ? 'none' : 'block';
    iconSoundOff.style.display = Sound.muted ? 'block' : 'none';
  }
}

// Keyboard event listener — lets the player use a physical keyboard
// instead of clicking the on-screen keys.
document.addEventListener('keydown', (e) => {
  if (els.game.classList.contains('active')) {
    // On the game screen:
    if (e.key === 'Enter' && !state.active && !els.result.hidden) {
      startRound(state.len); // Enter starts the next round after a round ends
      return;
    }
    const k = e.key.toUpperCase();
    // Accept single letters A–Z plus German umlauts Ä Ö Ü, but ignore
    // combos with Meta/Ctrl/Alt (so browser shortcuts like Ctrl+C still work)
    //if (/^[A-ZÄÖÜ]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
    //if (/^[A-ZÄÖÜß]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
    if (/^[A-ZÄÖÜ\u00DF]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (keyEls[k]) {   // only letters that exist on our virtual keyboard
        Sound.tick();
        guess(k);
      }
    }
  } else {
    // On the start screen: pressing 5/6/7/8 quickly starts that word length
    if (/^[5678]$/.test(e.key)) startRound(+e.key);
  }
});
