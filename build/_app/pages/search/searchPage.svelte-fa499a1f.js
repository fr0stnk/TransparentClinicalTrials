import{S as s,i as a,s as e,e as r,t,k as c,j as o,c as n,a as h,g as p,d as i,n as l,m as f,b as d,f as m,H as u,o as $,x as g,K as v,u as T,Y as P,v as b,P as B,X as j,Z as y,V as D}from"../../chunks/vendor-bbfa0731.js";import E from"./ConditionSearchBar.svelte-15a08dc3.js";/* empty css                                                       */import{s as k}from"../../chunks/stores-e4e5fbd7.js";/* empty css                                                               */import w from"./TagsSearchBar.svelte-89b05f8e.js";function S(s){let a,e,B,k,S,x,A,H,I,N,V,_,C,K,M,O;return x=new E({props:{searchTips:s[0]}}),x.$on("searchTermPassed",s[3]),H=new w({props:{searchTags:s[1]}}),{c(){a=r("main"),e=r("h1"),B=t("Поиск РКИ"),k=c(),S=r("div"),o(x.$$.fragment),A=c(),o(H.$$.fragment),I=c(),N=r("a"),V=r("button"),_=t("Искать"),this.h()},l(s){a=n(s,"MAIN",{class:!0});var r=h(a);e=n(r,"H1",{class:!0});var t=h(e);B=p(t,"Поиск РКИ"),t.forEach(i),k=l(r),S=n(r,"DIV",{class:!0});var c=h(S);f(x.$$.fragment,c),A=l(c),f(H.$$.fragment,c),c.forEach(i),I=l(r),N=n(r,"A",{href:!0});var o=h(N);V=n(o,"BUTTON",{class:!0});var d=h(V);_=p(d,"Искать"),d.forEach(i),o.forEach(i),r.forEach(i),this.h()},h(){d(e,"class","svelte-6oeatg"),d(S,"class","searchWindow svelte-6oeatg"),d(V,"class","searchButton svelte-6oeatg"),d(N,"href",C=`./${s[2]}`),d(a,"class","svelte-6oeatg")},m(s,r){m(s,a,r),u(a,e),u(e,B),u(a,k),u(a,S),$(x,S,null),u(S,A),$(H,S,null),u(a,I),u(a,N),u(N,V),u(V,_),O=!0},p(s,[a]){const e={};1&a&&(e.searchTips=s[0]),x.$set(e);const r={};2&a&&(r.searchTags=s[1]),H.$set(r),(!O||4&a&&C!==(C=`./${s[2]}`))&&d(N,"href",C)},i(s){O||(g(x.$$.fragment,s),g(H.$$.fragment,s),v((()=>{M&&M.end(1),K=j(a,D,{y:40,duration:325}),K.start()})),O=!0)},o(s){T(x.$$.fragment,s),T(H.$$.fragment,s),K&&K.invalidate(),M=P(a,y,{duration:0}),O=!1},d(s){s&&i(a),b(x),b(H),s&&M&&M.end()}}}const x=async({fetch:s})=>{const a=await s("https://demo-db-server-master.herokuapp.com/cancers");return{props:{DB:await a.json()}}};function A(s,a,e){let r;B(s,k,(s=>e(2,r=s)));let{searchProps:t}=a,{DB:c}=a,{searchTips:o=[]}=a,{searchTags:n=[]}=a;c.forEach((s=>{o.push(s.condition)})),c.forEach((s=>{n.push(s.interventions,s.city,s.phase)}));let{spreadedProps:h={searchProps:t,DB:c}}=a;return s.$$set=s=>{"searchProps"in s&&e(5,t=s.searchProps),"DB"in s&&e(6,c=s.DB),"searchTips"in s&&e(0,o=s.searchTips),"searchTags"in s&&e(1,n=s.searchTags),"spreadedProps"in s&&e(4,h=s.spreadedProps)},[o,n,r,function(s){e(4,h.searchProps=s.detail.passedSearchTerm,h)},h,t,c]}class H extends s{constructor(s){super(),a(this,s,A,S,e,{searchProps:5,DB:6,searchTips:0,searchTags:1,spreadedProps:4})}}export{H as default,x as load};