# vancards

输出一副扑克牌  
使用方法：引入后添加属性deckout即可获取一副牌（不支持大小王）


var deck=require('vancards')

deckmain=deck.deckout.shuffle();

var hand = deck.deal(13).sort(Card.orderBySuit);
