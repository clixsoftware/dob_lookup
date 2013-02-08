$(function () {
	
	_.templateSettings = {
	  interpolate : /\{\{(.+?)\}\}/g
	};
	
	//console.log($("#searchBox a.button").attr("class"))
	
	var bldgModel = Backbone.Model.extend({

		idAttribute : 'unique_key'

	}); 

	var bldgsCollection = Backbone.Collection.extend({

		model : bldgModel  , 
		
		url : 'building/' , 
		
		initialize : function () { 
			
			
		
			this.on('add' ,  function (item , collection , options) {
				
				//console.log("adding")
				
			})

		}	


	}); 
	
	bldgs = new bldgsCollection(); 
	

	var searchForm = Backbone.View.extend({
		

		initialize : function(options) { 
			
			this.el = options.el	
			
		}, 

		events : {

			'click .submit' : 'search', 
			
			'keypress .query' : 'handleKeypress'

		}, 
		
		handleKeypress : function(e) {
			
			if (e.keyCode === 13) {
				
				this.search()
			}
			
		} , 

		search : function(e) { 
			
			bldgs.reset()
			
			if (e !== undefined && e !== null ) {
				
				e.preventDefault();
				
			}
			
			
			var val = this.$('.query').val()
			
			bldgs.fetch({ update: true,  data : {address : val}   })

		}


	})
	 
	
	var complaint = Marionette.ItemView.extend({
		
	  template: '#complaint-template' , 
	
	
	});
	
	
	var complaints = Marionette.CollectionView.extend({
		
		itemView : complaint
		
	})


	var form = new searchForm({	el : $("#searchBox")}); 
	
	var complaints_list = new complaints({el : $("#complaints") , collection : bldgs})
	
	
	
})

