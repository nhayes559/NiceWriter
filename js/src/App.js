//Some theming constants
var Theme = function(){
	return {
		"selected" : true,
		"image" : null,
		"file" : null,
		"name": "Unnamed",
		"fontStyle" : "Open Sans",
		"fontSize" : "13px",
		"fontColour" : "white",
		"backgroundColour" : "rgb(60,60,60)",
		"lineSpacing" : "18px",
		"paragraphSpacing" : "5px",
		"backgroundOpacity" : 0.7,
		"editorOpacity" : 0.5,
		"textHeight" : "96%",
		"textWidth" : "50%",
		"viewSettings" : false
	}
};
var Styles = [ 
		"Arial", 
		"Courier", 
		"Courier New", 
		"HelveticaNeue", 
	    "Helvetica",
		"Open Sans",
		"Times New Roman",
		"Trench" 
];

//
var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
var db;	
//Is this Node.js?
if(isNode) {
	//Lowdash json database, saves Themes.json to the filesystem.
	var low = require('lowdb');
	db = low('Themes.json');
}
else {
	//Make do with localStorage via store.js for themes
	db = function(name){
		return {
			cloneDeep : function(){
				return [store.get(name)];
			},
			remove : function(){
				store.set(name, null);
			},
			push : function(val){
				store.set(name, val);
			}
		}
	}
}

//View models
NiceWriter                 = {};
NiceWriter.BackgroundImage = new BackgroundImage();
NiceWriter.Statusbar       = new Statusbar();
NiceWriter.Themes          = new Themes(); 
NiceWriter.Dragdrop        = new Dragdrop();

//Wiring for shared events
function typedSomething(event){
	NiceWriter.Statusbar.typedSomething(event);
	NiceWriter.App.hideFadeEffect(event);
}
function imageDrop(event){
	event.preventDefault();
	NiceWriter.Dragdrop.drop(event);
}
function imageDragenter(event){
	event.preventDefault();
	NiceWriter.Dragdrop.dragenter(event);
}
function imageDragover(event){
	event.preventDefault();
	NiceWriter.Dragdrop.dragover(event);
}
function mouseOverApp(event){
	NiceWriter.App.mouseOverApp(event);
}
function mouseOverText(event){
	NiceWriter.App.mouseOverText(event);
}
document.onkeydown = function(keypress) {
    keypress = keypress || window.event;
    if (keypress.keyCode == 27) {
        NiceWriter.App.hideThemes();
    }
};

//Custom filters
Vue.filter('hasImage', function (theme) {
  return theme.image !== null;
});

//Top level view with bound properties
NiceWriter.App = new Vue({

  el: document.getElementById('app'),

  data: {
	showingThemes: false,
	faded: false,
	lessfaded: false,
	currentTheme: new Theme(),
  },

  methods: {
  	toggleThemes: function(event)
  	{
  		this.showingThemes = !this.showingThemes;
  		NiceWriter.Themes.toggleThemes();
  	},
  	hideThemes: function(event)
  	{
  		this.showingThemes = false;
  		NiceWriter.Themes.hideThemes();
  	},
  	mouseOverApp : function(event)
  	{
  		this.faded = true;
  		this.lessfaded = false;
  	},
  	mouseOverText : function(event)
  	{
  		this.lessfaded = true;
  		this.faded = false;
  	},
  	hideFadeEffect : function(event)
  	{
  		this.lessfaded = false;
  		this.faded = false;
  	},
  	//evil
  	updateStyleSheetRuleForParagraphSpacing : function()
  	{
  		var mysheet=document.styleSheets[0];
		var myrules=mysheet.cssRules? mysheet.cssRules: mysheet.rules;
		if(myrules){
			for (i=0; i<myrules.length; i++){
				if(myrules[i].selectorText.toLowerCase()=="#text div"){
					myrules[i].style.paddingTop = this.currentTheme.paragraphSpacing;
					break;
				}
			}	
		}
  	}
  }	
});
//If there are no saved themes, select the starting theme to get things moving.
if(!NiceWriter.Themes.themes.length === 1){
	NiceWriter.Themes.select(0);
} else NiceWriter.Themes.select();


