/**
 *   M-RPG Maker source file NPC,
 *   Copyright (C) 2016  James M Adams
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

function NPC(){

//data
this.node;

//constructor
this._constructor = function(){
	this._setup();
}

this._setup=function(){
	$.get('html/npc.html',$.proxy(function(data){
		$('.page .form').after(data.trim());

		this.node = $('.page .form').next();

		$(this).trigger('loaded');

	},this));
}

this.set=function(name,value){
	//console.log('npc set',name,value)
	this.node.find('.'+name).text(value);
}

this.getNode=function(){
	return this.node;
}

//main
	this._constructor();

}

