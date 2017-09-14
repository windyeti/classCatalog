function Container() {
	this.id = '';
	this.className = '';
	this.htmlCode = '';
}
Container.prototype.render = function() {
	return this.htmlCode
}
function Basket() {
	Container.call(this);

	this.id = 'basket';
	this.countGoods = 0;
	this.amount = 0;
	this.goodItems = [];
}
Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;
Basket.prototype.render = function(wrapper) {
	this.$divBasket = $('<div>').attr({
			id: this.id
		}).text('Корзина');

	this.$divBasket.appendTo(wrapper);

	this.getGoodItems();
}
Basket.prototype.getGoodItems = function() {
	$.ajax({
		url : '/basket.goods.json',
		dataType : 'json',
		context : this,
		success : function(data) {
			if(data.result == 1) {
				this.countGoods = data.basket.length;
				this.amount = parseInt(data.amount);
				this.goodItems = data.basket;

				this.$divData = $('<div>').attr({'class' : 'div-data'});
				this.$divData.append( $('<p>').attr({'class' : 'count-good'}).text('Всего товаров в корзине: ' + this.countGoods) )
				this.$divData.append( $('<p>').attr({'class' : 'amount'}).text('На сумму: ' + this.amount) )
				this.$divData.appendTo(this.$divBasket);

			} else {
				console.log('что-то на сервере не так');
			}
		},
		error : function(err) {
			console.log(err.message)
		}
	});
}
Basket.prototype.add = function(idGood, quantity, price) {
	this.countGoods += quantity;
	this.amount += +price;
	this.goodItems.push({
		id_product : idGood,
		price : price
	});
	this.refresh();
}
Basket.prototype.refresh = function() {
	this.$divData.empty();
	this.$divData.append( $('<p>').attr({'class' : 'count-good'}).text('Всего товаров в корзине: ' + this.countGoods) )
	this.$divData.append( $('<p>').attr({'class' : 'amount'}).text('На сумму: ' + this.amount) )
	this.$divData.appendTo(this.$divBasket);
}
// //= _partials/review.js
// function Container() {
// 	this.id = '';
// 	this.className = '';
// 	this.htmlCode = ''
// }
// Container.prototype.render = function() {
// 	return this.htmlCode;
// }
function Catalog() {
	Container.call(this);

	this.id = 'catalogGoods';
	this.goods = [];
}
Catalog.prototype = Object.create(Container.prototype);
Catalog.prototype.constructor = Catalog;

Catalog.prototype.render = function(wrapper_catalog) {
	this.$divCatalog = $('<div>').attr({'id':this.id}).text('Каталог');
	this.$divCatalog.appendTo(wrapper_catalog);
	this.getGoods();
}
Catalog.prototype.getGoods = function() {
	$.ajax({
		url : 'catalog.json',
		dataType : 'json',
		context : this,
		success : function(data) {
			if(data.result != 1) {
				console.log('что-то не так на сервере');
				return
			}
			this.goods = data.goods;
			this.renderGoods(this.goods)
		}
	})
}
Catalog.prototype.renderGoods = function(goods) {
	var self = this;
	$(goods).each(function() {
	var	$divGood = $('<div>').attr({'id' : 'product_' + this.id_product, 'class' : 'good'});
	var	$divName = $('<div>').attr({'class' : 'product_name'}).text(this.name);
	var	$divPrice = $('<div>').attr({'class' : 'product_price'}).text(this.price + ' руб.');
	var	$divReviews = $('<div>').attr({'class' : 'product_reviews'}).text('Отзывы');
	$('<div>').attr({'class' : 'product_addNewReview'}).text('Добавить отзыв').appendTo($divReviews);
		$(this.reviews).each(function() {
		var	$divReview = $('<div>').attr({'class' : 'product_review'});
			( $('<span>').attr({'class' : 'product_submit'}).text(this.submit) ).appendTo($divReview);
			( $('<span>').attr({'class' : 'product_addPlus'}).text('+') ).appendTo($divReview);
			( $('<span>').attr({'class' : 'product_delete'}).text('-') ).appendTo($divReview);
			( $('<span>').attr({'class' : 'product_textAbout'}).text(this.textAbout) ).appendTo($divReview);

			$divReview.appendTo($divReviews);
		});

		$divName.appendTo($divGood);
		$divPrice.appendTo($divGood);
		$divReviews.appendTo($divGood);
		$('<button>').attr({'class' : 'product_button_buy'}).text('Купить').appendTo($divGood);
		$divGood.appendTo(self.$divCatalog);
	});
	$('.good').on('click','.product_addNewReview', function() {
		this.idProductorAddNewReview = $(this).closest('.good').attr('id').split('_')[1];
		catalog.addNewReview(this.idProductorAddNewReview);
});
}
Catalog.prototype.addNewReview = function(id_product) {
	this.$divModale = $('<div>').attr({'class':'modale'}).text('Введите текст отзыва.');
	this.$formModale = $('<form>').attr({'class':'form_modale'});
	( $('<input>').attr({'type':'text','class':'input_modale'}) ).appendTo(this.$formModale);
	( $('<button>').attr({'class':'button_modale'}).text('OK') ).appendTo(this.$formModale);
	this.$divModale.append( this.$formModale );
	this.$divModale.appendTo( $('body') );

	this.goodForAddNewReview = $(this.goods).filter(function() {
		return this.id_product == id_product;
	});

	var self = this;

		$('.modale').on('click','.button_modale', function(e) {
		e.preventDefault();
		self.newReviewText = $(this).parent().find('.input_modale').val();
		self.$divModale.empty();
		var $blockReviews = $('#product_' + id_product + ' .product_reviews');

		var	$blockReview = $('<div>').attr({'class' : 'product_review'});
			( $('<span>').attr({'class' : 'product_submit'}).text('0') ).appendTo($blockReview);
			( $('<span>').attr({'class' : 'product_addPlus'}).text('+') ).appendTo($blockReview);
			( $('<span>').attr({'class' : 'product_delete'}).text('-') ).appendTo($blockReview);
			( $('<span>').attr({'class' : 'product_textAbout'}).text(self.newReviewText) ).appendTo($blockReview);

		$blockReview.appendTo($blockReviews);
		// var $newReview = $()

		
	});
}
// Catalog.prototype.modale = function() {
// 		console.log(this.newReviewText);
// }

var catalog = new Catalog();
catalog.render('#catalog-wrapper');
//# sourceMappingURL=main.js.map
