var Statusbar = function(){

	var dieALittleIndex = null;
   	var	updateHealthIndex = null;
    var	countDownIndex = null;

    function dieALittle() {
		if(this.score > 0) this.score--;
	}

	function updateHealth() {
		if(this.score > 80)
			$('#healthbar').css('background', "yellow");     
		else if(this.score < 30)
			$('#healthbar').css('background', "red");    
		else
			$('#healthbar').css('background', "white");
		$('#healthbar').css('width', this.score + "%");
	}

	// counts words and characters of post
	function wordCount() {
	  var content_text = $('#text').html().replace(/<\/div>/g, "").replace(/<div>/g, " ").replace(/<br>/g, ""),
	      char_count = content_text.length,
	      word_count = 0;
	      // if no characters, words = 0
	      if (char_count != 0) 
	        word_count = content_text.replace(/[^\w ]/g, "").split(/\s+/).length;
	  $('#wordcount').html(word_count);
	}

	function countDown() {
		if(this.seconds == 0 && this.minutes >= 0)
		{
			this.seconds = 59;
			this.minutes--;
		}
		else if (this.minutes == 0) return;
		else this.seconds--;

		$("#minutes").text(this.minutes);
		$("#seconds").text(this.seconds);
	}

	function start() {
		this.paused = false;
		$('#pausewrapper .circle').css('border', '2px solid grey');
		$('#pausewrapper .fa').css('color', 'grey');
		dieALittleIndex = window.setInterval(dieALittle.bind(this), this.deathBeat);
	    updateHealthIndex = window.setInterval(updateHealth.bind(this), this.updateSpeed);
	    countDownIndex = window.setInterval(countDown.bind(this), this.countDownSpeed);
	}

	return new Vue({

	  el: document.getElementById('statusbarwrapper'),

	  data: {
    	score : 50,    	
    	paused : true,
    	scoreIncr : 5,  	
    	deathBeat : 250,
    	updateSpeed : 100,
    	countDownSpeed : 1000,
    	backupSpeed : 3000,
    	minutes : 60,
   		seconds : 0,
   		locked: false
	  },

	  methods: {
	  	typedSomething : function(event) {
	  		wordCount.call(this);
			if(event.keyCode == 8 || event.keyCode == 18) 
				return; 
			else if(this.paused)
				start.call(this);		
			if(this.score < 100) 
				this.score = this.score + this.scoreIncr;
	  	},
	  	pause : function() {
			this.paused = true;
			$('#pausewrapper .circle').css('border', '2px solid white');
			$('#pausewrapper .fa').css('color', 'white');
			clearInterval(dieALittleIndex);
			clearInterval(updateHealthIndex);
			clearInterval(countDownIndex);
		},
		toggleLock: function(){
			this.locked = !this.locked;
		}
	  }
	});

};
