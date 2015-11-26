
var viewModel=new ViewModel();
function ViewModel() {
	var self=this;
	self.givers=ko.observableArray([
		new Giver("Patch"),
		new Giver("Eddie"),
		new Giver("Gary"),
		]);
	self.removeGiver=function(){
		self.clearGivees();
		self.givers.remove(this);
	};
	self.addGiver=function(){
		self.clearGivees();
		self.givers.push(new Giver("Person 1"));
	};
	self.clearGivers=function(){
		self.givers.removeAll();
	}
	self.clearGivees=function(){
		for (var i=0;i<self.givers().length;i++){
			self.givers()[i].givingTo("");
		}
	}
	self.giverNames=function(){
		allGiverNames=new Array();
		for (var i=0;i<self.givers().length;i++){
			allGiverNames.push(self.givers()[i].name());
		}
		return allGiverNames;
	}
	self.giveeNames=function(){
		allGiveeNames=new Array();
		for (var i=0;i<self.givers().length;i++){
			allGiveeNames.push(self.givers()[i].givingTo());
		}
		return allGiveeNames;
	}
	self.randomGiveeForGiver=function(giver,pool){
		var trimmedPool=giver.trimGiveePool(pool);
		var randIndex = Math.floor(Math.random() * trimmedPool.length);
		var givee=trimmedPool[randIndex];
		return findIndexOf(givee,pool);		
	}

	self.everyoneGetsAGift=function(){
		var allGiveeNames=self.giveeNames();
		for (var i=0;i<self.givers().length;i++){
			var thisGiver=self.givers()[i];
			if (findIndexOf(thisGiver.name(),allGiveeNames)<0){
				return false;
			}
		}
		return true;
	}
	
	self.draw=function(){
		var firstRun=true;
		while (self.everyoneGetsAGift() == false || firstRun){		
			firstRun=false;
			var giverPool=self.giverNames();
			for (var i=0;i<self.givers().length;i++){
				var thisGiver=self.givers()[i];
				var giveeIndex=self.randomGiveeForGiver(thisGiver,giverPool);
				self.givers()[i].givingTo(giverPool[giveeIndex]);
				giverPool.splice(giveeIndex,1);			
			}
		}
	}
}

function findIndexOf(object,array){
	for (var i=0;i<array.length;i++){
		if (array[i]==object){
			return i;
		}
	}
	return -1;
}

function Giver(name){
	this.name=ko.observable(name);
	this.exclusion=ko.observable("");
	this.givingTo=ko.observable("");
	this.editing=ko.observable(false);
	this.addingExclusion=ko.observable(false);
	this.edit = function(){
		this.editing(true)
	}
	this.addExclusion = function(){
		this.addingExclusion(true);
	}
	this.trimGiveePool=function(pool){
		var trimmedPool=new Array();
		for (var i=0;i<pool.length;i++){
			if (pool[i] != this.name() && pool[i] != this.exclusion()){
				trimmedPool.push(pool[i]);
			}
		}
		return trimmedPool;
	}
}
ko.applyBindings(viewModel);