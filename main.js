$(function() {
    mapView.init();
});

var mapView = {
    settings: {
        i: 0,
        map: [],
        menu: [],
        out1: [],
        out: [],
        user_index: 0,
        emptyDex: [],
        forts: [],
        info_windows: [],
        outArray: [],
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
        bagCandy: {},
        bagItems: {},
        bagPokemon: {},
        inventory: {},
        playerInfo: {},
        pokedex: {},
        pokemonArray: {},
        stats: [],
        user_data: {},
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
        }
    },
    init: function() {
        var self = this;
        self.settings = $.extend(true, self.settings, userInfo);
        self.settings.stats = self.makeArrays();
        self.bindUi();
        // Load Map js and init data
        $.getScript("https://maps.googleapis.com/maps/api/js?key={0}&libraries=drawing".format(mapView.settings.gMapsAPIKey), function() {
            self.initMap();
            self.loadJSON('pokemondata.json', function(data, successData) {
                console.log('Loaded pokemon data..');
                self.settings.pokemonArray = data;
            }, self.errorFunc, 'pokemonData');
            for (var i = 0; i < self.settings.users.length; i++) {
                self.settings.user_data[self.settings.users[i]] = {};
            }
        });
    },
    bindUi: function() {
        var self = this;
        $('#switchPan').change(function() {
            if (this.checked) {
                self.settings.userFollow = true;
            } else {
                self.settings.userFollow = false;
            }
        });

        $('#switchZoom').change(function() {
            if (this.checked) {
                self.settings.userZoom = true;
            } else {
                self.settings.userZoom = false;
            }
        });

        $('#imageType').change(function() {
            if (this.checked) {
                self.settings.imageExt = '.gif';
            } else {
                self.settings.imageExt = '.png';
            }
        });

        $('#optionsButton').click(function() {
            $('#optionsList').toggle();
        });

        $('#trainerButton').click(function() {
            $('#trainerList').toggle();
        });

        $('#tInfo').click(function() {
            if (self.settings.menu == undefined || self.settings.menu == 1) {
                $('#submenu').toggle();
            }
            if (self.settings.menu != 1 && $('#submenu').is(':hidden')) {
                $('#submenu').toggle();
            }
            self.settings.menu = 1;
            self.buildMenu();
        });

        $('#tItems').click(function() {
            if (self.settings.menu == undefined || self.settings.menu == 2) {
                $('#submenu').toggle();
            }
            if (self.settings.menu != 2 && $('#submenu').is(':hidden')) {
                $('#submenu').toggle();
            }
            self.settings.menu = 2;
            self.buildMenu();
        });

        $('#tPokemon').click(function() {
            if (self.settings.menu == undefined || self.settings.menu == 3) {
                $('#submenu').toggle();
            }
            if (self.settings.menu != 3 && $('#submenu').is(':hidden')) {
                $('#submenu').toggle();
            }
            self.settings.menu = 3;
            self.buildMenu();
        });

        $('#tPokedex').click(function() {
            if (self.settings.menu == undefined || self.settings.menu == 4) {
                $('#submenu').toggle();
            }
            if (self.settings.menu != 4 && $('#submenu').is(':hidden')) {
                $('#submenu').toggle();
            }
            self.settings.menu = 4;
            self.buildMenu();
        });
    },
    initMap: function() {
        var self = this;
        self.settings.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 50.0830986,
                lng: 6.7613762
            },
            zoom: 8
        });

        $('#switchPan').checked = self.settings.userFollow;
        $('#switchZoom').checked = self.settings.userZoom;
        $('#imageType').checked = (self.settings.imageExt != '.png');
        setTimeout(function() {
            self.placeTrainer();
            self.addCatchable();
            self.addInventory();
            setTimeout(function() {
                setInterval(self.updateTrainer, 1000);
                setInterval(self.addCatchable, 1000);
            }, 5000);
        }, 5000);
    },
    addCatchable: function() {
        var self = mapView;
        for (var i = 0; i < self.settings.users.length; i++) {
            self.loadJSON('catchable-' + self.settings.users[i] + '.json', self.catchSuccess, self.errorFunc, i);
        }
    },
    addInventory: function() {
        var self = mapView;
        for (var i = 0; i < self.settings.users.length; i++) {
            self.loadJSON('inventory-' + self.settings.users[i] + '.json', self.invSuccess, self.errorFunc, i);
        }
    },
    buildMenu: function() {
        var self = this;
        self.addInventory();
        switch (self.settings.menu) {
            case 1:
                $('#subtitle').html('Trainer Info');
                out = '<div class="row"><div class="col s12"><ul class="tabs">';
                for (i = 0; i < self.settings.users.length; i++) {
                    out += '<li class="tab col s3"><a href="#tabI' +
                        i +
                        '">' +
                        self.settings.users[i] +
                        '</a></li>';
                }
                out += '</ul></div>';
                for (i = 0; i < self.settings.users.length; i++) {
                    var user = self.settings.users[i];
                    out += '<div id="tabI' +
                        i +
                        '" class="col s12"><h5>' +
                        user +
                        '</h5><br>Level: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.level +
                        '<br>Exp: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.experience +
                        '<br>Exp to Lvl ' +
                        (parseInt(self.settings.stats[user][0].inventory_item_data.player_stats.level, 10) + 1) +
                        ': ' +
                        (parseInt(self.settings.stats[user][0].inventory_item_data.player_stats.next_level_xp, 10) - self.settings.stats[user][0].inventory_item_data.player_stats.experience) +
                        '<br>Pokemon Encountered: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.pokemons_encountered +
                        '<br>Pokeballs Thrown: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.pokeballs_thrown +
                        '<br>Pokemon Caught: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.pokemons_captured +
                        '<br>Small Ratata Caught: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.small_rattata_caught +
                        '<br>Pokemon Evolved: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.evolutions +
                        '<br>Eggs Hatched: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.eggs_hatched +
                        '<br>Unique Pokedex Entries: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.unique_pokedex_entries +
                        '<br>PokeStops Visited: ' +
                        self.settings.stats[user][0].inventory_item_data.player_stats.poke_stop_visits +
                        '<br>Kilometers Walked: ' +
                        parseFloat(self.settings.stats[user][0].inventory_item_data.player_stats.km_walked).toFixed(2) +
                        '</div>';
                }
                out += '</div>';
                $('#subcontent').html(out);
                $('ul.tabs').tabs();
                break;
            case 2:
                $('#subtitle').html("Items in Bag");
                out = '<div class="row"><div class="col s12"><ul class="tabs">';
                for (i = 0; i < self.settings.users.length; i++) {
                    out += '<li class="tab col s3"><a href="#tabB' +
                        i +
                        '">' +
                        self.settings.users[i] +
                        '</a></li>';
                }
                out += '</ul></div>';
                for (i = 0; i < self.settings.users.length; i++) {
                    var user = self.settings.users[i]
                    out += '<div id="tabB' +
                        i +
                        '" class="col s12 items"><h5>' + user + '</h5>';
                    for (x = 0; x < self.settings.bagItems[user].length; x++) {
                        var item = self.settings.bagItems[user][x].inventory_item_data.item,
                            content = '<div class="card horizontal">\
                          <div class="card-image">\
                            <img src="image/items/{0}.png">\
                          </div>\
                          <div class="card-stacked">\
                            <div class="card-content">\
                              <p>Item: {1}<br/>Count: {2}</p>\
                            </div>\
                          </div>\
                        </div>';
                        out += content.format(item.item_id, self.settings.itemsArray[item.item_id], (item.count || 0));
                    }
                    out += '</div>';
                }
                out += '</div>';
                $('#subcontent').html(out);
                $('ul.tabs').tabs();
                break;
            case 3:
                $('#subtitle').html("Pokemon in Bag");
                out = '<div class="col s12"><ul class="tabs">';
                for (i = 0; i < self.settings.users.length; i++) {
                    var user = self.settings.users[i]
                    out += '<li class="tab col s3"><a href="#tabBP' +
                        i +
                        '">' +
                        user +
                        '</a></li>';
                }
                out += '</ul></div>';
                for (i = 0; i < self.settings.users.length; i++) {
                    var pkmnTotal = self.settings.bagPokemon[self.settings.users[i]].length,
                        user = self.settings.users[i];
                    out += '<div id="tabBP' +
                        i +
                        '" class="col s12 items"><h5>' +
                        user +
                        ' | ' +
                        pkmnTotal +
                        ' Pokemon</h5><table>';
                    for (x = 0; x < self.settings.bagPokemon[user].length; x++) {
                        if (self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.is_egg) {
                            pkmnNum = '???';
                            pkmnImage = 'Egg.png';
                            pkmnName = 'Egg';
                            pkmnCP = '';
                            pkmnMove1 = '';
                            pkmnMove2 = '';
                            ivList = '<td></td>';
                            pokeballUsed + '<td></td>';
                        } else {
                            pkmnNum = self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.pokemon_id;
                            pkmnImage = self.pad_with_zeroes(self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.pokemon_id, 3) + '.png';
                            pkmnName = self.settings.pokemonArray[pkmnNum - 1].Name;
                            pkmnCP = '<br>CP: ' + self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.cp;
                            pkmnMove1 = '<br>Move 1: ' + self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.move_1;
                            pkmnMove2 = '<br>Move 2: ' + self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.move_2;
                            ivAtk = self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.individual_attack;
                            ivDef = self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.individual_defense;
                            ivSta = self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.individual_stamina;
                            if (ivAtk === undefined) {
                                ivAtk = 0;
                            }
                            if (ivDef === undefined) {
                                ivDef = 0;
                            }
                            if (ivSta === undefined) {
                                ivSta = 0;
                            }
                            ivList = '<td>Attack: ' + ivAtk + '<br>Defense: ' + ivDef + '<br>Stamina: ' + ivSta + '</td>';
                            pokeballUsed = '<td><img src="image/items/' + self.settings.bagPokemon[user][x].inventory_item_data.pokemon_data.pokeball + '.png" class="png_img_small"></td>';
                        }
                        out += '<tr><td><img src="image/pokemon/' +
                            pkmnImage +
                            '" class="png_img"></td><td class="left-align">Name: ' +
                            pkmnName +
                            '<br>Number: ' +
                            pkmnNum +
                            pkmnCP +
                            pkmnMove1 +
                            pkmnMove2 +
                            '</td>' +
                            ivList +
                            pokeballUsed +
                            '</tr>';
                    }
                    out += '</table></div>';
                }
                out += '</div>';
                $('#subcontent').html(out);
                $('ul.tabs').tabs();
                break;
            case 4:
                $('#subtitle').html("Pokedex");
                out = '<div class="col s12"><ul class="tabs">';
                for (i = 0; i < self.settings.users.length; i++) {
                    var user = self.settings.users[i];
                    out += '<li class="tab col s3"><a href="#tabP' +
                        i +
                        '">' +
                        user +
                        '</a></li>';
                }
                out += '</ul></div>';
                for (i = 0; i < self.settings.users.length; i++) {
                    var user = self.settings.users[i],
                        pkmnTotal = self.settings.pokedex[user].length;
                    out += '<div id="tabP' +
                        i +
                        '" class="col s12 items"><h5>' + user + ' | ' + pkmnTotal + ' / 151</h5><table>';
                    for (x = 0; x < self.settings.pokedex[user].length; x++) {
                        pkmnNum = self.settings.pokedex[user][x].inventory_item_data.pokedex_entry.pokedex_entry_number;
                        pkmnImage = self.pad_with_zeroes(self.settings.pokedex[user][x].inventory_item_data.pokedex_entry.pokedex_entry_number, 3) + '.png';
                        pkmnName = self.settings.pokemonArray[pkmnNum - 1].Name;
                        out += '<tr><td><img src="image/pokemon/' +
                            pkmnImage +
                            '" class="png_img"></td><td class="left-align">Name: ' +
                            pkmnName +
                            '<br>Number: ' +
                            pkmnNum +
                            '<br>Times Encountered: ' +
                            self.settings.pokedex[user][x].inventory_item_data.pokedex_entry.times_encountered +
                            '<br>Times Caught: ' +
                            self.settings.pokedex[user][x].inventory_item_data.pokedex_entry.times_captured +
                            '</td></tr>';
                    }
                    out += '</table></div>';
                }
                out += '</div>';
                $('#subcontent').html(out);
                $('ul.tabs').tabs();
                break;
        }
    },
    catchSuccess: function(data, user_index) {
        var self = mapView,
            user = self.settings.user_data[self.settings.users[user_index]];
        if (data !== undefined && Object.keys(data).length > 0) {
            if (user.catchables === undefined) {
                user.catchables = {};
            }
            if (data.latitude !== undefined) {
                if (user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
                    poke_name = self.settings.pokemonArray[data.pokemon_id - 1].Name;
                    Materialize.toast(poke_name + ' appeared near trainer: ' + self.settings.users[user_index], 3000, 'rounded');
                    user.catchables[data.spawnpoint_id] = new google.maps.Marker({
                        map: self.settings.map,
                        position: {
                            lat: parseFloat(data.latitude),
                            lng: parseFloat(data.longitude)
                        },
                        icon: 'image/pokemon/' + self.pad_with_zeroes(data.pokemon_id, 3) + self.settings.imageExt,
                        zIndex: 4,
                        optimized: false
                    });
                    if (self.settings.userZoom === true) {
                        self.settings.map.setZoom(16);
                    }
                    if (self.settings.userFollow === true) {
                        self.settings.map.panTo({
                            lat: parseFloat(data.latitude),
                            lng: parseFloat(data.longitude)
                        });
                    }
                } else {
                    user.catchables[data.spawnpoint_id].setPosition({
                        lat: parseFloat(data.latitude),
                        lng: parseFloat(data.longitude)
                    });
                    user.catchables[data.spawnpoint_id].setIcon('image/pokemon/' + self.pad_with_zeroes(data.pokemon_id, 3) + self.settings.imageExt);
                }
            }
        } else {
            if (user.catchables !== undefined && Object.keys(user.catchables).length > 0) {
                Materialize.toast('The Pokemon has been caught or fled ' + self.settings.users[user_index], 3000, 'rounded');
                for (var key in user.catchables) {
                    user.catchables[key].setMap(null);
                }
                user.catchables = undefined;
            }
        }
    },
    filter: function(arr, search) {
        var filtered = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i].inventory_item_data[search] != undefined) {
                filtered.push(arr[i]);
            }
        }
        return filtered;
    },
    errorFunc: function(xhr) {
        console.error(xhr);
    },
    invSuccess: function(data, user_index) {
        var self = mapView,
            user = self.settings.users[user_index];

        self.settings.bagCandy[user] = self.filter(data, 'pokemon_family');
        self.settings.bagItems[user] = self.filter(data, 'item');
        self.settings.bagPokemon[user] = self.filter(data, 'pokemon_data');
        self.settings.pokedex[user] = self.filter(data, 'pokedex_entry');
        self.settings.stats[user] = self.filter(data, 'player_stats');
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
        xhr.open('GET', path, true);
        xhr.send();
    },
    makeArrays: function() {
        var self = this;
        var tempArr = {};
        for (i = 0; i < self.settings.users.length; i++) {
            tempArr[self.settings.users[i]] = {};
        }
        return tempArr;
    },
    pad_with_zeroes: function(number, length) {
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        return my_string;
    },
    placeTrainer: function() {
        var self = mapView;
        for (var i = 0; i < self.settings.users.length; i++) {
            self.loadJSON('location-' + self.settings.users[i] + '.json', self.trainerFunc, self.errorFunc, i);
        }
    },
    trainerFunc: function(data, user_index) {
        var self = mapView;
        for (var i = 0; i < data.cells.length; i++) {
            cell = data.cells[i];
            if (data.cells[i].forts != undefined) {
                for (var x = 0; x < data.cells[i].forts.length; x++) {
                    var fort = cell.forts[x],
                        fortPoints = '',
                        fortTeam = '',
                        fortType = 'PokeStop',
                        pokemonGuard = '';
                    if (!self.settings.forts[fort.id]) {
                        if (fort.type === 1) {
                            self.settings.forts[fort.id] = new google.maps.Marker({
                                map: self.settings.map,
                                position: {
                                    lat: parseFloat(fort.latitude),
                                    lng: parseFloat(fort.longitude)
                                },
                                icon: 'image/forts/img_pokestop.png'
                            });
                        } else {
                            self.settings.forts[fort.id] = new google.maps.Marker({
                                map: self.settings.map,
                                position: {
                                    lat: parseFloat(fort.latitude),
                                    lng: parseFloat(fort.longitude)
                                },
                                icon: 'image/forts/' + self.settings.teams[fort.owned_by_team] + '.png'
                            });
                        }

                        if (fort.guard_pokemon_id != undefined) {
                            fortPoints = 'Points: ' + fort.gym_points;
                            fortTeam = 'Team: ' + self.settings.teams[fort.owned_by_team] + '<br>';
                            fortType = 'Gym';
                            pokemonGuard = 'Guard Pokemon: ' + self.settings.pokemonArray[fort.guard_pokemon_id - 1].Name + '<br>';
                        }
                        var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
                        self.settings.info_windows[fort.id] = new google.maps.InfoWindow({
                            content: contentString
                        });
                        google.maps.event.addListener(self.settings.forts[fort.id], 'click', (function(marker, content, infowindow) {
                            return function() {
                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                            };
                        })(self.settings.forts[fort.id], contentString, self.settings.info_windows[fort.id]));
                    }
                }
            }
        }
        if (self.settings.user_data[self.settings.users[user_index]].hasOwnProperty('marker') === false) {
            Materialize.toast('New Marker: Trainer - ' + data.lat + ', ' + data.lng + self.settings.users[user_index], 3000, 'rounded');
            var randomSex = Math.floor(Math.random() * 1);
            self.settings.user_data[self.settings.users[user_index]].marker = new google.maps.Marker({
                map: self.settings.map,
                position: {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                },
                icon: 'image/trainer/' + self.settings.trainerSex[randomSex] + Math.floor(Math.random() * self.settings.numTrainers[randomSex]) + '.png',
                zIndex: 2,
                label: self.settings.users[user_index]
            });
        } else {
            self.settings.user_data[self.settings.users[user_index]].marker.setPosition({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            });
        }
        if (self.settings.users.length === 1 && self.settings.userZoom === true) {
            self.settings.map.setZoom(16);
        }
        if (self.settings.users.length === 1 && self.settings.userFollow === true) {
            self.settings.map.panTo({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            });
        }
    },
    updateTrainer: function() {
        var self = mapView;
        for (var i = 0; i < self.settings.users.length; i++) {
            self.loadJSON('location-' + self.settings.users[i] + '.json', self.trainerFunc, self.errorFunc, self.settings.i);
        }
    }
};


// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}