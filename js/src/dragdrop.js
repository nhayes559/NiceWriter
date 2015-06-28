var Dragdrop = function(){

	 if(window.FileReader) {
		 drop = document.getElementById('app');
		 dropwrapper = $(document.getElementById('dropwrapper'));
		 var startedDragendChecker = false;
		 var dragendCount = 1;

		 return new Vue({

		  el: document.getElementById('themelayer'),

		  data: {

		  },

		  methods: {
		  	dragenter: function(e) {
		      if (e.preventDefault) { e.preventDefault(); }
		      if(!startedDragendChecker) this.startDragendChecker();
		      return false;
		    },

		    startDragendChecker: function(e) {
		      startedDragendChecker = true;
		      var dragendCheckerTimer = window.setInterval(function() {
		      	if(dragendCount <= 0){
		      		window.clearInterval(dragendCheckerTimer);
		      		dropwrapper.removeClass('dragging');
		      		startedDragendChecker = false;
		      	} 
		      	dragendCount--;
		      }, 500);
		    },

		    dragover: function(e) {
		      if (e.preventDefault) { e.preventDefault(); }
		      dropwrapper.addClass('dragging');
		      dragendCount = 1;
		      return false;
		    },

		    drop: function(e) {
		      e = e || window.event; // get window.event if e argument missing (in IE)
			  if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

			  dropwrapper.removeClass('dragging');

			  var dt    = e.dataTransfer;
			  var files = dt.files;
			  for (var i=0; i<files.length; i++) {
				    var file = files[i];
				    var reader = new FileReader();

				    reader.onloadend = function(evt) {

					    var image           = this.result;
					    var newFile       = document.createElement('div');
					    drop.appendChild(newFile);
					    var fileNumber = drop.getElementsByTagName('div').length;
					    status.innerHTML = fileNumber < files.length
					                     ? 'Loaded 100% of file '+fileNumber+' of '+files.length+'...'
					                     : 'Done loading. processed '+fileNumber+' files.';

					    if(NiceWriter.BackgroundImage.image){
					    	swal({   title: "Make a new theme?",     
					    			 type: "warning", 
					    			 showCancelButton: true,
					    			 cancelButtonText: "No, update my current theme.", 
					    			 confirmButtonColor: "#32CD32",   
					    			 confirmButtonText: "Yes.",   
					    			 closeOnConfirm: true
					    		 }, 
					    		 function(isConfirm){
					    		 	if(isConfirm){
					    		      NiceWriter.BackgroundImage.set(image, file);
					    			  NiceWriter.Themes.addThemeWithImage(NiceWriter.BackgroundImage.image);
					    			} else {
					    		 	  NiceWriter.BackgroundImage.set(image, file);
					    			  NiceWriter.Themes.addImage(NiceWriter.BackgroundImage.image); 
					    		    }
						    	});
					    } else {
					    	NiceWriter.BackgroundImage.set(image, file);
					    	NiceWriter.Themes.addImage(NiceWriter.BackgroundImage.image);		  
					    } 

					};
				    reader.readAsDataURL(file);
			  }
			  return false;
		    }

		  }
		});
	 } 
	 else return {};
}