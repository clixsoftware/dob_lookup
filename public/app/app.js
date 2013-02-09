$(function () {
	
	MyApp = new Backbone.Marionette.Application(); 
	
	MyApp.addRegions({
		
		header : "#header", 
		
		main : "#main"
		
	})
	
	MyApp.on("initialize:after" , function() {
		
		Backbone.history.start()
		
	})
	
	_.templateSettings = {
		
	  interpolate : /\{\{(.+?)\}\}/g
	
	};
	
	MyApp.module('Buildings', function(Buildings, App, Backbone, Marionette, $, _) {
		
		Buildings.Model = Backbone.Model.extend({

			idAttribute : 'unique_key'

		}); 

		Buildings.Collection = Backbone.Collection.extend({

			model : Buildings.Model  , 

			url : 'building/' 	

		});	
		
	}) 
	
	MyApp.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {
		
		Layout.Header = Backbone.Marionette.Layout.extend({

			template : "#template-header", 

			ui : {

				search_box : ".query"

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

				this.collection.reset()

				if (e !== undefined && e !== null ) {

					e.preventDefault();

				}

				var val = this.ui.search_box.val()

				this.collection.fetch({ update: true,  data : {address : val}   })

			}

		})
		
	})

	MyApp.module('Views', function(Views, App, Backbone, Marionette, $, _) {		
		
		Views.Complaint = Marionette.ItemView.extend({

		  template: '#complaint-template'


		});

		Views.Complaints  = Marionette.CollectionView.extend({

			itemView : Views.Complaint

		})	
		
	})
	
	MyApp.Router = Marionette.AppRouter.extend({
		
		
	})
	
	MyApp.Controller = function() { 
		
		this.bldgs = new MyApp.Buildings.Collection();
		
	}
	
	_.extend(MyApp.Controller.prototype, {
		
		start : function() { 
			
			this.showHeader(this.bldgs); 
			
			this.showMain(this.bldgs); 
			
		} , 
		
		showHeader : function(collection) { 
			
			var header = new MyApp.Layout.Header({
				
				collection : collection
				
			})
			
			MyApp.header.show(header)
			
		}, 
		
		showMain : function(collection) { 
			
			var listView = new MyApp.Views.Complaints({
				
				collection : collection
				
			})
			
			MyApp.main.show(listView)
		}
			
	})
	
	MyApp.addInitializer(function() { 
	
		var controller = new MyApp.Controller(); 
		
		new MyApp.Router({
			
			controller : controller
			
		})
		
		controller.start();
	
		
	})
	
	MyApp.start()
	
})

