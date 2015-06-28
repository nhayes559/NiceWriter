var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
var isNodeWebkit = false;
	
//Is this Node.js?
if(isNode) {
  //If so, test for Node-Webkit
  try {
	    isNodeWebkit = (typeof require('nw.gui') !== "undefined");

	    //textract, for dealing with various filetypes
		var textract = require('textract');

	    if(!store.get('openRecent'))
	    	store.set('openRecent', []);
	    if(store.get('currentFile'))
	    	$('#text').html(store.get('currentFile'));
	    var openRecentMenu;

	    $(function() {
		  function Menu(cutLabel, copyLabel, pasteLabel, saveLabel) {
		    var gui = require('nw.gui')
		      , menu = new gui.Menu()

		      , cut = new gui.MenuItem({
		        label: cutLabel || "Cut"
		        , click: function() {
		          document.execCommand("cut");
		          console.log('Menu:', 'cut to clipboard');
		        }
		      })

		      , copy = new gui.MenuItem({
		        label: copyLabel || "Copy"
		        , click: function() {
		          document.execCommand("copy");
		          console.log('Menu:', 'copied to clipboard');
		        }
		      })

		      , paste = new gui.MenuItem({
		        label: pasteLabel || "Paste"
		        , click: function() {
		          document.execCommand("paste");
		          console.log('Menu:', 'pasted to textarea');
		        }
		      })
		    ;

		    menu.append(cut);
		    menu.append(copy);
		    menu.append(paste);

		    return menu;
		  }

		  var menu = new Menu(/* pass cut, copy, paste labels if you need i18n*/);
		  $(document).on("contextmenu", function(e) {
		    e.preventDefault();
		    menu.popup(e.originalEvent.x, e.originalEvent.y);
		  });
	  });

	  var gui = require('nw.gui');
	  win = gui.Window.get();
	  var nativeMenuBar = new gui.Menu({ type: "menubar" });
	  try {
			nativeMenuBar.createMacBuiltin("My App");
			var fileMenu = createFileMenu();
			nativeMenuBar.insert(fileMenu, 1);

			win.menu = nativeMenuBar;
	  } catch (ex) {
			console.log(ex.message);
	  }

	  function createFileMenu() {
	  		var fileMenu = new gui.MenuItem({ label: 'File'});
			var submenu = new gui.Menu();

			submenu.append(
				new gui.MenuItem(
					{ label: 'New',
					  click: function(){
					  	swal({   title: "Save changes?",   
							 text: "Do you want to save your changes to the current document?",   
							 type: "warning",   
							 showCancelButton: true,   
							 confirmButtonColor: "#DD6B55",   
							 confirmButtonText: "Save.",
							 cancelButtonText: "No thanks.",   
							 closeOnConfirm: true },
						  function(isConfirm){   
							  if (isConfirm) {     
							  	  saveFile('#export_file', $(text).text());
							  	  $('#text').empty();
							  }
							  else
							  {
							  	 $('#text').empty();
							  }
						}.bind(this));	
					  }
					})
				);
			submenu.append(
				new gui.MenuItem(
					{ label: 'Open...',
					  click: function(){
					  	openFileDialog('#open_file');
					  }
					})
				);

			openRecentMenu = new gui.MenuItem(
					{ label: 'Open Recent',
					  click: function(){
					  	openFileDialog('#open_file');
					  }
				});
			submenu.append(openRecentMenu);
			rebuildOpenRecentSubMenu();

			submenu.append(
				new gui.MenuItem(
					{ label: 'Save',
					  click: function(){
					  	//TODO for now just matches save as. Need
					  	//to check if the file's already been saved.
					  	saveFile('#export_file', $(text).text());
					  }
					})
				);
			submenu.append(
				new gui.MenuItem(
					{ label: 'Save As',
					  click: function(){
					  	saveFile('#export_file', $(text).text());
					  }
					})
				);
			fileMenu.submenu = submenu;
			return fileMenu;
	  }

	  function saveFile(name, data) {
	    var chooser = document.querySelector(name);
	    chooser.addEventListener("change", function(evt) {
	        var fs = require('fs');
			fs.writeFile(this.value, data, function(err) {
			    if(err) alert("error"+err);
			    store.set('currentFile', $(text).text());
			    addFileToRecentlyOpened();			    
			});
	    }, false);
	    chooser.click();  
	  }

	  function addFileToRecentlyOpened() {
	  	var file = $("#export_file")[0].files[0];
	  	if(file) {
	  		if(store.get('openRecent').length === 10)
				store.set('openRecent', 
					store.get('openRecent').slice(0, -1).unshift(file.path)
				);
			else
				store.set('openRecent', 
					store.get('openRecent').concat(file.path)
				);
			rebuildOpenRecentSubMenu();
	  	}		
	  }

	  function rebuildOpenRecentSubMenu() {
	  	var submenu = new gui.Menu();
	  	 $.each(store.get('openRecent'), function(value, item){
	  	 	submenu.append(
				new gui.MenuItem(
					{ label: item,
					  click: function(){
					  	openFile(item);
					  }
				})
			);
	  	 });
	     openRecentMenu.submenu = submenu;		
	  }

	  function openFile(path) {
	  	fs = require('fs')
		fs.readFile(path, 'utf8', function (err, data) {
		  if (err) {
		    return console.log(err);
		  }
		  $('#text').text(data);
		});
	  }

	  function openFileDialog(name) {
	    var chooser = document.querySelector(name);
	    chooser.addEventListener("change", readFileFromDialog, false);
	    chooser.click(); 
	  }

	  function readFileFromDialog(evt) {
	    var f = evt.target.files[0]; 
	    if (f) {
	      var r = new FileReader();
	      r.onload = function(e) { $('#text').text(e.target.result); }
	      r.readAsText(f);
	    } else { 
	      alert("Failed to load file");
	    }
	  }

	  document.getElementById('fileinput').addEventListener('change', readFileFromDialog, false);
	  
	  setInterval(function () { 
	  	store.set('currentFile', $(text).text()); 
	  }, 10000);


  } catch(e) {
    isNodeWebkit = false;
  }
}

