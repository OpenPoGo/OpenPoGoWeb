var i;
var map;
var openFlag1 = false;
var openFlag2 = false;
var openFlag3 = false;
var openFlag4 = false;
var out1;
var out;
var user_index;

var emptyDex = [];
var forts = [];
var info_windows = [];
var outArray = [];
var numTrainers = [
  177, 
  109
];
var teams = [
  'TeamLess',
  'Mystic',
  'Valor',
  'Instinct'
];
var trainerSex = [
  'm',
  'f'
];

var bagCandy = {};
var bagItems = {};
var bagPokemon = {};
var inventory = {};
var playerInfo = {};
var pokedex = {};
var pokemonArray = {};
var stats = {};
var user_data = {};
var itemsArray = {
  '0': 'Unknown',
  '1': 'Pokeball',
  '2': 'Greatball',
  '3': 'Ultraball',
  '4': 'Masterball',
  '101': 'Potion',
  '102': 'Super Potion',
  '103': 'Hyper Potion',
  '104': 'Max Potion',
  '201': 'Revive',
  '202': 'Max Revive',
  '301': 'Lucky Egg',
  '401': 'Incense',
  '402': 'Spicy Incense',
  '403': 'Cool Incense',
  '404': 'Floral Incense',
  '501': 'Troy Disk',
  '602': 'X Attack',
  '603': 'X Defense',
  '604': 'X Miracle',
  '701': 'Razz Berry',
  '702': 'Bluk Berry',
  '703': 'Nanab Berry',
  '704': 'Wepar Berry',
  '705': 'Pinap Berry',
  '801': 'Special Camera',
  '901': 'Incubator (Unlimited)',
  '902': 'Incubator',
  '1001': 'Pokemon Storage Upgrade',
  '1002': 'Item Storage Upgrade'
};

var POKEMON_IDS = {
  MISSINGNO: 0,
  BULBASAUR: 1,
  IVYSAUR: 2,
  VENUSAUR: 3,
  CHARMENDER: 4,
  CHARMELEON: 5,
  CHARIZARD: 6,
  SQUIRTLE: 7,
  WARTORTLE: 8,
  BLASTOISE: 9,
  CATERPIE: 10,
  METAPOD: 11,
  BUTTERFREE: 12,
  WEEDLE: 13,
  KAKUNA: 14,
  BEEDRILL: 15,
  PIDGEY: 16,
  PIDGEOTTO: 17,
  PIDGEOT: 18,
  RATTATA: 19,
  RATICATE: 20,
  SPEAROW: 21,
  FEAROW: 22,
  EKANS: 23,
  ARBOK: 24,
  PIKACHU: 25,
  RAICHU: 26,
  SANDSHREW: 27,
  SANDLASH: 28,
  NIDORAN_FEMALE: 29,
  NIDORINA: 30,
  NIDOQUEEN: 31,
  NIDORAN_MALE: 32,
  NIDORINO: 33,
  NIDOKING: 34,
  CLEFARY: 35,
  CLEFABLE: 36,
  VULPIX: 37,
  NINETALES: 38,
  JIGGLYPUFF: 39,
  WIGGLYTUFF: 40,
  ZUBAT: 41,
  GOLBAT: 42,
  ODDISH: 43,
  GLOOM: 44,
  VILEPLUME: 45,
  PARAS: 46,
  PARASECT: 47,
  VENONAT: 48,
  VENOMOTH: 49,
  DIGLETT: 50,
  DUGTRIO: 51,
  MEOWTH: 52,
  PERSIAN: 53,
  PSYDUCK: 54,
  GOLDUCK: 55,
  MANKEY: 56,
  PRIMEAPE: 57,
  GROWLITHE: 58,
  ARCANINE: 59,
  POLIWAG: 60,
  POLIWHIRL: 61,
  POLIWRATH: 62,
  ABRA: 63,
  KADABRA: 64,
  ALAKHAZAM: 65,
  MACHOP: 66,
  MACHOKE: 67,
  MACHAMP: 68,
  BELLSPROUT: 69,
  WEEPINBELL: 70,
  VICTREEBELL: 71,
  TENTACOOL: 72,
  TENTACRUEL: 73,
  GEODUDE: 74,
  GRAVELER: 75,
  GOLEM: 76,
  PONYTA: 77,
  RAPIDASH: 78,
  SLOWPOKE: 79,
  SLOWBRO: 80,
  MAGNEMITE: 81,
  MAGNETON: 82,
  FARFETCHD: 83,
  DODUO: 84,
  DODRIO: 85,
  SEEL: 86,
  DEWGONG: 87,
  GRIMER: 88,
  MUK: 89,
  SHELLDER: 90,
  CLOYSTER: 91,
  GASTLY: 92,
  HAUNTER: 93,
  GENGAR: 94,
  ONIX: 95,
  DROWZEE: 96,
  HYPNO: 97,
  KRABBY: 98,
  KINGLER: 99,
  VOLTORB: 100,
  ELECTRODE: 101,
  EXEGGCUTE: 102,
  EXEGGUTOR: 103,
  CUBONE: 104,
  MAROWAK: 105,
  HITMONLEE: 106,
  HITMONCHAN: 107,
  LICKITUNG: 108,
  KOFFING: 109,
  WEEZING: 110,
  RHYHORN: 111,
  RHYDON: 112,
  CHANSEY: 113,
  TANGELA: 114,
  KANGASKHAN: 115,
  HORSEA: 116,
  SEADRA: 117,
  GOLDEEN: 118,
  SEAKING: 119,
  STARYU: 120,
  STARMIE: 121,
  MR_MIME: 122,
  SCYTHER: 123,
  JYNX: 124,
  ELECTABUZZ: 125,
  MAGMAR: 126,
  PINSIR: 127,
  TAUROS: 128,
  MAGIKARP: 129,
  GYARADOS: 130,
  LAPRAS: 131,
  DITTO: 132,
  EEVEE: 133,
  VAPOREON: 134,
  JOLTEON: 135,
  FLAREON: 136,
  PORYGON: 137,
  OMANYTE: 138,
  OMASTAR: 139,
  KABUTO: 140,
  KABUTOPS: 141,
  AERODACTYL: 142,
  SNORLAX: 143,
  ARTICUNO: 144,
  ZAPDOS: 145,
  MOLTRES: 146,
  DRATINI: 147,
  DRAGONAIR: 148,
  DRAGONITE: 149,
  MEWTWO: 150,
  MEW: 151
}

