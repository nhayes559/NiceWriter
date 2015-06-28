var Themes = function(){

	return new Vue({

	  el: document.getElementById('themelayer'),

	  data: {
    	themes: db('themes').cloneDeep()[0] || [], //This should be loaded from localStorage
    	open: false,
    	showingThemes: false,
    	styles: Styles
	  },

	  methods: {

	  	addTheme: function(event)
	  	{
	  		this.themes.push(new Theme());
	  		this.select(this.themes.length - 1);
	  		this.saveThemes();
	  	},
	  	hasThemes: function(event)
	  	{
	  		if(this.themes.length !== 0)
	  			return true;
	  		else return false;
	  	},
	  	addThemeWithImage: function(image)
	  	{
	  		var theme = new Theme();
	  		theme.image = image;
			this.themes.push(theme);
	  		this.select(this.themes.length - 1);
	  		this.saveThemes();
	  	},
	  	removeTheme: function(index)
		{
			swal({   title: "Are you sure?",   
					 text: "This theme will be permanently deleted.",   
					 type: "warning",   
					 showCancelButton: true,   
					 confirmButtonColor: "#DD6B55",   
					 confirmButtonText: "Yes, delete it!",   
					 closeOnConfirm: true },
				  function(isConfirm){   
					  if (isConfirm) {     
					  	  this.themes.splice(index, 1);
					  	  if(this.themes[0]){
					  	  	if(this.themes[0].image){
						  	  	NiceWriter.BackgroundImage.set(this.themes[0].image, 
									this.themes[0].file);
						  	  }
						  	  this.saveThemes();
							  this.select(0);
					  	  }
					  }
				 }.bind(this));
		},
		updateTheme: function(event)
		{
			for (var i = this.themes.length - 1; i >= 0; i--)
				this.themes[i].selected = false;
			this.saveThemes();
		},
		addImage: function(image)
		{
			for (var i = this.themes.length - 1; i >= 0; i--)
				if(this.themes[i].selected){
					this.themes[i].image = image;
				}
			this.saveThemes();
		},
		select: function(index)
		{
			if(this.themes[index]){
				for (var i = this.themes.length - 1; i >= 0; i--)
					this.themes[i].selected = false;
			
				this.themes[index].selected = true;

				if(this.themes[index].image)
					NiceWriter.BackgroundImage.set(this.themes[index].image, 
						this.themes[index].file);
				else 
					NiceWriter.BackgroundImage.remove();

				NiceWriter.App.currentTheme = this.themes[index];
			} else {
				for (var i = this.themes.length - 1; i >= 0; i--)
					if(this.themes[i].selected)
						this.select(i);
			}
			this.saveThemes();
		},
		toggleThemes: function()
		{
			this.showingThemes = !this.showingThemes;
			this.changeThemeSettingsViewWithDelay();
		},
		hideThemes: function()
		{
			this.showingThemes = false;
			this.changeThemeSettingsViewWithDelay();
		},
		changeThemeSettingsViewWithDelay: function(){
			setTimeout(function() {
			    for (var i = this.themes.length - 1; i >= 0; i--) {
					this.themes[i].viewSettings = false;
				};
				this.saveThemes();
			}.bind(this), 500);
		},
		setFontStyle: function(theme)
		{
			theme.fontStyle = event.currentTarget.selectedOptions[0].text;
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setFontSize: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setFontColour: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setBackgroundColour: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setLineSpacing: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setParagraphSpacing: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			NiceWriter.App.updateStyleSheetRuleForParagraphSpacing();
			this.saveThemes();
		},
		setBackgroundOpacity: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			NiceWriter.BackgroundImage.backgroundOpacity = theme.backgroundOpacity;
			this.saveThemes();
		},
		setEditorOpacity: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setTextHeight: function(theme)
		{
			NiceWriter.App.currentTheme = theme; 
			this.saveThemes();
		},
		setTextWidth: function(theme)
		{
			NiceWriter.App.currentTheme = theme;
			this.saveThemes();
		},
		clearChanges : function()
		{
			swal({   title: "Are you sure?",   
					 text: "This theme will be reset to the default theme.",   
					 type: "warning",   
					 showCancelButton: true,   
					 confirmButtonColor: "#DD6B55",   
					 confirmButtonText: "Reset!",   
					 closeOnConfirm: true },
				  function(isConfirm){   
					  if (isConfirm) {     
					  	  for (var i = this.themes.length - 1; i >= 0; i--)
							if(this.themes[i].selected){
								this.themes.$set(i, new Theme());
								this.themes[i].viewSettings = true;
								NiceWriter.App.currentTheme = this.themes[i];
								this.select(i); 
							}
					  }
				 }.bind(this));	
			this.saveThemes();
		},
		saveThemes : function()
		{
			db('themes').remove();
	  		db('themes').push(this.themes);
		}
	  }	
	});

};





