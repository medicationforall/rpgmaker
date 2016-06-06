/**
 *   M-RPG Maker source file NPCForm,
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


function NPCForm(){


//data
this.npcStore;
this.regionStore;
this.motivationStore;
this.viceStore;
this.nameStore;

//constructor
this._constructor = function(){

	this._setupListSettings();
	this._setupGenerate();
	this._setupCloseButton();
	this._setupSortable();
}

/**
 *
 */
this._setupListSettings=function(){
	var that = this;

	$('.randomChartButton').click($.proxy(function(event){
		event.preventDefault();
		//console.log('clicked ListSettings',$(this).data('instance'));
		that._openListSettings($(this).data('instance'));
	}));
}

/**
 *
 */
this._openListSettings=function(key){
	//clean up existing dialogs

	var store;

	if(key==='Race' || key==='Disposition' || key==='Age' || key==='Gender'){
		store = this.npcStore;
	}else if(key==='Region'){
		store = this.regionStore;
	}
	var listSettings = new ListSettingsDialog(key,store);

	$(listSettings).on('apply',$.proxy(function(event,name,list){
		this.setSelect(name,list);
	},this));
}


/**
 *
 */
this._setupGenerate=function(){
	//generate click
	$('.generateButton').click($.proxy(function(event){
		event.preventDefault();
		//console.log('Clicked generate');
		this.generateNPC();
	},this));
}

/**
 *todo when you move mjs library change this method.
 */
this._setupCloseButton=function(){
	$('body').on('click','.closeButton',function(event){
		event.preventDefault();

		$(this).closest('.dialog,.npc').remove();
	});
}

/**
 *
 */
this._setupSortable=function(){
	$('.page').sortable({tolerance: "pointer",handle: ".handle"});
}

/**
 *
 */
this.generateNPC=function(data){

	var npc = new NPC();

	$(npc).on('loaded',$.proxy(function(event){
		if(data==undefined){
			this.fillOutNPC(npc);
		}else{
			this.loadNPC(npc,data);
		}
	},this));

	//$('.npc').removeClass('selected');
}

/**
 *
 */
this.loadNPC=function(npc,data){
	console.log('load npc',npc,data);
	var node = npc.getNode();

	npc.set('name',data.name);
	npc.set('race',data.race);
	npc.set('region',data.region);
	npc.set('gender',data.gender);
	npc.set('age',data.age);
	npc.set('disposition',data.disposition);

	node.find('.motivation ul').empty();
	for(var i=0,motivation;motivation=data.motivation[i];i++){
		node.find('.motivation ul').append('<li>'+motivation+'</li>');
	}

	node.find('.vice ul').empty();
	for(var i=0,vice;vice=data.vice[i];i++){
		node.find('.vice ul').append('<li>'+vice+'</li>');
	}

	node.find('.notes').val(data.notes);
}

/**
 *
 */
this.fillOutNPC=function(npc){
	//roll basic info
	var race = this._gather('race','Race',this.npcStore);
	npc.set('race',race);

	var region = this._gather('region','Region',this.regionStore);
	npc.set('region',region);

	var gender = this._gather('gender','Gender',this.npcStore);
	npc.set('gender',gender);

	var age = this._gather('age','Age',this.npcStore);
	npc.set('age',age);

	var disposition = this._gather('disposition','Disposition',this.npcStore);
	npc.set('disposition',disposition);

	//resolve motivations
	var motivationCount = $('.form input[name="motivationCount"]').val();
	this._gatherMotivation(npc.getNode(),motivationCount);

	//resolve motivations
	var viceCount = $('.form input[name="viceCount"]').val();
	this._gatherVice(npc.getNode(),viceCount);

	//resolve name
	this._gatherName(npc.getNode(),region,race,gender);
}

/**
 *
 */
this._gather=function(name,lookup,store){
	var value = '';
	//determine if random
	if($('select[name="'+name+'"]').val()=='Random'){
		//console.log('get random',name);
		value = store.getRandom(lookup);
	}else{
		value =$('select[name="'+name+'"]').val();
	}

	//console.log('attemping to set '+value+' for '+name);
	return value;
}

/**
 *
 */
this._gatherMotivation=function(npcNode,count){
	//empty the ul list
	npcNode.find('.motivation ul').empty();

	//check to see if motivation count is random
	if($('.form input[name="randomMotivationCount"]')[0].checked){
		//console.log('gatherMotivations randomize motivation count');
		count++;
		count = Math.floor(Math.random() * count);
	}
	
	for(var i=0;i<count;i++){
	//roll the store
		var base = this.motivationStore.getRandom('Base');
		var cause =  this.motivationStore.getRandom('Cause');

		npcNode.find('.motivation ul').append('<li>'+base+' '+cause+'</li>');
	}
}