var POKEMON_FAMILIES = {
  FAMILY_UNSET: 0,
  FAMILY_BULBASAUR: 1,
  FAMILY_CHARMANDER: 4,
  FAMILY_SQUIRTLE: 7,
  FAMILY_CATERPIE: 10,
  FAMILY_WEEDLE: 13,
  FAMILY_PIDGEY: 16,
  FAMILY_RATTATA: 19,
  FAMILY_SPEAROW: 21,
  FAMILY_EKANS: 23,
  FAMILY_PIKACHU: 25,
  FAMILY_SANDSHREW: 27,
  FAMILY_NIDORAN_FEMALE: 29,
  FAMILY_NIDORAN_MALE: 32,
  FAMILY_CLEFAIRY: 35,
  FAMILY_VULPIX: 37,
  FAMILY_JIGGLYPUFF: 39,
  FAMILY_ZUBAT: 41,
  FAMILY_ODDISH: 43,
  FAMILY_PARAS: 46,
  FAMILY_VENONAT: 48,
  FAMILY_DIGLETT: 50,
  FAMILY_MEOWTH: 52,
  FAMILY_PSYDUCK: 54,
  FAMILY_MANKEY: 56,
  FAMILY_GROWLITHE: 58,
  FAMILY_POLIWAG: 60,
  FAMILY_ABRA: 63,
  FAMILY_MACHOP: 66,
  FAMILY_BELLSPROUT: 69,
  FAMILY_TENTACOOL: 72,
  FAMILY_GEODUDE: 74,
  FAMILY_PONYTA: 77,
  FAMILY_SLOWPOKE: 79,
  FAMILY_MAGNEMITE: 81,
  FAMILY_FARFETCHD: 83,
  FAMILY_DODUO: 84,
  FAMILY_SEEL: 86,
  FAMILY_GRIMER: 88,
  FAMILY_SHELLDER: 90,
  FAMILY_GASTLY: 92,
  FAMILY_ONIX: 95,
  FAMILY_DROWZEE: 96,
  FAMILY_KRABBY: 98,
  FAMILY_VOLTORB: 100,
  FAMILY_EXEGGCUTE: 102,
  FAMILY_CUBONE: 104,
  FAMILY_HITMONLEE: 106,
  FAMILY_HITMONCHAN: 107,
  FAMILY_LICKITUNG: 108,
  FAMILY_KOFFING: 109,
  FAMILY_RHYHORN: 111,
  FAMILY_CHANSEY: 113,
  FAMILY_TANGELA: 114,
  FAMILY_KANGASKHAN: 115,
  FAMILY_HORSEA: 116,
  FAMILY_GOLDEEN: 118,
  FAMILY_STARYU: 120,
  FAMILY_MR_MIME: 122,
  FAMILY_SCYTHER: 123,
  FAMILY_JYNX: 124,
  FAMILY_ELECTABUZZ: 125,
  FAMILY_MAGMAR: 126,
  FAMILY_PINSIR: 127,
  FAMILY_TAUROS: 128,
  FAMILY_MAGIKARP: 129,
  FAMILY_LAPRAS: 131,
  FAMILY_DITTO: 132,
  FAMILY_EEVEE: 133,
  FAMILY_PORYGON: 137,
  FAMILY_OMANYTE: 138,
  FAMILY_KABUTO: 140,
  FAMILY_AERODACTYL: 142,
  FAMILY_SNORLAX: 143,
  FAMILY_ARTICUNO: 144,
  FAMILY_ZAPDOS: 145,
  FAMILY_MOLTRES: 146,
  FAMILY_DRATINI: 147,
  FAMILY_MEWTWO: 150,
  FAMILY_MEW: 151
}

