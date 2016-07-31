'use strict';

$(document).ready(function() {
  players.init();
});


var players = {
	init: function init(){
		    var self = players;
			self.settings = $.extend(true, self.settings, userInfo);
	

self.loadJSON('data/pokemondata.json', function(data, successData) {
        self.pokemonArray = data;
      }, self.errorFunc, 'pokemonData');
      self.loadJSON('data/pokemoncandy.json', function(data, successData) {
        self.pokemoncandyArray = data;
      }, self.errorFunc, 'pokemonCandy');
      self.loadJSON('data/levelXp.json', function(data, successData) {
        self.levelXpArray = data;
      }, self.errorFunc, 'levelXp');
      for (var i = 0; i < self.settings.users.length; i++) {
        var user = self.settings.users[i];
        self.user_data[user] = {};
        self.pathcoords[user] = [];
      }
     self.createElements();
      self.log({
        message: 'Data Loaded!'
      });
     self.addInventory();
	setInterval(self.addInventory, 5000);

	},
	settings: {},
	createElements: function(){
	   var self = players;
	   var $pdiv = $("#players");
            for (var i = 0; i < self.settings.users.length; i++) {

		var $div= $(document.createElement('div'));
		$div.attr('id','player-'+i).addClass('playerbox');
		$div.html(
			'<header>'+
			'<span class="name">'+self.settings.users[i]+ ' (<span class="level">-</span>)</span>'+
			'<span>'+
			'<span class="xp">-</span></span>'+
			'</header>'+ 
			'<div class="eggs"></div>'
		)
		var $inv = $(document.createElement('div')).addClass('inventory');
		$div.append($inv);
		$pdiv.append($div);
		self.userDivs[i] = { 
			"container": $div, 
			"inventory": $inv, 
			"name":  $div.find('.name'),
			"level":  $div.find('.level'),
			"xp":  $div.find('.xp'),
			"eggs":  $div.find('.eggs')
            	}
	    }
	},
	addInventory: function() {
	    var self = players;
	    for (var i = 0; i < self.settings.users.length; i++) {
	      self.loadJSON('inventory-' + self.settings.users[i] + '.json', self.invSuccess, self.errorFunc, i);
	    }
  	},
 filter: function(arr, search) {
    var filtered = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].inventory_item_data[search] != undefined) {
        filtered.push(arr[i]);
      }
    }
    return filtered;
  },
 log: function(log_object) {
    var currentDate = new Date();
    var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);
    $("#logs-panel .card-content").append("<div class='log-item'>\
  <span class='log-date'>" + time + "</span><p class='" + log_object.color + "'>" + log_object.message + "</p></div>");
    if (!$('#logs-panel').is(":visible")) {
      Materialize.toast(log_object.message, 3000);
    }
  }, 
