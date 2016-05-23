/**
 *   M-RPG Maker source file NameStore,
 *   Copyright (C) 2016 James M Adams
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


function NameStore(game){

this.data={};

//constructor
this._constructor = function(){
	this.game = game;
}

/**
 *
 */
this.getRandom=function(region,race,callback){
	//console.log('nameStore getRandom',region,race);

	console.log('deprecated call to getRandom on Name Store');

	this._resolveLists(region,race,callback);
}

this.resolveList=function(region,race,callback){
	this._resolveLists(region,race,callback);
}

this._resolveLists=function(region,race,callback){

	var lists;
	var namespace

	//check locally
	if(region !== '' && this.data[region+' '+race]!==undefined && this.data[region+' '+race]!==false){
		lists = this.data[region+' '+race];
	} else if(this.data[race]!==undefined && this.data[race]!==false){
        lists = this.data[race];
	}

	//poll race
	if(this.data[race]===undefined){

		namespace = race;
		this._load(race).done(this._loadSuccess.bind(this,namespace,callback)).fail($.proxy(function(){
			this.data[namespace]=false;
		},this));
	}

	//poll specific
	if(region !== '' && this.data[region+' '+race]===undefined){
		namespace=region+' '+race;

		this._load(namespace).done(this._loadSuccess.bind(this,namespace,callback)).fail($.proxy(function(){
			this.data[namespace]=false;
		},this));
	}


	if(lists!==undefined){
		callback(lists);
	}
}

this._load=function(name){
	return $.getJSON('./template/'+game+'/names/npc/'+name+'.json');
}

this._loadSuccess=function(nameSpace,callback,data){
	//console.log('_loadSuccess',data,data.name,arguments);
	this.data[nameSpace]= data.lists;

	callback(this.data[nameSpace]);
};




//main
	this._constructor();

}
