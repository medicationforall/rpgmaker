/**
 *   M-RPG Maker source file ListSettingsDialog,
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

function ListSettingsDialog(key,store){

//data
this.store;

//constructor
this._constructor = function(){
	this.key=key
	this.store=store;

	this._resolveTemplate();	

}

/**
 *
 */
this._resolveTemplate=function(){
	$.get('html/randomChartDialog.html',$.proxy(function(data){
		var dialog =$(data.trim()).insertBefore('.page');
		this._setupForm(dialog);
	},this));
}

/**
 *
 */
this._setupForm=function(dialog){
		var dialog = dialog.addClass(this.key);

		this._setupHandle(dialog);
		this._setupList(dialog);
		this._setupAddEntry(dialog);
		this._setupInlineEdit(dialog);
		this._setupApply(dialog);
		this._setupReset(dialog);
		this._offsetDialogs();
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
this._setupList=function(dialog,ignoreCustom){
		var list=store.get(this.key,ignoreCustom);

		/*if(ignoreCustom!==true && store.getCustom(this.key)){
			list = store.getCustom(this.key);
		}*/

		console.log(list);

		var listNode = dialog.find('ol').empty();

		for(var i=0;i<list.length;i++){
			listNode.append('<li><span class="entryText">'+list[i]+'</span></li>');
		}

		listNode.sortable();
}

/**
 *
 */
this._setupAddEntry=function(dialog){
	dialog.find('.addEntryButton').click(function(event){
		event.preventDefault();
		console.log('clicked add entry button');
		var entryInput = dialog.find('input[name="entry"]');

		//gather text
		var text = entryInput.val().trim();

		if(text!==''){
			dialog.find('ol').append('<li><span class="entryText">'+text+'</span></li>');

			//reset entry input
			entryInput.val('');
			entryInput.focus();
		}
	});

	dialog.on('keypress','.entryInput',function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13') {
			console.log('pressed enter');
			dialog.find('.addEntryButton').trigger('click');
			//addItem.trigger('click');    
		}
	});
}

/**
 *
 */
this._setupInlineEdit=function(dialog){
	//create inline edit controls
	dialog.on('click','.entryText',function(event){
		var template = '<div class="inlineEdit">'+
		'<input class="entryEdit" type="text" value="'+$(this).text()+'" />'+
		'<div class="editControls">'+
		'<a href="" class="entryEditButton" title="Apply">+</a>'+
		'<a href="" class="entryDeleteButton" title="Delete">X</a>'+
		'</div>'+
		'</div>';

		$(this).css('display','none');
		$(this).after(template);
	});

	//note apply click
	dialog.on('click','.entryEditButton',function(event){
		event.preventDefault();
		console.log('clicked note edit button');
		//var listGroup = $(this).closest('.listGroup');

		var inlineEdit = $(this).closest('.inlineEdit');
		var nameText = $(inlineEdit).prev('.entryText');
		var noteEdit = inlineEdit.find('.entryEdit');

		
		nameText.text(noteEdit.val()).css('display','block');
		inlineEdit.remove();		
	});

	//name input enter key press
	dialog.on('keypress','.entryEdit',function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13') {
			console.log('pressed enter');
			$(this).closest('.inlineEdit').find('.entryEditButton').trigger('click');
			
			//addItem.trigger('click');    
		}
	});

	//note delete click
	dialog.on('click','.entryDeleteButton',function(event){
		event.preventDefault();
		console.log('clicked note delete button');
		
		var inlineEdit = $(this).closest('.inlineEdit');
		var nameText = $(inlineEdit).prev('.entryText');
		
		inlineEdit.remove();
		nameText.closest('li').remove();
	});
}

/**
 *
 */
this._setupApply=function(dialog){
	dialog.find('.applyButton').click($.proxy(function(event){
		event.preventDefault();
		console.log('clicked apply button');


		var arr = dialog.find('.entryText').map(function(i, el) {
			return $(el).text();
		}).get();

		this.store.setCustom(this.key,arr);

		dialog.find('.closeButton').trigger('click');

		$(this).trigger('apply',[this.key.toLowerCase(),arr]);
	},this));
}

/**
 *
 */
this._setupReset=function(dialog){
	dialog.find('.resetButton').click($.proxy(function(event){
		event.preventDefault();
		console.log('clicked reset button');

		this._setupList(dialog,true);
	},this));
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
