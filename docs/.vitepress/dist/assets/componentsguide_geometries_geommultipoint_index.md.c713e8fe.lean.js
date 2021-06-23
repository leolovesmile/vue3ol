import{r as n,d as a,o as s,c as t,w as p,b as o,a as e,g as l}from"./app.6d9b5d69.js";const c={setup:()=>({center:n([116.54875,40.45064]),projection:n("EPSG:4326"),zoom:n(17),rotation:n(0),radius:n(10),strokeWidth:n(4),strokeColor:n("red"),fillColor:n("white")})};c.render=function(n,e,l,c,u,i){const k=a("ol-view"),r=a("ol-source-osm"),g=a("ol-tile-layer"),d=a("ol-geom-multi-point"),m=a("ol-style-fill"),f=a("ol-style-stroke"),h=a("ol-style-circle"),q=a("ol-style"),y=a("ol-feature"),v=a("ol-source-vector"),w=a("ol-vector-layer"),_=a("ol-map");return s(),t(_,{loadTilesWhileAnimating:!0,loadTilesWhileInteracting:!0,style:{height:"400px"}},{default:p((()=>[o(k,{ref:"view",center:c.center,rotation:c.rotation,zoom:c.zoom,projection:c.projection},null,8,["center","rotation","zoom","projection"]),o(g,null,{default:p((()=>[o(r)])),_:1}),o(w,null,{default:p((()=>[o(v,null,{default:p((()=>[o(y,null,{default:p((()=>[o(d,{coordinates:[[116.544921,40.451633],[116.545264,40.451649],[116.545865,40.451698],[116.546144,40.451551],[116.546337,40.451274],[116.546788,40.451143],[116.547324,40.451078],[116.547539,40.450996],[116.547839,40.450719],[116.54844,40.450506],[116.548933,40.450604],[116.549448,40.450604],[116.550242,40.450376],[116.550865,40.450163],[116.551702,40.449935],[116.552581,40.449576]]},null,8,["coordinates"]),o(q,null,{default:p((()=>[o(h,{radius:c.radius},{default:p((()=>[o(m,{color:c.fillColor},null,8,["color"]),o(f,{color:c.strokeColor,width:c.strokeWidth},null,8,["color","width"])])),_:1},8,["radius"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})};const u=e('',6),i=o("h2",{id:"properties"},[o("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),l(" Properties")],-1),k=o("h1",{id:"coordinates"},[o("a",{class:"header-anchor",href:"#coordinates","aria-hidden":"true"},"#"),l(" coordinates")],-1),r=o("ul",null,[o("li",null,[o("strong",null,"Type"),l(": "),o("code",null,"number[][]"),l(" An array of points in units of the map's projection.")])],-1),g='{"title":"ol-geom-multi-point","description":"","frontmatter":{},"headers":[{"level":2,"title":"Usage","slug":"usage"},{"level":2,"title":"Properties","slug":"properties"}],"relativePath":"componentsguide/geometries/geommultipoint/index.md","lastUpdated":1624436079438}',d={};const m=Object.assign(d,{expose:[],setup:function(n){return(n,a)=>(s(),t("div",null,[u,o(c),i,k,r]))}});export default m;export{g as __pageData};