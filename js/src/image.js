var BackgroundImage = function(){

	return new Vue({

	  el: document.getElementById('backgroundImage'),

	  data: {
    	image: null,
    	file: null,
    	backgroundOpacity: 0.7
	  },

	  methods: {
	  	set: function(image, file)
	  	{
	  		this.image = image;
	  		this.file = file;
	  	},
	  	remove: function()
		{
			this.image = null;
	  		this.file = null;
		},
		hasImage: function()
		{
			this.image !== null;
		}
	  }	
	});
};