sortAndShowBagPokemon: function(sortOn, user_id) {
    var self = players,
      sortedPokemon = [],
      out = '',
      user = self.user_data[self.settings.users[user_id]],
      user_id = user_id || 0;
    var current_user_stats = self.user_data[self.settings.users[user_id]].stats[0].inventory_item_data.player_stats;

    if (!user.bagPokemon.length) return;

    out = '<div class="items"><div class="row">';
    self.eggs=0;
    for (var i = 0; i < user.bagPokemon.length; i++) {
      if (user.bagPokemon[i].inventory_item_data.pokemon_data.is_egg) {
        self.eggs++;
        continue;
      }
      var pokemonData = user.bagPokemon[i].inventory_item_data.pokemon_data,
        pkmID = pokemonData.pokemon_id,
        pkmnName = self.pokemonArray[pkmID - 1].Name,
        pkmCP = pokemonData.cp,
        pkmIVA = pokemonData.individual_attack || 0,
        pkmIVD = pokemonData.individual_defense || 0,
        pkmIVS = pokemonData.individual_stamina || 0,
        pkmHP = pokemonData.stamina || 0,
        pkmMHP = pokemonData.stamina_max || 0,
        pkmIV = ((pkmIVA + pkmIVD + pkmIVS) / 45.0).toFixed(2),
        pkmTime = pokemonData.creation_time_ms || 0;

      sortedPokemon.push({
        "name": pkmnName,
        "id": pkmID,
        "cp": pkmCP,
        "iv": pkmIV,
        "attack": pkmIVA,
        "defense": pkmIVD,
        "stamina": pkmIVS,
        "health": pkmHP,
        "max_health": pkmMHP,
        "creation_time": pkmTime,
        'candy': self.getCandy(pkmID, user_id)
      });
    }
    switch (sortOn) {
      case 'name':
        sortedPokemon.sort(function(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
      case 'id':
        sortedPokemon.sort(function(a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
      case 'cp':
        sortedPokemon.sort(function(a, b) {
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
      case 'iv':
        sortedPokemon.sort(function(a, b) {
          if (a.iv > b.iv) return -1;
          if (a.iv < b.iv) return 1;
          return 0;
        });
        break;
      case 'time':
        sortedPokemon.sort(function(a, b) {
          if (a.creation_time > b.creation_time) return -1;
          if (a.creation_time < b.creation_time) return 1;
          return 0;
        });
        break;
      case 'candy':
        sortedPokemon.sort(function(a, b) {
          if (a.candy > b.candy) return -1;
          if (a.candy < b.candy) return 1;
          return 0;
        });
        break;
      default:
        sortedPokemon.sort(function(a, b) {
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
    }
    for (var i = 0; i < sortedPokemon.length; i++) {
      var pkmnNum = sortedPokemon[i].id,
        pkmnImage = self.pad_with_zeroes(pkmnNum, 3) + '.png',
        pkmnName = self.pokemonArray[pkmnNum - 1].Name,
        pkmnCP = sortedPokemon[i].cp,
        pkmnIV = sortedPokemon[i].iv,
        pkmnIVA = sortedPokemon[i].attack,
        pkmnIVD = sortedPokemon[i].defense,
        pkmnIVS = sortedPokemon[i].stamina,
        pkmnHP = sortedPokemon[i].health,
        pkmnMHP = sortedPokemon[i].max_health,
        candyNum = self.getCandy(pkmnNum, user_id);

      out += '<div class="col s12 m6 l3 center" title="'+ ' / ' + pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +' /' + candyNum +'"><section>' +
	//'<img src="image/pokemon/' +pkmnImage + '" class="png_img"><b>' +
	'<b>'+ pkmnName +   '</b>' +
//	'<div class="progress pkmn-progress pkmn-' + pkmnNum + '"> <div class="determinate pkmn-' + pkmnNum + '"  style="width: ' + (pkmnHP / pkmnMHP) * 100 +'%"></div> </div>'+
//        '<b>HP:</b> ' + pkmnHP + ' / ' + pkmnMHP +
        '<span>' + pkmnCP +
        ' / ' + (pkmnIV >= 0.8 ? '<span style="color: #039be5">' + pkmnIV + '</span>' : pkmnIV) +
//        ' / ' + pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +
//        ' /' + candyNum +
        '</span></section></div>';
    }
    out += '</div>';
    var nth = 0;
/*    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });*/
    return out;
  },
  getCandy: function(p_num, user_id) {
    var self = this,
      user = self.user_data[self.settings.users[user_id]];

    for (var i = 0; i < user.bagCandy.length; i++) {
      var checkCandy = user.bagCandy[i].inventory_item_data.candy.family_id;
      if (self.pokemoncandyArray[p_num] === checkCandy) {
        return (user.bagCandy[i].inventory_item_data.candy.candy || 0);
      }
    }
  },
  pad_with_zeroes: function(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
      my_string = '0' + my_string;
    }
    return my_string;
  },
invSuccess: function(data, user_index) {
    var self = players,
      userData = self.user_data[self.settings.users[user_index]] || {},
      bagCandy = self.filter(data, 'candy'),
      bagItems = self.filter(data, 'item'),
      bagPokemon = self.filter(data, 'pokemon_data'),
      pokedex = self.filter(data, 'pokedex_entry'),
      stats = self.filter(data, 'player_stats');
    userData.bagCandy = bagCandy;
    userData.bagItems = bagItems;
    userData.bagPokemon = bagPokemon;
    userData.pokedex = pokedex;
    userData.stats = stats;
    userData.eggs = self.filter(data, 'egg_incubators');
    self.user_data[self.settings.users[user_index]] = userData;
    self.updateDivs(user_index);
  },
  updateDivs: function(user_index) {
	var self = players;
        var current_user_stats = self.user_data[self.settings.users[user_index]].stats[0].inventory_item_data.player_stats;
        var user = self.user_data[self.settings.users[user_index]];
	var prog_xp = current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp;
	var req_xp = self.levelXpArray[current_user_stats.level].current_level_xp - self.levelXpArray[current_user_stats.level - 1].current_level_xp;
        self.userDivs[user_index].inventory.html(players.sortAndShowBagPokemon('name', user_index));
        self.userDivs[user_index].level.html(current_user_stats.level);
        self.userDivs[user_index].xp.html(
'XP: ' +
          current_user_stats.experience +
          ' (' +
          (current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) +
		  ' / ' + self.levelXpArray[current_user_stats.level - 1].exp_to_next_level +  ", " +
		Math.round((prog_xp / req_xp)*1000)/10 + "%)")

	var out = "";
    // Add number of eggs
    out += '<div class="eggs col s12 m4 l3 center">' +
	'<div><b>' + self.eggs + ' ' +' egg' + (self.eggs !== 1 ? "s" : "") + '</div><ul>';
    for(var b=0; b<user.eggs.length; b++) {
      var incubator = user.eggs[b].inventory_item_data.egg_incubators.egg_incubator;
      if (!incubator.item_id) {
        var incubator = user.eggs[b].inventory_item_data.egg_incubators.egg_incubator[0];
      }
      var totalToWalk  = incubator.target_km_walked - incubator.start_km_walked;
      var kmsLeft = incubator.target_km_walked - current_user_stats.km_walked;
      var walked = totalToWalk - kmsLeft;
      var eggString = (parseFloat(walked).toFixed(1) || 0) + "/" + (parseFloat(totalToWalk).toFixed(1) || 0) + "km";
      if (incubator.item_id == 902) {
        var img = 'EggIncubator';
      } else {
        var img = 'EggIncubatorUnlimited';
      }
      out += '<li><img src="image/items/' + img + '.png" class="png_img"> ';
      out += eggString;
      out += '</li>';
    }
	out += "</ul></div>";

        self.userDivs[user_index].eggs.html(out);



  },
  errorFunc: function(xhr) {
    console.error(xhr);
  },
 loadJSON: function(path, success, error, successData) {
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
    xhr.open('GET', path + "?v=" + Date.now(), true);
    xhr.send();
  },
 userDivs: {},
 bagCandy: {},
  bagItems: {},
  bagPokemon: {},
  eggs: 0,
  inventory: {},
  playerInfo: {},
  pokedex: {},
  pokemonArray: {},
  pokemoncandyArray: {},
  levelXpArray: {},
  stats: {},
  user_data: {},
  pathcoords: {},
  itemsArray: {
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
    '501': 'Lure Module',
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
  }
}