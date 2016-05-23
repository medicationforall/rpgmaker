/**
 *   M-RPG Maker source file npcPage,
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

$(document).ready(function(){
	$('.javascriptWarning').remove();

	
	var form = new NPCForm();
	var gameStore = new ListStore('./template/Games.json');
	var npcStore;
	var regionStore;
	var motivationStore;
	var viceStore;
	var nameStore;


	var saveAsFile=function(t,f,m) {
		try {
		var b = new Blob([t],{type:m});
			saveAs(b, f);
		} catch (e) {
			window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
		}
	}


	var getData = function(){
		var data ={};
		data.form = form.getData();
		data.npcCustom= npcStore.getCustom();
		data.regionCustom = regionStore.getCustom();
		data.npc=[];

		$('.npc').each(function(index,item){
			//console.log('found npc',$(item));

			var node= $(item);

			var npc = {};
			npc.name=node.find('.name').text();
			npc.region=node.find('.region').text();
			npc.race=node.find('.race').text();
			npc.gender=node.find('.gender').text();
			npc.age=node.find('.age').text();
			npc.disposition=node.find('.disposition').text();

			npc.notes = node.find('.notes').val();

			npc.motivation=[];
			npc.vice=[];

			node.find('.motivation ul li').each(function(index,item){
				npc.motivation.push($(item).text());
			});

			node.find('.vice ul li').each(function(index,item){
				npc.vice.push($(item).text());
			});

			//console.log('npc data',npc);
			data.npc.push(npc);
		});
		return data;
	}

	var loadStores = function(game){
		npcStore = new ListStore('./template/'+game+'/npc/NPC.json');
		regionStore = new ListStore('./template/'+game+'/Region.json');
		motivationStore = new ListStore('./template/'+game+'/npc/Motivations.json');
		viceStore = new ListStore('./template/'+game+'/npc/Vices.json');
		nameStore = new NameStore(game);

		form.npcStore=npcStore;
		form.regionStore=regionStore;
		form.motivationStore=motivationStore;
		form.nameStore=nameStore;
		form.viceStore=viceStore;

		$(npcStore).on('loaded',function(){
			console.log('loaded npc store',this.get('Race'));
			form.setSelect('race',this.get('Race'));
			form.setSelect('gender',this.get('Gender'));
			form.setSelect('age',this.get('Age'));
			form.setSelect('disposition',this.get('Disposition'));
		});

		$(regionStore).on('loaded',function(){
			console.log('loaded region');
			form.setSelect('region',this.get('Region'));
		});
	};

	$('.header select[name="games"]').change(function(event){
		console.log('games selection was changed.');

		loadStores($(this).val());
	});


	$(gameStore).on('loaded',function(){
		var select = $('.header select[name="games"]');
		var list = gameStore.get('Game');
		select.empty();

		for(var i=0;i<list.length;i++){
			select.append('<option>'+list[i]+'</option');
		}

		select.trigger('change');
		
	});

	//export button
	$('.header .exportButton').click(function(event){
		event.preventDefault();
		console.log('clicked export');

		var data = getData();
		saveAsFile(JSON.stringify(data),'npcMaker.json',"text/plain;charset=utf-8");

		console.log('export data',data);

	});


	//import file
	$('.header .importFile').change(function(event){
		event.preventDefault();
		console.log('load import');

		if (window.File && window.FileReader && window.FileList && window.Blob) {
			//do your stuff!
			
			var file = $('.importFile')[0].files[0];
			var reader = new FileReader();
			
			reader.onload = function(e) {
				var text = reader.result;				
				var data = jQuery.parseJSON(text);
				form.setData(data);
			}
			reader.readAsText(file);
		} else {
			alert('The File APIs are not fully supported by your browser.');
		}
	});

	//menu click
	$('.header .hamburger').click(function(event){
		event.preventDefault();
		console.log('clicked hamburger');

		if($('body').hasClass('menuOpen')){
			$('body').removeClass('menuOpen');
		}else{
			$('body').addClass('menuOpen');
		}
	});

	//about click
	$('.hamburger.menu .aboutButton').click(function(event){
		event.preventDefault();
		console.log('clicked About');

		var aboutDialog = new InfoDialog('about');
	});

	//help click
	$('.hamburger.menu .helpButton').click(function(event){
		event.preventDefault();
		console.log('clicked About');

		var helpDialog = new InfoDialog('help');
	});

	//change list click
	$('.hamburger.menu .changesButton').click(function(event){
		event.preventDefault();
		console.log('clicked Changes');

		var helpDialog = new InfoDialog('changes');
	});


	//save name button
	$('.hamburger.menu .saveNamesButton').click(function(event){
		event.preventDefault();
		console.log('Save names Button click');
		var saveNamesDialog = SaveNamesDialog(regionStore, npcStore, nameStore);
	});

});
