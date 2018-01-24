//BUDGET CONTROLLER
var budgetController = (function(){ // model
		var Expense = function(id, description, value){
			this.id = id;
			this.description =  description;
			this.value = value;
		}

		var Income = function(id, description, value){
			this.id = id;
			this.description =  description;
			this.value = value;
		}
		var calculateTotal = function(type){
			var sum = 0;
			data.allItems[type].forEach(function(cur){
				sum += cur.value;
			});
			data.totals[type] = sum;
		}
// Private Object to store data
		var data = {
				allItems:{
					exp: [],
					inc: []
				},
				totals:{
					exp:0,
					inc:0
				},
				budget:0,
				percentage: -1
			}

//Public
		return {

					addItem:function(type,des, val){
							var newItem, ID;
							if(data.allItems[type].length > 0){
							ID = data.allItems[type][data.allItems[type].length - 1].id +1;
						} else {
							ID = 0;
						}
							if(type === 'exp'){
								newItem = new Expense(ID, des,val);
							} else if(type === 'inc'){
								newItem = new Income(ID, des, val);
							}
							data.allItems[type].push(newItem);
							return newItem;
					},
					calculateBudget: function(){
						// calculate total income and expenses__list
						calculateTotal('exp');
						calculateTotal('inc');
						// calculate the budget: income - expenses
						data.budget = data.totals.inc - data.totals.exp;
						// calculate the percentage of income that we spent
						if(data.totals.inc > 0 && data.totals.inc >= data.totals.exp){
							data.percentage = Math.round( (data.totals.exp/data.totals.inc) *100); // round to the closes integer
						}else{
							data.percentage = -1;
						}
					},
					getBudget: function(){
						return{
							budget:data.budget,
							totalInc: data.totals.inc,
							totalExp: data.totals.exp,
							percentage: data.percentage
						};
					}
					,

					testing: function(){
						console.log(data);
					}

				};
		})();







// UI CONTROLLER
var UIController = (function(){ // view
			//PRIVATE
		var DOMstrings = {
			inputType:'.add__type',
			inputDescription: '.add__description'	,
			inputValue:'.add__value',
			inputBtn: '.add__btn',
			incomeContainer: '.income__list',
			expensesContainer: '.expenses__list',
			budgetLabel: '.budget__value',
			incomeLabel: '.budget__income--value',
			expensesLabel: '.budget__expenses--value',
			percentageLabel: '.budget__expenses--percentage'
		};


			//PUBLIC
			return{
					getInput: function() { // gets user input
							return {
							type: document.querySelector(DOMstrings.inputType).value,
							description: document.querySelector(DOMstrings.inputDescription).value,
							value: parseFloat(document.querySelector(DOMstrings.inputValue).value)// convert string to number
							};
					},
					addListItem: function(obj , type){// adding items to list
						var html, newHtml,element;
						// create html string with placeholder
						if(type === 'inc'){

								element = DOMstrings.incomeContainer;
								html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>'+
								'<div class="right clearfix"><div class="item__value">%value%</div>'+
								'<div class="item__delete"><button class="item__delete--btn">'+
								'<i class="ion-ios-close-outline"></i></button></div></div></div>';

						} else {
								element = DOMstrings.expensesContainer;
									// DOM manipulation
								html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>'+
								'<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>'+
								'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
						}

						// replace the placeholder text with some actual
						newHtml = html.replace('%id%',obj.id);
						newHtml = newHtml.replace('%description%', obj.description);
						newHtml = newHtml.replace('%value%', obj.value);
						//Insert the html into the DOM
						document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
					},

					clearFields: function (){ // clear the  fields
						var fields, fieldsArr;
						fields = document.querySelectorAll(DOMstrings.inputDescription + ','+ DOMstrings.inputValue); // returns a list
						// list is a bit simular to an array but not an array
						// In the array prototype we can find the slice method
						var fieldsArr = Array.prototype.slice.call(fields); // this produces a list
						// current element , current index, the origin array
						fieldsArr.forEach(function(current, index, array){// clear all the feilds
								current.value = "";
						 });
						 fieldsArr[0].focus(); // put the curse back to description
					},
					displayBudget: function(obj){
						document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
						document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
						document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
							if(obj.percentage > 0){
								document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
							}else {
								document.querySelector(DOMstrings.percentageLabel).textContent = '---';
							}
					}
					,
					getDOMstrings: function(){
						return DOMstrings;
					}

		};
})();








//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl){ // controll
	//PRIVATE
				var setupEventListeners = function(){ // event listener
									var DOM = UICtrl.getDOMstrings(); // gets the string from the UI
									document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

									document.addEventListener('keypress', function(event){
											if(event.keyCode === 13 || event.which === 13){
													ctrlAddItem();
											}
									});
						}
			var updateBudget = function(){
				// 5. Calculate the budget
				budgetCtrl.calculateBudget(); // calculate the budget, percentage, income and expense
				// 6. Return the budge
				var budget = budgetCtrl.getBudget(); //Objects to update UI
				// 7. Display the bidget on the UI
				UICtrl.displayBudget(budget);

			}

		var ctrlAddItem = function(){
												var input, newItem;
												// 1. get input data
											 	input = UICtrl.getInput();
												if(input.description !== "" && !isNaN(input.value) && input.value > 0){
													// 2. add the item to the budget CONTROLLER
													newItem = budgetCtrl.addItem(input.type, input.description, input.value);
													// 3. add the item to the ui
													UICtrl.addListItem(newItem, input.type) // sumbit html
													// 4. Clean inputfeild
													UICtrl.clearFields();
													// 5. Calculate and update budget
													updateBudget();
												}
										}
											//PUBLIC
											return  {
												init: function (){ // initialize function
													console.log('Application has ');
													setupEventListeners();
													UICtrl.displayBudget(// pass in empty object
														{
																budget:0,
																totalInc: 0,
																totalExp: 0,
																percentage:-1
														}
												);
												}
											};


})(budgetController, UIController);







//GLOBAL
controller.init();
