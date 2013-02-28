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
				
				this.listenTo(MyApp.vent , 'addressInit' , this.addressChange)
				
			}, 
			
			updateCount : function () { 
					
				this.ui.count.html(this.collection.length + " results")	
				
			} , 
			
			addressChange : function (val) {
				
				this.ui.searching_for.html("Searching for . . . <strong>" + val + "</strong>")	
				
			} , 
			
			updateSearchFor : function () { 
				
				this.ui.error.removeClass("show").addClass("hidden"); 
				
				
				
				var val = this.ui.search_box.val()
				
				this.addressChange(val)
			
			}, 

			ui : {

				search_box : ".query" , 
				
				count : ".count" , 
				
				searching_for : ".searching-for", 
				
				error_msg : '.alert-box p', 
				
				error : '.error'

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
			
			search : function() { 
				
				var val = this.ui.search_box.val()
				
				if (val === '') {
					
					this.ui.error_msg.html("Address cannot be blank"); 
					
					console.log(this.ui.error)
					
					this.ui.error.removeClass("hidden").addClass("show");
					
					return false
					
				}
				
				Backbone.history.navigate('address/' + val , {trigger: true})
				
				

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
		
		emptyResult  = Marionette.ItemView.extend({
			
			template : '#empty-result'
			
		})		
		
		Views.Complaint = Marionette.ItemView.extend({

		  template: '#complaint-template' , 
		
		  className : "item-row"
	

		});

		Views.Complaints  = Marionette.CollectionView.extend({

			itemView : Views.Complaint , 
			
			emptyView : emptyResult

		})	
		
	})
	
	MyApp.Router = Marionette.AppRouter.extend({
		
		
		
		appRoutes : {
			
			"address/:address" : "fetchNew" 
			
		}
		
		
	})
	
	MyApp.Controller = Marionette.Controller.extend({ 
		
		initialize : function() { 
			
			this.bldgs = new MyApp.Buildings.Collection();	
			
			
		
		} , 
		
		start : function() { 
			
			this.showHeader(this.bldgs); 
			
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
		} , 
		
		fetchNew : function (val) { 
			
			this.bldgs.reset();

			var options = {

				update: true,

				data : {address : val}

			}

			this.bldgs.fetch(options)
			
			this.showMain(this.bldgs);
			
			MyApp.vent.trigger("addressInit" , val)
		
		
		}
		
		
	})
	
	
	MyApp.addInitializer(function() { 
	
		var controller = new MyApp.Controller(); 
		
		var router = new MyApp.Router({
			
			controller : controller
			
		})
		
		controller.start();
		
	})
	
	MyApp.start()
	
})

