$(function () {
	
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
	
	var complaint_template = " <h3><%= descriptor %></h3>"; 
	
	var complaint = Backbone.View.extend({
		
		template : _.template(complaint_template), 
		
		tagName : "div", 
		
		initialize : function(options) {
			
			this.model.bind('destroy', this.remove, this);
			
		} , 
		
		
		render : function(model) {
			

			this.$el.html(this.template(this.model.toJSON())); 
 
			return this;

		}
		
		
	})

	var complaints = Backbone.View.extend({
		
		collection : bldgs , 
		
		initialize : function(options) { 
			
			this.el = options.el;
			
		
			bldgs.bind('add' , this.addItem , this)
			
			bldgs.bind('reset' , this.clearList , this)
			
		} ,
		
		addItem : function(model , collection , options) {
			
			var view = new complaint({
				
				model : model
				
			}) ; 
			
			console.log(view.render().el)
			
			this.$el.append(view.render().el)		
			
		}  , 
		
		clearList : function () {
			
			this.$el.html("")

		}
		
		

	}); 
	
	

	var form = new searchForm({	el : $("#searchBox")}); 
	
	var complaints_list = new complaints({el : $("#complaints")})
	
	
	
})

