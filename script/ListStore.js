/**
 *   M-RPG Maker source file ListStore,
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

function ListStore(url){

this.data={};
this.custom={};

//constructor
this._constructor = function(){
	this.url = url;
	this._resolveJSON();
}


/**
 *
 */
this._resolveJSON=function(){
	$.getJSON(this.url,$.proxy(function(data){
		//console.log('region',data);
		this._setup(data);
	},this));
}


/**
 *
 */
this._setup=function(data){
	for(var i=0,list;list=data.lists[i];i++){
		//console.log(list);
		this.data[list.name]=list.list;
	}
	$(this).trigger('loaded');
}


/**
 *
 */
this.getRandom=function(name){
	var list;

	if(this.custom[name]){
		list=this.custom[name];
	}else{
		list=this.data[name];
	}

	var count =list.length; 
	var roll = Math.floor(Math.random() * count);
	return list[roll];
}


/**
 *
 */
this.get=function(name,ignoreCustom){
	if(this.custom[name] && ignoreCustom !== true){
		console.log('list store get custom');
		return this.custom[name];
	}else{
		console.log('list store get normal');
		return this.data[name];
	}
}


/**
 *Sets the custom list specified or the entire custom data object.
 */
this.setCustom=function(name,list){
	if(name !== undefined){
		//console.log('setCustom',name,list)
		this.custom[name]=list;
	}else{
		this.custom = list;
		$(this).trigger('loaded');
	}
}

/**
 *Either retieves the list specified or the entire custom data object.
 */
this.getCustom=function(name){
	if(name !==undefined){
		return this.custom[name];
	}else{
		return this.custom;
	}
}


//main
	this._constructor();

}