function findNameForPokemon(pokemon_id) {
  for (var name in POKEMON_IDS) {
    if (POKEMON_IDS[name] === pokemon_id) {
      return name;
    }
  }
  return null;
}

function findFamilyIdForPokemon(pokemon_id) {
  for (var i = 0; i < 4; i++) {
    var name = findNameForPokemon(pokemon_id - i);
    var family = 'FAMILY_' + name;
    if (family in POKEMON_FAMILIES) {
      return POKEMON_FAMILIES[family];
    }
  }
  return pokemon_id;
}

$(document).ready(function() {
  loadScript("https://maps.googleapis.com/maps/api/js?key=" + gMapsAPIKey + "&libraries=drawing&callback=initMap");
});

function loadScript(src) {
  var element = document.createElement("script");
  element.src = src;
  document.body.appendChild(element);
}

function initMap() {
  loadJSON('pokemondata.json', function(data, successData) {
    console.log('Loaded pokemon data..');
    pokemonArray = data;
  }, errorFunc, 'pokemonData');
  for (var i = 0; i < users.length; i++) {
    user_data[users[i]] = {};
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.0830986, lng: 6.7613762},
    zoom: 8
  });

  document.getElementById('switchPan').checked = userFollow;
  document.getElementById('switchZoom').checked = userZoom;
  document.getElementById('imageType').checked = (imageExt != '.png');
  placeTrainer();
  addCatchable();
  setInterval(updateTrainer, 1000);
  setInterval(addCatchable, 1000);
}

$('#switchPan').change(function(){
    if (this.checked) {
      userFollow = true;
    } else {
      userFollow = false;
    }
});

$('#switchZoom').change(function(){
    if (this.checked) {
      userZoom = true;
    } else {
      userZoom = false;
    }
});

$('#imageType').change(function(){
    if (this.checked) {
      imageExt = '.gif';
    } else {
      imageExt = '.png';
    }
});

$('#optionsButton').click(function(){
    $('#optionsList').toggle();
});

var errorFunc = function(xhr) {
  console.error(xhr);
};

var invSuccess = function(data, user_index) {
  user_data[users[user_index]].bagCandy = filter(data, 'pokemon_family');
  user_data[users[user_index]].bagItems = filter(data, 'item');
  user_data[users[user_index]].bagPokemon = filter(data, 'pokemon_data');
  user_data[users[user_index]].pokedex = filter(data, 'pokedex_entry');
  user_data[users[user_index]].stats = filter(data, 'player_stats');
};

