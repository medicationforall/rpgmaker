/**
 *   M-RPG Maker source file SaveNamesDialog,
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


function SaveNamesDialog(regionStore, npcStore, nameStore){

//constructor
this._constructor = function(){
	this.regionStore=regionStore;
	this.npcStore=npcStore;
	this.nameStore=nameStore;

	this._resolveTemplate();
}

/**
 *
 */
this._resolveTemplate=function(){
	$.get('html/saveNamesDialog.html',$.proxy(function(data){
		var dialog =$(data.trim()).insertBefore('.page');
		this._setupForm(dialog);
	},this));
}


/**
 *
 */
this._setupForm=function(dialog){
	this._setupHandle(dialog);
	this._setupRegion(dialog);
	this._setupRace(dialog);
	this._setupSave(dialog);
	this._offsetDialogs();
}

/**
 *
 */
this._setupRegion=function(dialog){
	var list = this.regionStore.get('Region');

	var select = dialog.find('select[name="region"]');
	select.append('<option></option');

	for(var i=0;i<list.length;i++){
		select.append('<option>'+list[i]+'</option>');
	}
}

/**
 *
 */
this._setupRace=function(dialog){
	var list = this.npcStore.get('Race');

	var select = dialog.find('select[name="race"]');

	for(var i=0;i<list.length;i++){
		select.append('<option>'+list[i]+'</option>');
	}
}

/**
 *
 */
this._setupSave=function(dialog){
	dialog.find('.saveButton').click(function(event){
		event.preventDefault();
		console.log('click save button on the name dialog');

		var region = dialog.find('select[name="region"]').val();
		var race = dialog.find('select[name="race"]').val();

		nameStore.resolveList(region,race,function(lists){

		var fileName =race; 
		var data = {};
		data.lists= lists;

		if(region!==''){
			fileName= region+' '+race;
		}

		saveAsFile(JSON.stringify(data),fileName+'.json',"text/plain;charset=utf-8");	

		}.bind(this));
	});
}

this.saveAsFile=function(t,f,m) {
	try {
	var b = new Blob([t],{type:m});
		saveAs(b, f);
	} catch (e) {
		window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
	}
}

/**
 *
 */
this._setupHandle=function(dialog){
		dialog.draggable({handle:'.handle',stop:function(event,ui){
			//console.log('moved dialog');
			$(this).addClass('moved');
		}});
		dialog.find('.key').text(this.key);
}

/**
 *
 */
this._offsetDialogs=function(){
	$('.dialog').each(function(index,item){
		if($(item).hasClass('moved')==false){
			var top = 150+(index*10);
			var left = 200+(index*10);
			$(item).css('left',left+'px');
			$(item).css('top',top+'px');
		}
	});
};


//main
	this._constructor();

}
