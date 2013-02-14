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
		
	  	evaluate:    /\{\{(.+?)\}\}/g,
	
		interpolate: /\{\{=(.+?)\}\}/g
	
	};
	
	MyApp.module('Buildings', function(Buildings, App, Backbone, Marionette, $, _) {
		
		Buildings.Model = Backbone.Model.extend({

			idAttribute : 'unique_key', 
			
			defaults : {
				
				closed_date : null
				
			}
			
			

		}); 

		Buildings.Collection = Backbone.Collection.extend({

			model : Buildings.Model  , 

			url : 'building/' 	 
			
		});	
		
	}) 
	
	MyApp.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {
		
		Layout.Header = Backbone.Marionette.Layout.extend({

			template : "#template-header", 
			
			initialize : function(options) {
				
				this.listenTo(this.collection , 'sync' , this.updateCount )
				
				this.listenTo(this.collection , 'request' , this.updateSearchFor )
				
			}, 
			
			updateCount : function () { 
					
				this.ui.count.html(this.collection.length + " results")	
				
			} , 
			
			updateSearchFor : function () { 
				
				this.ui.searching_for.html("Searching for . . . <strong>" + this.ui.search_box.val() + "</strong>")	
			
			}, 

			ui : {

				search_box : ".query" , 
				
				count : ".count" , 
				
				searching_for : ".searching-for"

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
				
				var options = {
					
					update: true,
					
					data : {address : val}
					
				}
				
				this.collection.fetch(options)

			}

		}) ; 
		
		Layout.Main = Backbone.Marionette.Layout.extend({
			
			template : "#template-main", 
			
			regions : {
				
				list : '#complaintList'
				
			} , 
			
			initialize : function(options) {

				this.listenTo(this.collection , "request" , this.loadStart); 
				
				this.listenTo(this.collection , "sync" , this.sync); 
				
				this.listenTo(this.collection , "error" , this.error); 
				

			},
			
			onRender : function() {
				
				var listView = new MyApp.Views.Complaints({
				
					collection : this.collection
				
				})
				
				this.list.show(listView)
				
			} , 
			
			/// Requests can be slow, added loader functionality

			loadStart : function() { 

				this.$(".list").removeClass("show").addClass("hidden"); 
								
				this.$(".error").removeClass("show").addClass("hidden"); 
				
				this.$(".loader").removeClass("hidden").addClass("show");

			} , 

			sync : function () { 

				this.$(".loader").removeClass("show").addClass("hidden")
				
				this.$(".list").removeClass("hidden").addClass("show")

			} , 

			error : function () { 
				
				this.$(".loader").removeClass("show").addClass("hidden")

				this.$(".error").removeClass("hidden").addClass("show")

			} 
			
		})
		
	})

	MyApp.module('Views', function(Views, App, Backbone, Marionette, $, _) {		
		
		Views.Complaint = Marionette.ItemView.extend({

		  template: '#complaint-template' , 
		
		  className : "item-row"
	

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
			
			var main = new MyApp.Layout.Main({
										
				collection : collection
										
			})
			
			
			MyApp.main.show(main)
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