var trainerFunc = function(data, user_index) {
  for (var i = 0; i < data.cells.length; i++) {
    cell = data.cells[i];
    if (data.cells[i].forts != undefined) {
      for (var x = 0; x < data.cells[i].forts.length; x++) {
        var fort = cell.forts[x];
        if (!forts[fort.id]) {
          if (fort.type === 1 ) {
            forts[fort.id] = new google.maps.Marker({
              map: map,
              position: {
                lat: parseFloat(fort.latitude),
                lng: parseFloat(fort.longitude)
              },
              icon: 'image/forts/img_pokestop.png'
            });
          } else {
            forts[fort.id] = new google.maps.Marker({
              map: map,
              position: {
                lat: parseFloat(fort.latitude),
                lng: parseFloat(fort.longitude)
              },
              icon: 'image/forts/' + teams[fort.owned_by_team] + '.png'
            });
          }
          fortPoints = '';
          fortTeam = '';
          fortType = 'PokeStop';
          pokemonGuard = '';
          if (fort.guard_pokemon_id != undefined) {
            fortPoints = 'Points: ' + fort.gym_points;
            fortTeam = 'Team: ' + teams[fort.owned_by_team] + '<br>';
            fortType = 'Gym';
            pokemonGuard = 'Guard Pokemon: ' + pokemonArray[fort.guard_pokemon_id-1].Name + '<br>';
          }
          var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
          info_windows[fort.id] = new google.maps.InfoWindow({
            content: contentString
          });
          google.maps.event.addListener(forts[fort.id], 'click', (function(marker, content, infowindow) {
            return function() {
              infowindow.setContent(content);
              infowindow.open(map, marker);
            };
          })(forts[fort.id], contentString, info_windows[fort.id]));
        }
      }
    }
  }
  if (user_data[users[user_index]].hasOwnProperty('marker') === false) {
    buildTrainerList();
    addInventory();
    Materialize.toast('New Marker: Trainer - ' + users[user_index], 3000);
    randomSex = Math.floor(Math.random() * 1);
    user_data[users[user_index]].marker = new google.maps.Marker({
      map: map,
      position: {lat: parseFloat(data.lat), lng: parseFloat(data.lng)},
      icon: 'image/trainer/' + trainerSex[randomSex] + Math.floor(Math.random() * numTrainers[randomSex]) + '.png',
      zIndex: 2,
      label: users[user_index]
    });
  } else {
    user_data[users[user_index]].marker.setPosition({lat: parseFloat(data.lat), lng: parseFloat(data.lng)});
  }
  if (users.length === 1 && userZoom === true) {
    map.setZoom(16);
  }
  if (users.length === 1 && userFollow === true) {
    map.panTo({
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng)
    });
  }
};

function placeTrainer() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('location-' + users[i] + '.json', trainerFunc, errorFunc, i);
  }
}
function updateTrainer() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('location-' + users[i] + '.json', trainerFunc, errorFunc, i);
  }
}

var catchSuccess = function(data, user_index) {
  if (data !== undefined && Object.keys(data).length > 0) {
    if (user_data[users[user_index]].catchables === undefined) {
      user_data[users[user_index]].catchables = {};
    }
    if (data.latitude !== undefined) {
      if (user_data[users[user_index]].catchables.hasOwnProperty(data.spawnpoint_id) === false) {
        poke_name = pokemonArray[data.pokemon_id-1].Name;
        Materialize.toast(poke_name + ' appeared near trainer: ' + users[user_index], 3000);
        user_data[users[user_index]].catchables[data.spawnpoint_id] = new google.maps.Marker({
          map: map,
          position: {lat: parseFloat(data.latitude), lng: parseFloat(data.longitude)},
          icon: 'image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + imageExt,
          zIndex: 4,
          optimized: false
        });
          if (userZoom === true) {
            map.setZoom(16);
          }
          if (userFollow === true) {
            map.panTo({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            });
          }
      } else {
        user_data[users[user_index]].catchables[data.spawnpoint_id].setPosition({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        });
        user_data[users[user_index]].catchables[data.spawnpoint_id].setIcon('image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + imageExt);
      }
    }
  } else {
    if (user_data[users[user_index]].catchables !== undefined && Object.keys(user_data[users[user_index]].catchables).length > 0) {
      Materialize.toast('The Pokemon has been caught or fled '  + users[user_index], 3000);
      for (var key in user_data[users[user_index]].catchables) {
        user_data[users[user_index]].catchables[key].setMap(null);
      }
      user_data[users[user_index]].catchables = undefined;
    }
  }
};

function addCatchable() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('catchable-' + users[i] + '.json', catchSuccess, errorFunc, i);
  }
}
function addInventory() {
  for (var i = 0; i < users.length; i++) {
    loadJSON('inventory-' + users[i] + '.json', invSuccess, errorFunc, i);
  }
}

