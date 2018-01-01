//定义原型继承
function inherit(p){
	if (p==null) throw TypeError();
	if (Object.create) return Object.create(p);
	var t = typeof p;
	if (t!=="object" && t!=="function") throw TypeError();
	function f(){};
	f.prototype =p;
	return new f();
}

//定义枚举类型
function enumeration(namesToValues){
	var enumeration =function(){throw "Can't Instantiate Enumerations!"}
	var proto = enumeration.prototype ={
		constructor : enumeration,
		toString:function(){ return this.name },
		valueOf:function(){ return this.value },
		toJSON:function(){ return this.name}
	}

	enumeration.values = [];
	for(name in namesToValues){
		var e = inherit(proto);
		e.name = name;
		e.value = namesToValues[name];
		enumeration[name]= e;
		enumeration.values.push(e);
	}
	enumeration.foreach = function(f, c){
		for(var i=0; i<this.values.length; i++) f.call(c, this.values[i]);
	}
	return enumeration;
}


//定义一个玩牌的类
function Card(suit, rank){
	this.suit = suit;
	this.rank = rank;
}

//使用枚举类型定义花色和点数
Card.Suit = enumeration({Clubs:1, Diamonds:2, Hearts:3, Spades:4});
Card.Rank = enumeration({Two:2, Three:3, Four:4, Five:5, Six:6, Seven:7, Eight:8, Nine:9, Ten:10, Jack:11, Queen:12, King:13, Ace:14});
//定义用于描述牌面的文本
Card.prototype.toString = function (){
	return this.rank.toString()+" of "+this.suit.toString();
}
//比较扑克牌中两张牌的大小
Card.prototype.compareTo = function (that){
	if(this.rank < that.rank) return -1;
	if(this.rank > that.rank) return 1;
	return 0;
}
//以扑克牌的玩法规则对牌的顺序进行排序的函数
Card.orderByRank = function (a, b){
	return a.compareTo(b);
}
//以桥牌的玩法规则对牌进行排序
Card.orderBySuit = function (a, b){
	if (a.suit < b.suit) return -1;
	if (a.suit > b.suit) return 1;
	if (a.rank < b.rank) return -1;
	if (a.rank > b.rank) return 1;
	return 0;
}
//定义用以表示一副扑克牌的类
function Deck(){
	var cards = this.cards =[];
	Card.Suit.foreach(function (s){
		Card.Rank.foreach(function(r){
			cards.push(new Card(s, r));
		});
	});
}
//洗牌的方法：重新洗牌并返回洗好的牌
Deck.prototype.shuffle = function(){
	//遍历数组中的每个元素，随机找出最小的牌，并与之交换
	var deck = this.cards, len = deck.length;
	for (var i = len-1; i>0; i--){
		var r = Math.floor(Math.random()*(i+1)), temp;
		temp = deck[i], deck[i] = deck[r], deck[r] = temp;
	}
	return this;
}
//发牌的方法
Deck.prototype.deal = function (n){
	if (this.cards.length < n) throw "Out of cards";
	return this.cards.splice(this.cards.length-n, n);
}

var deck = (new Deck()).shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);

module.exports={deckout:(new Deck())}