/**
 *
 */
this._gatherVice=function(npcNode,count){

	//empty the ul list
	npcNode.find('.vice ul').empty();

	//check to see if vice count is random
	if($('.form input[name="randomViceCount"]')[0].checked){
		//console.log('gatherVice randomize vice count');
		count++;
		count = Math.floor(Math.random() * count);
	}
	
	for(var i=0;i<count;i++){
	//roll the store
		var modifier = this.viceStore.getRandom('Modifier');
		var vice =  this.viceStore.getRandom('Vice');

		npcNode.find('.vice ul').append('<li>'+modifier+' '+vice+'</li>');
	}
}

/**
 *
 */
this._gatherName=function(npcNode,region,race,gender){
	//console.log('NPC gather name',region,race,gender);

	//reset name
	npcNode.find('span.name').text(name.trim());

	this.nameStore.getRandom(region,race,function(npcNode, gender, lists){
		//console.log('get random name callback');
		var name='';
		var mre = /\bmale\b/i;
		var fre =/\bfemale\b/i; 

		for(var i=0;i<lists.length;i++){
			var value='';
			var count =lists[i].list.length; 
			var roll = Math.floor(Math.random() * count);

			//will require regular expression for word bounding and case insensitivity
			if(gender==='Female' && lists[i].name.search(mre) === -1){
				value = lists[i].list[roll]+' ';
			}else if(gender==='Male' && lists[i].name.search(fre) === -1){
				value = lists[i].list[roll]+' ';
			}


			name+=value;
		}

		npcNode.find('span.name').text(name.trim());
	}.bind(this,npcNode,gender));
}

/**
 *
 */
this.setSelect=function(name,data){
	//console.log('NPC setSelectUnique',name,data);
	var unique ={};

	$('select[name='+name+']').empty();
	$('select[name='+name+']').append('<option>'+'Random'+'</option>');

	for(var i=0;i<data.length;i++){
		if(unique[data[i]]===undefined){
			$('select[name='+name+']').append('<option>'+data[i]+'</option>');
			unique[data[i]]=true;
		}
	}
}

/**
 *
 */
this.getData=function(){
	//console.log('get data');
	var data={};
	var form = $('.form');

	data.region=form.find('select[name="region"]').val();
	data.race=form.find('select[name="race"]').val();
	data.gender=form.find('select[name="gender"]').val();
	data.age=form.find('select[name="age"]').val();
	data.disposition=form.find('select[name="disposition"]').val();
	data.randomMotivationCount = form.find('input[name="randomMotivationCount"]')[0].checked;
	data.motivationCount = form.find('input[name="motivationCount"]').val();

	data.randomViceCount = form.find('input[name="randomViceCount"]')[0].checked;
	data.viceCount = form.find('input[name="viceCount"]').val();

	return data;
	//console.log(data);
}

/**
 *
 */
this.loadForm=function(data){
	var form = $('.form');
	form.find('select[name="region"]').val(data.region);
	form.find('select[name="race"]').val(data.race);
	form.find('select[name="gender"]').val(data.gender);
	form.find('select[name="age"]').val(data.age);
	form.find('select[name="disposition"]').val(data.disposition);

	form.find('input[name="randomMotivationCount"]').prop('checked',data.randomMotivationCount);
	form.find('input[name="randomViceCount"]').prop('checked',data.randomViceCount);

	form.find('input[name="motivationCount"]').val(data.motivationCount);
	form.find('input[name="viceCount"]').val(data.viceCount);
}

/**
 *
 */
this.setData=function(data){
	console.log('set form Data',data);

	if(data.form){
		console.log('has form');
		this.loadForm(data.form);
	}

	if(data.npc && data.npc.length>0){
		console.log('has npc');
		for(var i=data.npc.length,npc;npc=data.npc[i-1];i--){
			this.generateNPC(npc);
		}
	}

	if(data.regionCustom && $.isEmptyObject(data.regionCustom)==false){
		console.log('has custom region data to load');
		this.regionStore.setCustom(undefined,data.regionCustom);
	}

	if(data.npcCustom && $.isEmptyObject(data.npcCustom)==false){
		console.log('has custom npc data to load');
		this.npcStore.setCustom(undefined,data.npcCustom)

	}
}


//main
	this._constructor();

}