function pad_with_zeroes(number, length) {
  var my_string = '' + number;
  while (my_string.length < length) {
      my_string = '0' + my_string;
  }
  return my_string;
}

function filter(arr, search) {
  var filtered = [];
  for(i=0; i < arr.length; i++) {
    if(arr[i].inventory_item_data[search] != undefined) {
      filtered.push(arr[i]);
    }
  }
  return filtered;
}

function loadJSON(path, success, error, successData) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(JSON.parse(xhr.responseText.replace(/\bNaN\b/g, 'null')), successData);
      } else {
        if (error)
        error(xhr);
      }
    }
  };
xhr.open('GET', path, true);
xhr.send();
}

// Init tooltip

$(document).ready(function(){
  $('.tooltipped').tooltip({delay: 50});
});

// Bots list and menus

$(document).on('click','.tInfo',function(){
  if (!openFlag1) {
    buildMenu($(this).closest("ul").attr("user_id"),1);
    openFlag1 = true;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
  } else {
    $('#submenu').toggle();
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
  }
});

$(document).on('click','.tItems',function(){
  if (!openFlag2) {
    buildMenu($(this).closest("ul").attr("user_id"),2);
    openFlag2 = true;
    openFlag1 = false;
    openFlag3 = false;
    openFlag4 = false;
  } else {
    $('#submenu').toggle();
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
  }
});

$(document).on('click','.tPokemon',function(){
  if (!openFlag3) {
    buildMenu($(this).closest("ul").attr("user_id"),3);
    openFlag3 = true;
    openFlag1 = false;
    openFlag2 = false;
    openFlag4 = false;
  } else {
    $('#submenu').toggle();
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
  }
});

$(document).on('click','.tPokedex',function(){
  if (!openFlag4) {
    buildMenu($(this).closest("ul").attr("user_id"),4);
    openFlag4 = true;
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
  } else {
    $('#submenu').toggle();
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
  }
});

$(document).on('click','#close',function(){
  $('#submenu').toggle();
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
});

$(document).on('click','.bot-name',function(){
  if (openFlag1 || openFlag2 || openFlag3 || openFlag4) {
    $('#submenu').toggle();
    openFlag1 = false;
    openFlag2 = false;
    openFlag3 = false;
    openFlag4 = false;
  }
});

function buildTrainerList() {
  var out = '<div class="col s12"><ul id="bots-list" class="collapsible" data-collapsible="accordion"> \
              <li><div class="collapsible-title"><i class="material-icons">people</i>Bots</div></li>';
  for(var i = 0; i < users.length; i++)
  {
    out += '<li><div class="collapsible-header bot-name">'+users[i]+
           '</div><div class="collapsible-body"><ul user_id="'+i+'">\
           <li><a class="indigo waves-effect waves-light btn tInfo">Info</a></li><br>\
           <li><a class="indigo waves-effect waves-light btn tItems">Items</a></li><br>\
           <li><a class="indigo waves-effect waves-light btn tPokemon">Pokemon</a></li><br>\
           <li><a class="indigo waves-effect waves-light btn tPokedex">Pokedex</a></li>\
           </ul> \
           </div>\
           </li>';
  }
  out += "</ul></div>";
  document.getElementById('trainers').innerHTML = out;
  $('.collapsible').collapsible();
}

