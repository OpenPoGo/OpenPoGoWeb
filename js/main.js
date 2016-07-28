'use strict';

var logger = new Logger("#logs-panel .card-content");

$(document).ready(function() {
  mapView.init();
  
  var socket = io.connect('http://' + document.domain + ':' + location.port + '/event');

  socket.on('connect', function() {
    console.log('connected!');
  });
  socket.on('logging', function(msg) {
    for(var i = 0; i < msg.length; i++) {
      logger.log({
        message: msg[i].output,
        color: msg[i].color + "-text",
        toast: msg[i].toast || false
      });
    }
  });
});

function loadJSON(path) {
  return new Promise(function(fulfill, reject) {
    $.get({
      url: path + "?" + Date.now()
    }).done(function(data) {
      if(data !== undefined) {
        fulfill(data);
      } else {
        reject(data);
      }
    }).fail(function(jqXHR, textContent, thrownError) {
      reject(thrownError);
    });
  });
}

var mapView = {
  user_index: 0,
  emptyDex: [],
  forts: [],
  info_windows: [],
  numTrainers: [
    177,
    109
  ],
  teams: [
    'TeamLess',
    'Mystic',
    'Valor',
    'Instinct'
  ],
  trainerSex: [
    'm',
    'f'
  ],
  pathColors: [
    '#A93226',
    '#884EA0',
    '#2471A3',
    '#17A589',
    '#229954',
    '#D4AC0D',
    '#CA6F1E',
    '#CB4335',
    '#7D3C98',
    '#2E86C1',
    '#138D75',
    '#28B463',
    '#D68910',
    '#BA4A00'
  ],
  playerInfo: {},
  user_data: {},
  pathcoords: {},
  settings: {},
  init: function() {
    var self = this;
    self.settings = $.extend(true, self.settings, userInfo);
    self.bindUi();

    loadJSON('data/pokemondata.json').then(Pokemon.setPokemonData);

    loadJSON('data/pokemoncandy.json').then(Pokemon.setPokemonCandyData);

    for (var i = 0; i < self.settings.users.length; i++) {
      var username = self.settings.users[i];
      self.user_data[username] = new Player(username);
      self.pathcoords[username] = [];
    }

    $.getScript('https://maps.googleapis.com/maps/api/js?key={0}&libraries=drawing'.format(self.settings.gMapsAPIKey), function() {
      self.initMap();
    });
  },
  bindUi: function() {
    var self = this;
    $('#switchPan').prop('checked', self.settings.userFollow);
    $('#switchZoom').prop('checked', self.settings.userZoom);
    $('#strokeOn').prop('checked', false);

    $('#switchPan').change(function() {
      self.settings.userFollow = this.checked;
    });

    $('#switchZoom').change(function() {
      self.settings.userZoom = this.checked;
    });

    $('#strokeOn').change(function() {
      for (var i = 0; i < self.settings.users.length; i++) {
        self.user_data[self.settings.users[i]].trainerPath.setOptions({
          strokeOpacity: this.checked ? 1.0 : 0.0
        });
      }
    });

    $('#optionsButton').click(function() {
      $('#optionsList').toggle();
    });

    $('#logs-button').click(function() {
      $('#logs-panel').toggle();
    });
    // Init tooltip
    $(document).ready(function() {
      $('.tooltipped').tooltip({
        delay: 50
      });
    });

    // Bots list and menus
    var submenuIndex = 0,
      currentUserId;
    $('body').on('click', ".bot-user .bot-items .btn:not(.tFind)", function() {
      var itemIndex = $(this).parent().parent().find('.btn').index($(this)) + 1,
        userId = $(this).closest('ul').data('user-id');
      if ($('#submenu').is(':visible') && itemIndex == submenuIndex && currentUserId == userId) {
        $('#submenu').toggle();
      } else {
        submenuIndex = itemIndex;
        currentUserId = userId;
        self.buildMenu(userId, itemIndex);
      }
    });

    $('body').on('click', '#close', function() {
      $('#submenu').toggle();
    });

    $('body').on('click', '.tFind', function() {
      self.findBot($(this).closest('ul').data('user-id'));
    });

    // Binding sorts
    $('body').on('click', '.pokemon-sort a', function() {
      var item = $(this);
      self.sortAndShowBagPokemon(item.data('sort'), item.parent().parent().data('user-id'));
    });
    $('body').on('click', '.pokedex-sort a', function() {
      var item = $(this);
      self.sortAndShowPokedex(item.data('sort'), item.parent().parent().data('user-id'));
    });

  },
  initMap: function() {
    var self = this;
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 50.0830986,
        lng: 6.7613762
      },
      zoom: 8
    });
    self.placeTrainer();
    self.addCatchable();
    setInterval(self.placeTrainer, 1000);
    setInterval(self.addCatchable, 1000);
    setInterval(self.addInventory, 5000);
  },
  addCatchable: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      var username = self.settings.users[i];
      loadJSON('catchable-' + username + '.json').then(function(data) {
        self.catchSuccess(data, username);
      });
    }
  },
  addInventory: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      var username = self.settings.users[i];
      loadJSON('inventory-' + username + '.json').then(function(data) {
        self.user_data[username].updateInventory(data);
      });
    }
  },
  buildMenu: function(user_id, menu) {
    var self = this,
      out = '';
    $("#submenu").show();
    switch (menu) {
      case 1:
        var current_user_stats = self.user_data[self.settings.users[user_id]].stats;
        $('#subtitle').html('Trainer Info');
        $('#sortButtons').html('');

        out += '<div class="row"><div class="col s12"><h5>' +
          self.settings.users[user_id] +
          '</h5><br>Level: ' +
          current_user_stats.level +
          '<br><div class="progress botbar-' + user_id + '" style="height: 10px"> <div class="determinate bot-' + user_id + '" style="width: '+
          (current_user_stats.experience/
          current_user_stats.next_level_xp) * 100 +
          '%"></div></div>Exp: ' +
          current_user_stats.experience +
          '<br>Exp to Lvl ' +
          (parseInt(current_user_stats.level, 10) + 1) +
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

        $('#subcontent').html(out);
        break;
      case 2:
        var current_user_bag_items = self.user_data[self.settings.users[user_id]].bagItems;
        $('#subtitle').html(current_user_bag_items.length + " item" + (current_user_bag_items.length !== 1 ? "s" : "") + " in Bag");

        $('#sortButtons').html('');

        out = '<div class="items"><div class="row">';
        for (var i = 0; i < current_user_bag_items.length; i++) {
          out += '<div class="col s12 m6 l3 center" style="float: left"><img src="image/items/' +
            current_user_bag_items[i].inventory_item_data.item.item_id +
            '.png" class="item_img"><br><b>' +
            Item.getName(current_user_bag_items[i].inventory_item_data.item.item_id) +
            '</b><br>Count: ' +
            (current_user_bag_items[i].inventory_item_data.item.count || 0) +
            '</div>';
        }
        out += '</div></div>';
        var nth = 0;
        out = out.replace(/<\/div><div/g, function (match, i, original) {
          nth++;
          return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
        });
        $('#subcontent').html(out);
        break;
      case 3:
        var pkmnTotal = self.user_data[self.settings.users[user_id]].bagPokemon.length;
        $('#subtitle').html(pkmnTotal + " Pokemon");

        var sortButtons = '<div class="col s12 pokemon-sort" data-user-id="' + user_id + '">Sort : ';
        sortButtons += '<div class="chip"><a href="#" data-sort="cp">CP</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="iv">IV</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="name">Name</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="id">ID</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="time">Time</a></div>';
        sortButtons += '</div>';

        $('#sortButtons').html(sortButtons);

        self.sortAndShowBagPokemon('cp', user_id);
        break;
      case 4:
        var pkmnTotal = self.user_data[self.settings.users[user_id]].pokedex.getNumEntries();
        $('#subtitle').html('Pokedex ' + pkmnTotal + ' / 151');

        var sortButtons = '<div class="col s12 pokedex-sort" dat-user-id="' + user_id + '">Sort : ';
        sortButtons += '<div class="chip"><a href="#" data-sort="id">ID</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="name">Name</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="enc">Seen</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="cap">Caught</a></div>';
        sortButtons += '</div>';

        $('#sortButtons').html(sortButtons);

        self.sortAndShowPokedex('id', user_id);
        break;
      default:
        break;
    }
  },
  buildTrainerList: function() {
    var self = this,
      users = self.settings.users;
    var out = '<div class="col s12"><ul id="bots-list" class="collapsible" data-collapsible="accordion"> \
              <li><div class="collapsible-title"><i class="material-icons">people</i>Bots</div></li>';

    for (var i = 0; i < users.length; i++) {
      var content = '<li class="bot-user">\
            <div class="collapsible-header bot-name">{0}</div>\
                <div class="collapsible-body">\
                    <ul class="bot-items" data-user-id="{1}">\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tInfo">Info</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tItems">Items</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tPokemon">Pokemon</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tPokedex">Pokedex</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tFind">Find</a></li>\
                   </ul>\
               </div>\
           </li>';
      out += content.format(users[i], i);
    }
    out += "</ul></div>";
    $('#trainers').html(out);
    $('.collapsible').collapsible();
  },
  catchSuccess: function(data, username) {
    var self = mapView,
      user = self.user_data[username],
      poke_name = '';
    if (data !== undefined && Object.keys(data).length > 0) {
      if (user.catchables === undefined) {
        user.catchables = {};
      }
      if (data.latitude !== undefined) {
        if (user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
          poke_name = Pokemon.getPokemonById(data.pokemon_id).Name;
          logger.log({
            message: "[" + username + "] " + poke_name + " appeared",
            color: "green-text"
          });
          user.catchables[data.spawnpoint_id] = new google.maps.Marker({
            map: self.map,
            position: {
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            },
            icon: {
              url: 'image/pokemon/' + Pokemon.getImageById(data.pokemon_id),
              scaledSize: new google.maps.Size(70, 70)
            },
            zIndex: 4,
            optimized: false,
            clickable: false
          });
          if (self.settings.userZoom === true) {
            self.map.setZoom(self.settings.zoom);
          }
          if (self.settings.userFollow === true) {
            self.map.panTo({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            });
          }
        } else {
          user.catchables[data.spawnpoint_id].setPosition({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude)
          });
          user.catchables[data.spawnpoint_id].setIcon({
            url: 'image/pokemon/' + Pokemon.getImageById(data.pokemon_id),
            scaledSize: new google.maps.Size(70, 70)
          });
        }
      }
    } else {
      if (user.catchables !== undefined && Object.keys(user.catchables).length > 0) {
        logger.log({
          message: "[" + username + "] " + poke_name + " has been caught or fled"
        });
        for (var key in user.catchables) {
          user.catchables[key].setMap(null);
        }
        user.catchables = undefined;
      }
    }
  },
  errorFunc: function(xhr) {
    console.error(xhr);
  },
  findBot: function(user_index) {
    var self = this,
      username = self.settings.users[user_index],
      coords = self.pathcoords[username][self.pathcoords[username].length - 1];

    self.map.setZoom(self.settings.zoom);
    self.map.panTo({
      lat: parseFloat(coords.lat),
      lng: parseFloat(coords.lng)
    });
  },
  getCandy: function(p_num, user_id) {
    var self = this,
      user = self.user_data[self.settings.users[user_id]];

    for (var i = 0; i < user.bagCandy.length; i++) {
      var checkCandy = user.bagCandy[i].inventory_item_data.pokemon_family.family_id;
      if (Pokemon.getCandyId(p_num) === checkCandy) {
        return (user.bagCandy[i].inventory_item_data.pokemon_family.candy || 0);
      }
    }
  },
  placeTrainer: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      var username = self.settings.users[i];
      loadJSON('location-' + username + '.json').then(function(data) {
        self.trainerFunc(data, username);
      });
    }
  },
  sortAndShowBagPokemon: function(sortOn, user_id) {
    var self = this,
      eggs = 0,
      out = '',
      user = self.user_data[self.settings.users[user_id]],
      user_id = user_id || 0;

    if (!user.bagPokemon.length) return;

    var sortedPokemon = user.getSortedPokemon(sortOn);

    out = '<div class="items"><div class="row">';

    for (var i = 0; i < sortedPokemon.length; i++) {
      var myPokemon = sortedPokemon[i];
      var pkmnNum = myPokemon.id,
        pkmnImage = Pokemon.getImageById(myPokemon.id),
        pkmnName = Pokemon.getNameById(pkmnNum),
        pkmnCP = myPokemon.combatPower,
        pkmnIV = myPokemon.IV,
        pkmnIVA = myPokemon.attackIV,
        pkmnIVD = myPokemon.defenseIV,
        pkmnIVS = myPokemon.speedIV,
        candyNum = self.getCandy(pkmnNum, user_id);

      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        pkmnImage +
        '" class="png_img"><br><b>' +
        pkmnName +
        '</b><br>' +
        pkmnCP +
        '<br>IV: ' +
        pkmnIV +
        '<br>A/D/S: ' +
        pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +
        '<br>Candy: ' +
        candyNum +
        '</div>';
    }
    // Add number of eggs
    out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/pokemon/Egg.png" class="png_img"><br><b>You have ' + eggs + ' egg' + (eggs !== 1 ? "s" : "") + '</div>';
    out += '</div></div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
  },
  sortAndShowPokedex: function(sortOn, user_id) {
    var self = this,
      out = '',
      user_id = (user_id || 0),
      user = self.user_data[self.settings.users[user_id]];

    out = '<div class="items"><div class="row">';
    var sortedPokedex = user.pokedex.getAllEntriesSorted(sortOn);
    for (var i = 0; i < sortedPokedex.length; i++) {
      var entry = sortedPokedex[i];
      var candyNum = self.getCandy(entry.id, user_id);
      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        entry.image +
        '" class="png_img"><br><b> ' +
        Pokemon.getPaddedId(entry.id) +
        ' - ' +
        entry.name +
        '</b><br>Times Seen: ' +
        entry.encountered +
        '<br>Times Caught: ' +
        entry.captured +
        '<br>Candy: ' +
        candyNum +
        '</div>';
    }
    out += '</div></div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
  },
  trainerFunc: function(data, username) {
    var self = mapView,
      coords = self.pathcoords[username][self.pathcoords[username].length - 1];
    for (var i = 0; i < data.cells.length; i++) {
      var cell = data.cells[i];
      if (data.cells[i].forts != undefined) {
        for (var x = 0; x < data.cells[i].forts.length; x++) {
          var fort = cell.forts[x];
          if (!self.forts[fort.id]) {
            if (fort.type === 1) {
              self.forts[fort.id] = new google.maps.Marker({
                map: self.map,
                position: {
                  lat: parseFloat(fort.latitude),
                  lng: parseFloat(fort.longitude)
                },
                icon: 'image/forts/img_pokestop.png'
              });
            } else {
              self.forts[fort.id] = new google.maps.Marker({
                map: self.map,
                position: {
                  lat: parseFloat(fort.latitude),
                  lng: parseFloat(fort.longitude)
                },
                icon: 'image/forts/' + self.teams[(fort.owned_by_team || 0)] + '.png'
              });
            }
            var fortPoints = '',
              fortTeam = '',
              fortType = 'PokeStop',
              pokemonGuard = '';
            if (fort.guard_pokemon_id != undefined) {
              fortPoints = 'Points: ' + fort.gym_points;
              fortTeam = 'Team: ' + self.teams[fort.owned_by_team] + '<br>';
              fortType = 'Gym';
              pokemonGuard = 'Guard Pokemon: ' + (Pokemon.getPokemonById(fort.guard_pokemon_id).Name || "None") + '<br>';
            }
            var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
            self.info_windows[fort.id] = new google.maps.InfoWindow({
              content: contentString
            });
            google.maps.event.addListener(self.forts[fort.id], 'click', (function(marker, content, infowindow) {
              return function() {
                infowindow.setContent(content);
                infowindow.open(map, marker);
              };
            })(self.forts[fort.id], contentString, self.info_windows[fort.id]));
          }
        }
      }
    }
    if (coords > 1) {
      var tempcoords = [{
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      }];
      if (tempcoords.lat != coords.lat && tempcoords.lng != coords.lng || self.pathcoords[username].length === 1) {
        self.pathcoords[username].push({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        });
      }
    } else {
      self.pathcoords[username].push({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
    }
    if (self.user_data[username].hasOwnProperty('marker') === false) {
      self.buildTrainerList();
      self.addInventory();
      logger.log({
        message: "Trainer loaded: " + username,
        color: "blue-text"
      });
      var randomSex = Math.floor(Math.random() * 1);
      self.user_data[username].marker = new google.maps.Marker({
        map: self.map,
        position: {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        },
        icon: 'image/trainer/' + self.trainerSex[randomSex] + Math.floor(Math.random() * self.numTrainers[randomSex] + 1) + '.png',
        zIndex: 2,
        label: username,
        clickable: false
      });
    } else {
      self.user_data[username].marker.setPosition({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
      if (self.pathcoords[username].length === 2) {
        self.user_data[username].trainerPath = new google.maps.Polyline({
          map: self.map,
          path: self.pathcoords[username],
          geodisc: true,
          // Need to set proper stroke color
          strokeColor: self.pathColors[0],
          strokeOpacity: 0.0,
          strokeWeight: 2
        });
      } else {
        self.user_data[username].trainerPath.setPath(self.pathcoords[username]);
      }
    }
    if (self.settings.users.length === 1 && self.settings.userZoom === true) {
      self.map.setZoom(self.settings.zoom);
    }
    if (self.settings.users.length === 1 && self.settings.userFollow === true) {
      self.map.panTo({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
    }
  },
};

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}
