(window.webpackJsonp=window.webpackJsonp||[]).push([[36,12,34],{347:function(e,t,n){var content=n(358);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(34).default)("86c96cfe",content,!0,{sourceMap:!1})},349:function(e,t,n){var content=n(373);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(34).default)("8a05f920",content,!0,{sourceMap:!1})},351:function(e,t,n){"use strict";n.r(t);var r={props:{iconName:{type:String,default:"box"},iconColor:{type:String,default:"currentColor"}},computed:{wrapperSize:function(){var e={XS:15,S:30,default:60},t={mouse:"S","drosophila-melanogaster":"S"};return t[this.iconName]?e[t[this.iconName]]:e.default}}},o=(n(357),n(47)),component=Object(o.a)(r,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"svg_wrapper"},[t("img",{style:{width:"".concat(e.wrapperSize,"px"),height:"".concat(e.wrapperSize,"px")},attrs:{src:n(352)("./".concat(e.iconName,".svg")),alt:e.iconName}})])}),[],!1,null,"b0008706",null);t.default=component.exports},352:function(e,t,n){var map={"./arabidopsis-thaliana.svg":353,"./drosophila-melanogaster.svg":354,"./human.svg":355,"./mouse.svg":356,"./refex-logotype.svg":239};function r(e){var t=o(e);return n(t)}function o(e){if(!n.o(map,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return map[e]}r.keys=function(){return Object.keys(map)},r.resolve=o,e.exports=r,r.id=352},353:function(e,t,n){e.exports=n.p+"img/arabidopsis-thaliana.d38717a.svg"},354:function(e,t,n){e.exports=n.p+"img/drosophila-melanogaster.4bb3568.svg"},355:function(e,t,n){e.exports=n.p+"img/human.f329da4.svg"},356:function(e,t,n){e.exports=n.p+"img/mouse.ede1bea.svg"},357:function(e,t,n){"use strict";n(347)},358:function(e,t,n){var r=n(33)((function(i){return i[1]}));r.push([e.i,".svg_wrapper[data-v-b0008706]{align-items:center;display:flex;height:60px;justify-content:center;width:60px}",""]),r.locals={},e.exports=r},372:function(e,t,n){"use strict";n(349)},373:function(e,t,n){var r=n(33)((function(i){return i[1]}));r.push([e.i,".dropdown_list[data-v-45c5a412]{background-color:#fff;box-shadow:0 5px 15px -5px #3e4652;cursor:auto;display:none;left:0;list-style-type:none;min-width:200px;padding:10px;position:absolute;top:100%;z-index:999}.isOpenDataset[data-v-45c5a412],.isOpenType[data-v-45c5a412]{display:block}.isOpenDataset>.active_type[data-v-45c5a412]:hover,.isOpenType>.active_type[data-v-45c5a412]:hover{background-color:#488ec4;border-radius:5px;color:#fff;cursor:pointer}.isOpenDataset>li[data-v-45c5a412],.isOpenType>li[data-v-45c5a412]{align-content:center;border-bottom:1px solid #fff;color:#000;display:flex}.isOpenDataset>li>svg[data-v-45c5a412],.isOpenType>li>svg[data-v-45c5a412]{align-self:center;font-size:18px;width:30px}.isOpenDataset>li .svg_wrapper[data-v-45c5a412],.isOpenType>li .svg_wrapper[data-v-45c5a412]{margin-right:10px}.isOpenDataset>li .option_wrapper[data-v-45c5a412],.isOpenType>li .option_wrapper[data-v-45c5a412]{max-width:300px;min-width:200px}.isOpenDataset>li .tag_wrapper[data-v-45c5a412],.isOpenType>li .tag_wrapper[data-v-45c5a412]{display:flex;flex-wrap:wrap;width:100%}.isOpenDataset>li .specie_name[data-v-45c5a412],.isOpenType>li .specie_name[data-v-45c5a412]{margin:0;padding-bottom:2px}.isOpenDataset>li .dataset_name[data-v-45c5a412],.isOpenType>li .dataset_name[data-v-45c5a412]{background:#488ec4;border-radius:5px;color:#fff;cursor:pointer;display:inline-block;margin:0 3px 3px 0;padding:5px;white-space:nowrap}.isOpenDataset>li .dataset_name[data-v-45c5a412]:hover,.isOpenType>li .dataset_name[data-v-45c5a412]:hover{background:#095493}",""]),r.locals={},e.exports=r},378:function(e,t,n){"use strict";n.r(t);n(35),n(30),n(48),n(59),n(36),n(60);var r=n(22),o=(n(15),n(236),n(99)),c=n(351),d=n(76);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function v(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var f={components:{IconBase:c.default},props:{getPageType:{type:String,default:""},isOpenDataset:{type:Boolean,default:!1},isOpenType:{type:Boolean,default:!1}},data:function(){return{species:o,selectedProject:o.reduce((function(e,t){return e[t.species_id]=t.datasets[0].dataset,e}),{})}},computed:v({},Object(d.b)({activeDataset:"active_dataset",activeSpecie:"active_specie"})),created:function(){this.setSpecie(this.activeSpecie.species_id)},mounted:function(){window.addEventListener("click",this.closeDropDown)},methods:v(v({},Object(d.c)({setSpecie:"set_specie",setActiveDataset:"set_active_dataset"})),{},{updateSpecie:function(e,t){this.setSpecie(e),this.updateActiveDataset(t)},updateActiveDataset:function(e){this.setActiveDataset(this.activeSpecie.datasets.find((function(t){return t.dataset===e})))}})},_=(n(372),n(47)),component=Object(_.a)(f,(function(){var e=this,t=e._self._c;return t("div",[t("ul",{directives:[{name:"show",rawName:"v-show",value:e.isOpenDataset,expression:"isOpenDataset"}],staticClass:"dropdown_list",class:{isOpenDataset:e.isOpenDataset}},e._l(e.species,(function(n){return t("li",{key:n.species_id},[t("icon-base",{attrs:{"icon-name":n.species_id}}),e._v(" "),t("div",{staticClass:"option_wrapper"},[t("div",{staticClass:"specie_name"},[e._v(e._s(n.species))]),e._v(" "),t("div",{staticClass:"tag_wrapper"},e._l(n.datasets,(function(r){return t("span",{key:r.dataset,staticClass:"dataset_name",on:{click:function(t){return e.updateSpecie(n.species_id,r.dataset)}}},[e._v(e._s(r.label))])})),0)])],1)})),0),e._v(" "),t("ul",{directives:[{name:"show",rawName:"v-show",value:e.isOpenType,expression:"isOpenType"}],staticClass:"dropdown_list",class:{isOpenType:e.isOpenType}},[t("li",{staticClass:"active_type",on:{click:function(t){return e.$store.commit("set_active_filter","gene")}}},[t("font-awesome-icon",{attrs:{icon:"dna"}}),e._v(" "),t("p",[e._v("Gene")])],1),e._v(" "),t("li",{staticClass:"active_type",on:{click:function(t){return e.$store.commit("set_active_filter","sample")}}},[t("font-awesome-icon",{attrs:{icon:"flask"}}),e._v(" "),t("p",[e._v("Sample")])],1)])])}),[],!1,null,"45c5a412",null);t.default=component.exports},398:function(e,t,n){var content=n(433);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(34).default)("f6e238a6",content,!0,{sourceMap:!1})},432:function(e,t,n){"use strict";n(398)},433:function(e,t,n){var r=n(33)((function(i){return i[1]}));r.push([e.i,".nav_wrapper[data-v-4db55006]{margin:0;position:sticky;top:0;z-index:2}.nav_wrapper .nav_area[data-v-4db55006]{background-color:#488ec4;display:flex;height:70px;list-style-type:none;margin:0;padding:0 20px;width:100%}.nav_wrapper .nav_area>li[data-v-4db55006]{color:#fff;cursor:pointer;display:flex;padding-left:10px;position:relative}.nav_wrapper .nav_area>li.isOpenDataset[data-v-4db55006],.nav_wrapper .nav_area>li.isOpenDataset .nav_frame.-after[data-v-4db55006],.nav_wrapper .nav_area>li.isOpenType[data-v-4db55006],.nav_wrapper .nav_area>li.isOpenType .nav_frame.-after[data-v-4db55006],.nav_wrapper .nav_area>li[data-v-4db55006]:hover,.nav_wrapper .nav_area>li:hover .nav_frame.-after[data-v-4db55006]{background-color:#095493}.nav_wrapper .nav_area>li[data-v-4db55006]:nth-child(n+2){padding-left:30px}.nav_wrapper .nav_area>li[data-v-4db55006]:nth-child(3){cursor:auto}.nav_wrapper .nav_area>li>.nav_frame.-before[data-v-4db55006]{background:#fff;right:-20px;width:50px}.nav_wrapper .nav_area>li>.nav_frame.-after[data-v-4db55006],.nav_wrapper .nav_area>li>.nav_frame.-before[data-v-4db55006]{-webkit-clip-path:polygon(75% 0,100% 50%,75% 100%,0 100%,0 50%,0 0);clip-path:polygon(75% 0,100% 50%,75% 100%,0 100%,0 50%,0 0);height:100%;position:absolute;z-index:1}.nav_wrapper .nav_area>li>.nav_frame.-after[data-v-4db55006]{background-color:#488ec4;right:-18px;width:20px;width:50px}.nav_wrapper .nav_area>li>svg[data-v-4db55006]{font-size:24px}.nav_wrapper .nav_area>li>.nav_item[data-v-4db55006]{align-content:center;display:grid;grid-template-columns:auto 1fr;z-index:2}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper[data-v-4db55006]{-webkit-box-orient:vertical;-webkit-line-clamp:3;display:-webkit-box;overflow:hidden}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>.title[data-v-4db55006]{font-size:12px;font-weight:700}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>form>.specie_select[data-v-4db55006]{color:#3e4652}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>p[data-v-4db55006]{font-weight:700;position:relative}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>p>svg[data-v-4db55006]{font-size:12px;padding-left:4px}.nav_wrapper .nav_area>li>.nav_item>svg[data-v-4db55006]{align-self:center;font-size:24px}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper[data-v-4db55006]{align-self:flex-end;flex-direction:column;font-size:18px;margin:0 5px}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>p[data-v-4db55006]{margin:0}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>form[data-v-4db55006]{margin-left:-4px}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>form>.specie_select[data-v-4db55006]{font-width:normal;background:#f5f7f9;background:none;border:none;border-radius:.2rem;cursor:pointer;font-size:22px;font-size:inherit;padding:0;transition:.6s;width:70%;width:auto}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>form>.specie_select[data-v-4db55006]:focus{outline:none}.nav_wrapper .nav_area>li>.nav_item>.specie_wrapper>form>.specie_select[data-v-4db55006]:hover{background-color:#488ec4;color:#fff;transition:all .3s}",""]),r.locals={},e.exports=r},474:function(e,t,n){"use strict";n.r(t);var r={components:{LocalNavigationDropdown:n(378).default},props:{activeFilterName:{type:String,default:""},getPageType:{type:String,default:""},isOpenType:{type:Boolean,default:!1}},data:function(){return{}},computed:{},mounted:function(){},methods:{}},o=(n(432),n(47)),component=Object(o.a)(r,(function(){var e=this,t=e._self._c;return t("li",{class:{isOpenType:e.isOpenType},on:{click:function(t){return t.stopPropagation(),e.$emit("eventUpdateIsOpenType")}}},[t("div",{staticClass:"nav_item"},["gene"===e.activeFilterName?t("font-awesome-icon",{attrs:{icon:"dna"}}):e._e(),e._v(" "),"sample"===e.activeFilterName?t("font-awesome-icon",{attrs:{icon:"flask"}}):e._e(),e._v(" "),t("div",{staticClass:"specie_wrapper"},[t("p",[e._v("\n        "+e._s(e.$firstLetterUppercase(e.activeFilterName))),"index"===e.getPageType&&e.isOpenType?t("font-awesome-icon",{attrs:{icon:"fa-angle-down"}}):"index"!==e.getPageType||e.isOpenType?e._e():t("font-awesome-icon",{attrs:{icon:"fa-angle-up"}})],1)])],1),e._v(" "),t("div",{staticClass:"nav_frame -before"}),e._v(" "),t("div",{staticClass:"nav_frame -after"}),e._v(" "),t("local-navigation-dropdown",{attrs:{"is-open-type":e.isOpenType}})],1)}),[],!1,null,"4db55006",null);t.default=component.exports}}]);