function buildMenu(user_id, menu) {
  $("#submenu").show();
  if (menu == 1) {
    document.getElementById('subtitle').innerHTML = 'Trainer Info';

    document.getElementById('sortButtons').innerHTML = "";

    out = '';
    var current_user_stats = user_data[users[user_id]].stats[0].inventory_item_data.player_stats;
      out += '<div class="row"><div class="col s12"><h5>' +
              users[user_id] +
              '</h5><br>Level: ' +
              current_user_stats.level +
              '<br>Exp: ' +
              current_user_stats.experience +
              '<br>Exp to Lvl ' +
              ( parseInt(current_user_stats.level, 10) + 1 ) +
              ': ' +
              (parseInt(current_user_stats.next_level_xp, 10) - current_user_stats.experience) +
              '<br>Pokemon Encountered: ' +
              (current_user_stats.pokemons_encountered || 0) +
              '<br>Pokeballs Thrown: ' +
              (current_user_stats.pokeballs_thrown || 0) +
              '<br>Pokemon Caught: ' +
              (current_user_stats.pokemons_captured || 0) +
              '<br>Small Ratata Caught: ' +
              (current_user_stats.small_rattata_caught || 0) +
              '<br>Pokemon Evolved: ' +
              (current_user_stats.evolutions || 0) +
              '<br>Eggs Hatched: ' +
              (current_user_stats.eggs_hatched || 0) +
              '<br>Unique Pokedex Entries: ' +
              (current_user_stats.unique_pokedex_entries || 0) +
              '<br>PokeStops Visited: ' +
              (current_user_stats.poke_stop_visits || 0) +
              '<br>Kilometers Walked: ' +
              (parseFloat(current_user_stats.km_walked).toFixed(2) || 0) +
              '</div></div>';
    
    document.getElementById('subcontent').innerHTML = out;
  }
  if (menu == 2) {
    var current_user_bag_items = user_data[users[user_id]].bagItems;
    document.getElementById('subtitle').innerHTML = current_user_bag_items.length+" items in Bag";

    document.getElementById('sortButtons').innerHTML = "";

    out = '<div class="row items">';
    for (i = 0; i < current_user_bag_items.length; i++) {
      out += '<div class="col s12 m4 l3 center" style="float: left"><img src="image/items/' +
              current_user_bag_items[i].inventory_item_data.item.item_id +
              '.png" class="item_img"><br><b>' +
              itemsArray[current_user_bag_items[i].inventory_item_data.item.item_id] +
              '</b><br>Count: ' +
              (current_user_bag_items[i].inventory_item_data.item.count || 0) +
              '</div>';
    }
    out += '</div>';
    document.getElementById('subcontent').innerHTML = out;
  }
  if (menu == 3) {
    pkmnTotal = user_data[users[user_id]].bagPokemon.length;
    document.getElementById('subtitle').innerHTML = pkmnTotal+" Pokemons";

    sortButtons = '<div style="float: right">Sort : ';
    sortButtons += '<div class="chip"><a href="javascript:sortAndShowBagPokemon(\'cp\',' + user_id + ')">CP</a></div>';
    sortButtons += '<div class="chip"><a href="javascript:sortAndShowBagPokemon(\'iv\',' + user_id + ')">IV</a></div>';
    sortButtons += '<div class="chip"><a href="javascript:sortAndShowBagPokemon(\'name\',' + user_id + ')">Name</a></div>';
    sortButtons += '<div class="chip"><a href="javascript:sortAndShowBagPokemon(\'id\',' + user_id + ')">ID</a></div>';
    sortButtons += '</div>';

    document.getElementById('sortButtons').innerHTML = sortButtons;

    sortAndShowBagPokemon('cp', user_id);
  }
  if (menu == 4) {
    pkmnTotal = user_data[users[user_id]].pokedex.length;
    document.getElementById('subtitle').innerHTML = "Pokedex "+ pkmnTotal + ' / 151';

    document.getElementById('sortButtons').innerHTML = "";
    
    out = '<div class="row items">';
    for (i = 0; i < user_data[users[user_id]].pokedex.length; i++) {
      var current_pokedex = user_data[users[user_id]].pokedex[i].inventory_item_data.pokedex_entry;
      pkmnNum = current_pokedex.pokedex_entry_number;
      pkmnImage = pad_with_zeroes(current_pokedex.pokedex_entry_number, 3) +'.png';
      pkmnName = pokemonArray[pkmnNum-1].Name;
      out += '<div class="col m6 s12"><img src="image/pokemon/' +
              pkmnImage +
              '" class="png_img"><br><b> ' +
              pkmnName +
              '</b><br>Number: ' +
              pkmnNum +
              '<br>Times Encountered: ' +
              current_pokedex.times_encountered + 
              '<br>Times Caught: ' +
              (current_pokedex.times_captured || 0) +
              '</div>';
    }
    out += '</div>';
    document.getElementById('subcontent').innerHTML = out;
  }
}

