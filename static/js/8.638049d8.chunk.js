(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{473:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a.n(n),l=a(16),o=a(10),s=a(11),i=a(13),c=a(12),u=a(14),p=(a(182),a(183)),m=a(0),h=a.n(m),f=a(39),d=a.n(f),b=(a(202),a(203)),k=a.n(b),v=(a(204),a(205)),g=a.n(v),w=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(i.a)(this,Object(c.a)(t).call(this,e))).state={funDumps:[],loading:!0},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"getFunDumps",value:function(){var e=Object(l.a)(r.a.mark(function e(){var t,a,n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t="https://poolpeek.com/api.asp?k=838967e9-940b-42db-8485-5f82a72a7e17"+this.props.query,e.next=3,fetch(t);case 3:return a=e.sent,e.next=6,a.json();case 6:n=e.sent,this.setState({funDumps:n.poolpeek.funDumps,loading:!1});case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=Object(l.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:window.scrollTo(0,0),this.getFunDumps();case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return this.state.loading?h.a.createElement("div",null,"loading..."):h.a.createElement(p.a,{className:"FunDumpPage",title:this.props.title},h.a.createElement("div",null," 500 random small pools with less than 100 blocks and less than 10 million in active stake.",h.a.createElement("br",null),"Click the navigation option again to pull a different set of 500 random pools.",h.a.createElement("br",null),"We support the true decentralization of the Cardano network and believe small pools are a vital part of it.",h.a.createElement("br",null),h.a.createElement("br",null)),this.state.funDumps.map(function(e,t){return h.a.createElement("div",{key:t}," ",h.a.createElement("img",{src:g.a,className:"pr-2",width:"28",height:"25"}),h.a.createElement("a",{target:"_blank",href:e.homepage},d()(e.dump_text)),h.a.createElement("a",{href:"https://pool.pm/"+e.pool_id,target:"_blank",rel:"noreferrer"},h.a.createElement("img",{src:k.a,className:"pr-2",title:"pool.pm"})),h.a.createElement("span",null,e.location))}),h.a.createElement("br",null),h.a.createElement("br",null))}}]),t}(h.a.Component);t.default=w}}]);
//# sourceMappingURL=8.638049d8.chunk.js.map