function candyForPokemon(user_id, pokemon_id) {
  var bagCandy = user_data[users[user_id]].bagCandy;
  var pokemon_family = findFamilyIdForPokemon(pokemon_id);
  for (var i = 0; i < bagCandy.length; i++) {
    var data = bagCandy[i].inventory_item_data.pokemon_family;
    if (data.family_id == pokemon_family) {
      return data.candy;
    }
  }
  return 0;
}

function sortAndShowBagPokemon(sortOn, user_id) {

  user_id = user_id || 0;

  if(!user_data[users[user_id]].bagPokemon.length) return;

  sortOn = sortOn || 'cp';

  var sortedPokemon = [];

  var eggs = 0;

  out = '<div class="row items">';

  for (var i = 0; i <  user_data[users[user_id]].bagPokemon.length; i++) {

    if( user_data[users[user_id]].bagPokemon[i].inventory_item_data.pokemon_data.is_egg) {
      eggs++;
      continue;
    }

    pkmID = user_data[users[user_id]].bagPokemon[i].inventory_item_data.pokemon_data.pokemon_id;

    pkmnName = pokemonArray[pkmID-1].Name;

    pkmCP =  user_data[users[user_id]].bagPokemon[i].inventory_item_data.pokemon_data.cp;

    pkmIVA = user_data[users[user_id]].bagPokemon[i].inventory_item_data.pokemon_data.individual_attack || 0;
    pkmIVD = user_data[users[user_id]].bagPokemon[i].inventory_item_data.pokemon_data.individual_defense || 0;
    pkmIVS = user_data[users[user_id]].bagPokemon[i].inventory_item_data.pokemon_data.individual_stamina || 0;
    pkmIV = ((pkmIVA + pkmIVD + pkmIVS) / 45.0).toFixed(2);
    pkmCandy = candyForPokemon(user_id, pkmID);

    sortedPokemon.push({
      "name": pkmnName,
      "id":pkmID,
      "cp": pkmCP,
      "iv": pkmIV,
      "candy": pkmCandy
    });
  }

  switch(sortOn) {
    case 'name':
      sortedPokemon.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
      break;
    case 'id':
      sortedPokemon.sort(function(a, b){
        return a.id - b.id
      });
      break;
    case 'cp':
      sortedPokemon.sort(function(a, b){
        if (a.cp > b.cp) return -1
        if(a.cp < b.cp) return 1
        return 0
      });
      break;
    case 'iv':
      sortedPokemon.sort(function(a, b){
        if (a.iv > b.iv) return -1
        if(a.iv < b.iv) return 1
        return 0
      });
      break;
  }

  for (var i = 0; i < sortedPokemon.length; i++) {

    pkmnNum = sortedPokemon[i].id;
    pkmnImage = pad_with_zeroes(pkmnNum, 3) + '.png';
    pkmnName = pokemonArray[pkmnNum-1].Name;
    pkmnCP = sortedPokemon[i].cp;
    pkmnIV = sortedPokemon[i].iv;
    pkmnCandy = sortedPokemon[i].candy;

    out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/pokemon/' + pkmnImage + '" class="png_img"><br><b>' + pkmnName +
        '</b><br>' + pkmnCP + '<br>IV '+pkmnIV+'<br>Candy '+pkmnCandy+'</div>';
  }

  // Add number of eggs
  out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/pokemon/Egg.png" class="png_img"><br><b>You have ' + eggs + ' eggs</div>';

  out += '</div>';

  document.getElementById('subcontent').innerHTML = out;
}