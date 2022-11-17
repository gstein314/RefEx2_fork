(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{112:function(e){e.exports=JSON.parse('[{"species":"Human","search_conditions":[{"label":"Gene Name","examples":["transcription factor"]},{"label":"Symbol","examples":["ITG"]},{"label":"Summary","examples":["Breast cancer"]}],"datasets":[{"dataset":"humanFantom5","label":"FANTOM5","gene":{"key":"ncbiGeneId","header":"NCBI Gene ID","url_prefix":"http://identifiers.org/ncbigene/","item_comparison_example":[{"route":"5460,6657,9314,4609","label":"Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)"}]},"sample":{"filter":[{"column":"SampleTypeCategory","label":"Sample type","note":"FANTOM5","is_checkbox":true,"is_displayed":true,"is_ontology":false},{"column":"ExperimentCategory","label":"Experiment","note":"FANTOM5","is_checkbox":true,"is_displayed":false,"is_ontology":false},{"column":"UberonLabel","label":"Tissue","note":"UBERON","is_checkbox":false,"examples":["skin","liver"],"is_displayed":true,"is_ontology":true},{"column":"ClLabel","label":"Cell type","note":"Cell Ontology","is_checkbox":false,"examples":["macrophage","hepatocyte"],"is_displayed":true,"is_ontology":true},{"column":"NcitLabel","label":"Disease","note":"NCI Thesaurus","is_checkbox":false,"examples":["osteosarcoma","Down syndrome"],"is_displayed":true,"is_ontology":true},{"column":"DevelopmentalStage","label":"Developmental stage","note":"","is_checkbox":true,"is_displayed":false,"is_ontology":false},{"column":"Sex","label":"Sex","note":"","is_checkbox":true,"is_displayed":false,"is_ontology":false}],"item_comparison_example":[{"route":"RES00001676,RES00001677,RES00001678","label":"Adipocyte differentiation"},{"route":"RES00001672,RES00001673,RES00001674,RES00001675","label":"Adipocytes from various tissues"},{"route":"RES00001984,RES00001985","label":"NK T cell leukemia cell line vs NK T cell"}],"search_conditions":[{"label":"Sample Name","examples":["liver","lung"]}]}},{"dataset":"gtexV8","label":"GTEx","gene":{"key":"ensemblGeneId","header":"Ensembl Gene ID","url_prefix":"http://identifiers.org/ensembl/","item_comparison_example":[{"route":"ENSG00000204531,ENSG00000181449,ENSG00000136826,ENSG00000136997","label":"Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)"}]},"sample":{"filter":[{"column":"Tissue","label":"Tissue","note":"","is_checkbox":true,"is_displayed":true,"is_ontology":false},{"column":"TissueCategory","label":"Tissue category","note":"","is_checkbox":true,"is_displayed":false,"is_ontology":false},{"column":"TissueSubcategory","label":"Tissue subcategory","note":"","is_checkbox":true,"is_displayed":false,"is_ontology":false},{"column":"Sex","label":"Sex","note":"","is_checkbox":true,"is_displayed":true,"is_ontology":false},{"column":"Age","label":"Age","note":"","is_checkbox":true,"is_displayed":true,"is_ontology":false}],"item_comparison_example":[{"route":"RES00002931,RES00002801,RES00002755,RES00002733,RES00002592,RES00002992,RES00002769,RES00002700,RES00002788,RES00002540,RES00002568,RES00002953","label":"Lung (comparison among different ages and sexes)"},{"route":"RES00003699,RES00003684","label":"Sun exposed skin vs Not sun exposed skin"}],"search_conditions":[{"label":"Sample Name","examples":["liver","lung"]}]}}]},{"species":"Mouse","search_conditions":[{"label":"Gene Name","examples":["transcription factor"]},{"label":"Symbol","examples":["ITG"]},{"label":"Summary","examples":["Breast cancer"]}],"datasets":[{"dataset":"mouseFantom5","label":"FANTOM5","gene":{"key":"ncbiGeneId","header":"NCBI Gene ID","url_prefix":"http://identifiers.org/ncbigene/","item_comparison_example":[{"route":"17869,16600,20674,18999","label":"Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)"}]},"sample":{"filter":[{"column":"SampleTypeCategory","label":"Sample type","note":"FANTOM5","is_checkbox":true,"is_displayed":true,"is_ontology":false},{"column":"ExperimentCategory","label":"Experiment","note":"FANTOM5","is_checkbox":true,"is_displayed":false,"is_ontology":false},{"column":"UberonLabel","label":"Tissue","note":"UBERON","is_checkbox":false,"examples":["skin","liver"],"is_displayed":true,"is_ontology":true},{"column":"ClLabel","label":"Cell type","note":"Cell Ontology","is_checkbox":false,"examples":["macrophage","hepatocyte"],"is_displayed":true,"is_ontology":true},{"column":"NcitLabel","label":"Disease","note":"NCI Thesaurus","is_checkbox":false,"examples":["erythroid neoplasm"],"is_displayed":true,"is_ontology":true},{"column":"DevelopmentalStage","label":"Developmental stage","note":"","is_checkbox":true,"is_displayed":false,"is_ontology":false},{"column":"Sex","label":"Sex","note":"","is_checkbox":true,"is_displayed":false,"is_ontology":false}],"item_comparison_example":[{"route":"RES00003272,RES00003273,RES00003274,RES00003271","label":"Bone development"},{"route":"RES00003193,RES00003194,RES00003195,RES00003196","label":"Neurons from various tissues"},{"route":"RES00003624,RES00003627","label":"Visual cortex - Mecp KO vs WT"}],"search_conditions":[{"label":"Sample Name","examples":["liver","lung"]}]}}]}]')},116:function(e){e.exports=JSON.parse('[{"name":"gene","description":"","filter":[{"column":"symbol","label":"Symbol","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"name","label":"Name","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"alias","label":"Alias","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"geneid","label":"Gene ID","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"annotation","label":"Annotation","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"chromosomePosition","label":"Chr","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"typeOfGene","label":"Type of Gene","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false},{"column":"gene expression patterns","label":"Gene expression patterns","note":"","is_checkbox":false,"is_displayed":true,"is_ontology":false}]},{"name":"sample","description":"Genes that are specifically expressed in a given sample by classification"}]')},118:function(e,t,n){"use strict";n.r(t);n(289);var o=n(37),component=Object(o.a)({},(function(){var e=this._self._c;return e("transition",{attrs:{name:"modal_bg"}},[e("div",{staticClass:"modal_bg"},[e("transition",{attrs:{name:"modal"}},[this._t("default")],2)],1)])}),[],!1,null,"74077afa",null);t.default=component.exports},147:function(e,t,n){"use strict";var o=n(0),r=n(216),l=n.n(r);o.default.use(l.a)},148:function(e,t,n){"use strict";var o=n(0),r=n(217),l=n.n(r);n(329);o.default.component("VueSlider",l.a)},149:function(e,t,n){"use strict";var o=n(0),r=n(218),l=n.n(r);o.default.component("VueJsonToCsv",l.a)},150:function(e,t,n){"use strict";n(160),n(26),n(80),n(76),n(234),n(50);t.a=function(e,t){e.app;t("highlightedSuggestion",(function(e,t){var n=new RegExp(t,"gi"),o=n.test(t);return t.length>2&&o?e.replaceAll(n,"<mark>$&</mark>"):e})),t("firstLetterUppercase",(function(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()})),t("variableName",(function(e){return e.replace(/[^a-zA-Z0-9]/g,"_").toLowerCase()}))}},151:function(e,t,n){"use strict";var o=n(0),r=n(16),l=n(70),f=n(219),c=n(220),m=n(221),d=n(222),_=n(92);r.a.autoAddCss=!1,r.c.add(f.a,c.a,m.a,d.a,_.c),o.default.component("FontAwesomeIcon",l.a)},201:function(e,t,n){var content=n(290);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(31).default)("79ae87b9",content,!0,{sourceMap:!1})},202:function(e,t,n){var content=n(292);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(31).default)("1951bf7e",content,!0,{sourceMap:!1})},203:function(e,t,n){var content=n(303);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(31).default)("50d0ef3d",content,!0,{sourceMap:!1})},224:function(e,t,n){"use strict";n.r(t);var o={components:{ModalView:n(118).default},data:function(){return{loading:!1}},methods:{start:function(){this.loading=!0},finish:function(){this.loading=!1}}},r=(n(291),n(37)),component=Object(r.a)(o,(function(){var e=this,t=e._self._c;return e.loading?t("modal-view",[t("div",{staticClass:"modal"},[t("font-awesome-icon",{staticClass:"spinner fa-spin",attrs:{icon:["fad","spinner-third"]}})],1)]):e._e()}),[],!1,null,"49d97d93",null);t.default=component.exports;installComponents(component,{ModalView:n(118).default})},225:function(e,t,n){"use strict";var o={data:function(){return{isAbout:!0,isHelp:!1}},mounted:function(){Typekit.load({async:!0})}},r=(n(302),n(37)),component=Object(r.a)(o,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"root"},[t("script",{staticStyle:{display:"block"},attrs:{id:"common-header-and-footer__script",type:"text/javascript",src:"https://dbcls.rois.ac.jp/DBCLS-common-header-footer/v2/script/common-header-and-footer.js","data-header-menu-type":"deployed","data-width":"auto","data-color":"mono"}}),e._v(" "),t("header",[t("div",{staticClass:"nav_wrapper"},[e._m(0),e._v(" "),t("h1",{attrs:{alt:"Reference Expression Dataset 2"},on:{click:function(t){return e.$store.commit("set_active_filter","gene")}}},[t("nuxt-link",{attrs:{to:"/"}},[t("img",{staticClass:"logotype",attrs:{src:n(301),alt:"Refex"}})])],1),e._v(" "),t("nav",[t("ul",[t("li",[t("nuxt-link",{staticClass:"category",attrs:{to:"/about"}},[e._v("About")])],1),e._v(" "),t("li",[t("nuxt-link",{staticClass:"category",attrs:{to:"/help"}},[e._v("Help")])],1)])])])]),e._v(" "),t("Nuxt")],1)}),[function(){var e=this,t=e._self._c;return t("div",{staticClass:"title"},[t("p",[t("em",[e._v("Ref")]),e._v("erence "),t("em",[e._v("Ex")]),e._v("pression Dataset 2")])])}],!1,null,null,null);t.a=component.exports},238:function(e,t,n){n(239),e.exports=n(240)},289:function(e,t,n){"use strict";n(201)},290:function(e,t,n){var o=n(30)(!1);o.push([e.i,".modal_bg[data-v-74077afa]{width:100vw;height:100vh;background-color:rgba(0,0,0,.2);position:fixed;top:0;left:0;z-index:5}.modal_bg[data-v-74077afa] .modal{position:fixed;top:50%;left:50%;max-height:70vh;overflow:auto;transform:translate(-50%,-50%);background-color:#fff;padding:55px 67px;z-index:10}.modal_bg[data-v-74077afa] .modal>p.modal_title{font-size:18px;display:flex;position:relative;align-items:center}.modal_bg[data-v-74077afa] .modal>button{color:#fff;background:#488ec4;font-size:16px;font-weight:500;padding:6px 22px;border:none;border-radius:.2rem;display:flex;align-items:center;display:inline-block;margin-left:10px}.modal_bg[data-v-74077afa] .modal>button:focus{outline:none}.modal_bg[data-v-74077afa] .modal>button:hover{cursor:pointer;background:#366c96;transition:.6s}.modal_bg[data-v-74077afa] .modal>button>svg{font-size:14px;margin-right:4px}.modal_bg[data-v-74077afa] .modal>button.update{background:#ff8a17}.modal_bg[data-v-74077afa] .modal>button.update:hover{background:#f06a06;transition:.6s}.modal_bg[data-v-74077afa] .modal>button.disabled{background:#ccc;color:#fff;cursor:not-allowed}.modal_bg[data-v-74077afa] .modal>button.disabled:hover{background:#ccc}.modal-enter[data-v-74077afa],.modal-leave-to[data-v-74077afa]{opacity:0;margin-top:-20px}.modal-enter-active[data-v-74077afa],.modal-leave-active[data-v-74077afa]{transition:opacity .4s,margin-top .4s}.modal_bg-enter[data-v-74077afa],.modal_bg-leave-to[data-v-74077afa]{opacity:0}.modal_bg-enter-active[data-v-74077afa],.modal_bg-leave-active[data-v-74077afa]{transition:opacity .4s}",""]),e.exports=o},291:function(e,t,n){"use strict";n(202)},292:function(e,t,n){var o=n(30)(!1);o.push([e.i,".modal[data-v-49d97d93]{background:none!important}.modal>.spinner[data-v-49d97d93]{--fa-secondary-opacity:0.6;--fa-primary-color:#488ec4;--fa-secondary-color:#f5f7f9;--fa-animation-duration:1.2s;font-size:100px}",""]),e.exports=o},295:function(e,t,n){var content=n(296);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(31).default)("15bdef38",content,!0,{sourceMap:!1})},296:function(e,t,n){var o=n(30)(!1);o.push([e.i,':host,:root{--fa-font-solid:normal 900 1em/1 "Font Awesome 6 Solid";--fa-font-regular:normal 400 1em/1 "Font Awesome 6 Regular";--fa-font-light:normal 300 1em/1 "Font Awesome 6 Light";--fa-font-thin:normal 100 1em/1 "Font Awesome 6 Thin";--fa-font-duotone:normal 900 1em/1 "Font Awesome 6 Duotone";--fa-font-brands:normal 400 1em/1 "Font Awesome 6 Brands"}svg:not(:host).svg-inline--fa,svg:not(:root).svg-inline--fa{overflow:visible;box-sizing:content-box}.svg-inline--fa{display:inline-block;display:var(--fa-display,inline-block);height:1em;overflow:visible;vertical-align:-.125em}.svg-inline--fa.fa-2xs{vertical-align:.1em}.svg-inline--fa.fa-xs{vertical-align:0}.svg-inline--fa.fa-sm{vertical-align:-.07143em}.svg-inline--fa.fa-lg{vertical-align:-.2em}.svg-inline--fa.fa-xl{vertical-align:-.25em}.svg-inline--fa.fa-2xl{vertical-align:-.3125em}.svg-inline--fa.fa-pull-left{margin-right:.3em;margin-right:var(--fa-pull-margin,.3em);width:auto}.svg-inline--fa.fa-pull-right{margin-left:.3em;margin-left:var(--fa-pull-margin,.3em);width:auto}.svg-inline--fa.fa-li{width:2em;width:var(--fa-li-width,2em);top:.25em}.svg-inline--fa.fa-fw{width:1.25em;width:var(--fa-fw-width,1.25em)}.fa-layers svg.svg-inline--fa{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.fa-layers-counter,.fa-layers-text{display:inline-block;position:absolute;text-align:center}.fa-layers{display:inline-block;height:1em;position:relative;text-align:center;vertical-align:-.125em;width:1em}.fa-layers svg.svg-inline--fa{transform-origin:center center}.fa-layers-text{left:50%;top:50%;transform:translate(-50%,-50%);transform-origin:center center}.fa-layers-counter{background-color:#ff253a;background-color:var(--fa-counter-background-color,#ff253a);border-radius:1em;border-radius:var(--fa-counter-border-radius,1em);box-sizing:border-box;color:#fff;color:var(--fa-inverse,#fff);line-height:1;line-height:var(--fa-counter-line-height,1);max-width:5em;max-width:var(--fa-counter-max-width,5em);min-width:1.5em;min-width:var(--fa-counter-min-width,1.5em);overflow:hidden;padding:.25em .5em;padding:var(--fa-counter-padding,.25em .5em);right:0;right:var(--fa-right,0);text-overflow:ellipsis;top:0;top:var(--fa-top,0);transform:scale(.25);transform:scale(var(--fa-counter-scale,.25));transform-origin:top right}.fa-layers-bottom-right{bottom:0;bottom:var(--fa-bottom,0);right:0;right:var(--fa-right,0);top:auto;transform:scale(.25);transform:scale(var(--fa-layers-scale,.25));transform-origin:bottom right}.fa-layers-bottom-left{bottom:0;bottom:var(--fa-bottom,0);left:0;left:var(--fa-left,0);right:auto;top:auto;transform:scale(.25);transform:scale(var(--fa-layers-scale,.25));transform-origin:bottom left}.fa-layers-top-right{top:0;top:var(--fa-top,0);right:0;right:var(--fa-right,0);transform:scale(.25);transform:scale(var(--fa-layers-scale,.25));transform-origin:top right}.fa-layers-top-left{left:0;left:var(--fa-left,0);right:auto;top:0;top:var(--fa-top,0);transform:scale(.25);transform:scale(var(--fa-layers-scale,.25));transform-origin:top left}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-2xs{font-size:.625em;line-height:.1em;vertical-align:.225em}.fa-xs{font-size:.75em;line-height:.08333em;vertical-align:.125em}.fa-sm{font-size:.875em;line-height:.07143em;vertical-align:.05357em}.fa-lg{font-size:1.25em;line-height:.05em;vertical-align:-.075em}.fa-xl{font-size:1.5em;line-height:.04167em;vertical-align:-.125em}.fa-2xl{font-size:2em;line-height:.03125em;vertical-align:-.1875em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:2.5em;margin-left:var(--fa-li-margin,2.5em);padding-left:0}.fa-ul>li{position:relative}.fa-li{left:-2em;left:calc(var(--fa-li-width, 2em)*-1);position:absolute;text-align:center;width:2em;width:var(--fa-li-width,2em);line-height:inherit}.fa-border{border-radius:.1em;border-radius:var(--fa-border-radius,.1em);border:.08em solid #eee;border:var(--fa-border-width,.08em) var(--fa-border-style,solid) var(--fa-border-color,#eee);padding:.2em .25em .15em;padding:var(--fa-border-padding,.2em .25em .15em)}.fa-pull-left{float:left;margin-right:.3em;margin-right:var(--fa-pull-margin,.3em)}.fa-pull-right{float:right;margin-left:.3em;margin-left:var(--fa-pull-margin,.3em)}.fa-beat{animation-name:fa-beat;animation-delay:0;animation-delay:var(--fa-animation-delay,0);animation-direction:normal;animation-direction:var(--fa-animation-direction,normal);animation-duration:1s;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:ease-in-out;animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-bounce{animation-name:fa-bounce;animation-delay:0;animation-delay:var(--fa-animation-delay,0);animation-direction:normal;animation-direction:var(--fa-animation-direction,normal);animation-duration:1s;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:cubic-bezier(.28,.84,.42,1);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))}.fa-fade{animation-name:fa-fade;animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:cubic-bezier(.4,0,.6,1);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))}.fa-beat-fade,.fa-fade{animation-delay:0;animation-delay:var(--fa-animation-delay,0);animation-direction:normal;animation-direction:var(--fa-animation-direction,normal);animation-duration:1s;animation-duration:var(--fa-animation-duration,1s)}.fa-beat-fade{animation-name:fa-beat-fade;animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:cubic-bezier(.4,0,.6,1);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))}.fa-flip{animation-name:fa-flip;animation-delay:0;animation-delay:var(--fa-animation-delay,0);animation-direction:normal;animation-direction:var(--fa-animation-direction,normal);animation-duration:1s;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:ease-in-out;animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-shake{animation-name:fa-shake;animation-duration:1s;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:linear;animation-timing-function:var(--fa-animation-timing,linear)}.fa-shake,.fa-spin{animation-delay:0;animation-delay:var(--fa-animation-delay,0);animation-direction:normal;animation-direction:var(--fa-animation-direction,normal)}.fa-spin{animation-name:fa-spin;animation-duration:2s;animation-duration:var(--fa-animation-duration,2s);animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:linear;animation-timing-function:var(--fa-animation-timing,linear)}.fa-spin-reverse{--fa-animation-direction:reverse}.fa-pulse,.fa-spin-pulse{animation-name:fa-spin;animation-direction:normal;animation-direction:var(--fa-animation-direction,normal);animation-duration:1s;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:infinite;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:steps(8);animation-timing-function:var(--fa-animation-timing,steps(8))}@media (prefers-reduced-motion:reduce){.fa-beat,.fa-beat-fade,.fa-bounce,.fa-fade,.fa-flip,.fa-pulse,.fa-shake,.fa-spin,.fa-spin-pulse{animation-delay:-1ms;animation-duration:1ms;animation-iteration-count:1;transition-delay:0s;transition-duration:0s}}@keyframes fa-beat{0%,90%{transform:scale(1)}45%{transform:scale(1.25);transform:scale(var(--fa-beat-scale,1.25))}}@keyframes fa-bounce{0%{transform:scale(1) translateY(0)}10%{transform:scale(1.1,.9) translateY(0);transform:scale(var(--fa-bounce-start-scale-x,1.1),var(--fa-bounce-start-scale-y,.9)) translateY(0)}30%{transform:scale(.9,1.1) translateY(-.5em);transform:scale(var(--fa-bounce-jump-scale-x,.9),var(--fa-bounce-jump-scale-y,1.1)) translateY(var(--fa-bounce-height,-.5em))}50%{transform:scale(1.05,.95) translateY(0);transform:scale(var(--fa-bounce-land-scale-x,1.05),var(--fa-bounce-land-scale-y,.95)) translateY(0)}57%{transform:scale(1) translateY(-.125em);transform:scale(1) translateY(var(--fa-bounce-rebound,-.125em))}64%{transform:scale(1) translateY(0)}to{transform:scale(1) translateY(0)}}@keyframes fa-fade{50%{opacity:.4;opacity:var(--fa-fade-opacity,.4)}}@keyframes fa-beat-fade{0%,to{opacity:.4;opacity:var(--fa-beat-fade-opacity,.4);transform:scale(1)}50%{opacity:1;transform:scale(1.125);transform:scale(var(--fa-beat-fade-scale,1.125))}}@keyframes fa-flip{50%{transform:rotateY(-180deg);transform:rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-180deg))}}@keyframes fa-shake{0%{transform:rotate(-15deg)}4%{transform:rotate(15deg)}8%,24%{transform:rotate(-18deg)}12%,28%{transform:rotate(18deg)}16%{transform:rotate(-22deg)}20%{transform:rotate(22deg)}32%{transform:rotate(-12deg)}36%{transform:rotate(12deg)}40%,to{transform:rotate(0deg)}}@keyframes fa-spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.fa-rotate-90{transform:rotate(90deg)}.fa-rotate-180{transform:rotate(180deg)}.fa-rotate-270{transform:rotate(270deg)}.fa-flip-horizontal{transform:scaleX(-1)}.fa-flip-vertical{transform:scaleY(-1)}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical{transform:scale(-1)}.fa-rotate-by{transform:rotate(none);transform:rotate(var(--fa-rotate-angle,none))}.fa-stack{display:inline-block;vertical-align:middle;height:2em;position:relative;width:2.5em}.fa-stack-1x,.fa-stack-2x{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;z-index:auto;z-index:var(--fa-stack-z-index,auto)}.svg-inline--fa.fa-stack-1x{height:1em;width:1.25em}.svg-inline--fa.fa-stack-2x{height:2em;width:2.5em}.fa-inverse{color:#fff;color:var(--fa-inverse,#fff)}.fa-sr-only,.fa-sr-only-focusable:not(:focus),.sr-only,.sr-only-focusable:not(:focus){position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.svg-inline--fa .fa-primary{fill:currentColor;fill:var(--fa-primary-color,currentColor);opacity:1;opacity:var(--fa-primary-opacity,1)}.svg-inline--fa .fa-secondary{fill:currentColor;fill:var(--fa-secondary-color,currentColor)}.svg-inline--fa .fa-secondary,.svg-inline--fa.fa-swap-opacity .fa-primary{opacity:.4;opacity:var(--fa-secondary-opacity,.4)}.svg-inline--fa.fa-swap-opacity .fa-secondary{opacity:1;opacity:var(--fa-primary-opacity,1)}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary{fill:#000}.fa-duotone.fa-inverse,.fad.fa-inverse{color:#fff;color:var(--fa-inverse,#fff)}',""]),e.exports=o},301:function(e,t,n){e.exports=n.p+"img/refex-logotype.dbce9be.svg"},302:function(e,t,n){"use strict";n(203)},303:function(e,t,n){var o=n(30)(!1);o.push([e.i,'html{font-family:Helvetica,sans-serif;font-weight:400;color:#3e4652;box-sizing:border-box}html ::-webkit-scrollbar-thumb{box-shadow:inset 0 0 8px 8px hsla(0,0%,73.7%,.8);border-radius:15px;border:5px solid transparent}html ::-webkit-scrollbar{width:15px}html .root{height:calc(100vh - 24px);overflow:auto}html ul{list-style:none}html header{border-top:8px solid #488ec4;left:0;position:sticky;width:100%;text-align:center}html header>.nav_wrapper{padding:0 20px;display:flex;justify-content:space-between}html header>.nav_wrapper>h1{margin-bottom:0;width:100%;text-align:center}html header>.nav_wrapper>h1>a>img.logotype{width:60px}html header>.nav_wrapper>.title{margin:auto 0;width:100%;text-align:left}html header>.nav_wrapper>.title>p{margin:0;font-weight:700;font-family:"Futura";font-weight:400;font-size:21px;color:#7c7c7c}html header>.nav_wrapper>.title>p>em{color:#3e4652;font-style:normal}html header>.nav_wrapper>nav{margin:auto 0;width:100%}html header>.nav_wrapper>nav>ul{display:flex;grid-gap:1rem;gap:1rem;padding:0;flex-direction:row-reverse}html header>.nav_wrapper>nav>ul>li>a{text-decoration:none;font-weight:700;font-size:18px;color:#C5C7CBs}html header>.nav_wrapper>nav>ul>li>a.nuxt-link-exact-active.nuxt-link-active{color:#488ec4}html h2{font-size:20px;font-weight:600}html h3{font-size:16px;font-weight:500}html h4{font-size:14px;font-weight:500}html .category{color:grey}',""]),e.exports=o},304:function(e,t,n){"use strict";n.r(t),n.d(t,"state",(function(){return _})),n.d(t,"getters",(function(){return v})),n.d(t,"mutations",(function(){return h}));n(32),n(54),n(55);var o=n(96),r=n(21),l=n(20),f=(n(49),n(305),n(14),n(41),n(226),n(119),n(73),n(26),n(197),n(141),n(33),n(74),n(75),n(39),n(307),n(38),n(233),n(112)),c=n(116);function m(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function d(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?m(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):m(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var _=function(){return{active_specie:f[0],active_filter:"gene",active_dataset:f[0].datasets[0],project_filters:[],project_filter_ranges:{LogMedian:[0,18]},filter_modal:null,gene_modal:null,alert_modal:{isOn:!1,msg:""},compare_modal:!1,project_results:{arr:[],limit:10,offset:0},project_results_all:{},index_pagination:{limit:10,offset:0},checked_results:[],results:c.reduce((function(e,filter){return e[filter.name]={results:[],results_num:0},e}),{}),page_type:"",filter_search_value:"",index_gene_pages_number:0,index_sample_pages_number:0,project_pages_number:0,project_items:{}}},v={project_filters:function(e){return e.project_filters},get_project_results:function(e){return e.project_results.arr||[]},get_project_results_all:function(e){return e.project_results_all},get_project_items:function(e){return e.project_items},get_project_pagination:function(e){var t=e.project_results;return{limit:t.limit,offset:t.offset}},get_checked_results:function(e){return e.checked_results},index_pagination:function(e){return e.index_pagination},active_filter_modal:function(e){return e.project_filters.find((function(t){return t.column===e.filter_modal}))||null},compare_modal:function(e){return e.compare_modal},route_to_project_page:function(e){return function(t){return Array.isArray(t)&&(t=t.join(",")),"".concat(e.active_specie.species,"/").concat(e.active_dataset.dataset,"?type=").concat(e.active_filter,"&id=").concat(t)}},route_to_other_project_page:function(e){return function(t){return Array.isArray(t)&&(t=t.join(",")),"gene"===location.search.match(/=(.*)&/)[1]?"".concat(e.active_specie.species,"/").concat(e.active_dataset.dataset,"?type=sample&id=").concat(t):"".concat(e.active_specie.species,"/").concat(e.active_dataset.dataset,"?type=gene&id=").concat(t)}},gene_modal:function(e){return e.gene_modal},dataset_by_name:function(e){return function(t){return e.active_specie.datasets.find((function(e){return e.dataset===t}))}},active_dataset:function(e){return e.active_dataset},active_filter:function(e){return c.find((function(filter){return e.active_filter===filter.name}))},alert_modal:function(e){return e.alert_modal},active_specie:function(e){return e.active_specie},search_condition_by_specie:function(e){return e.active_specie.search_conditions},filter_by_name:function(e){return function(e){return c.find((function(col){return col.name===e}))}},results_by_name:function(e){return function(t){return e.results[t]}},gene_summary_source:function(e){return function(t){var n=e.active_dataset.dataset;return"https://refex2-api.dbcls.jp/static/".concat(n,"/").concat(n,"_").concat(t,".png")}},get_page_type:function(e){return e.page_type},get_filter_search_value:function(e){return e.filter_search_value},get_index_gene_pages_number:function(e){return e.index_gene_pages_number},get_index_sample_pages_number:function(e){return e.index_sample_pages_number},get_project_pages_number:function(e){return e.project_pages_number}},h={set_project_results:function(e,t){e.project_results=d(d({},e.project_results),{},{arr:t})},set_project_results_all:function(e,t){e.project_results_all=t},set_project_items:function(e,t){e.project_items=t},set_pagination:function(e,t){var n=t.limit,o=t.offset,r=t.type;"index"===(void 0===r?"project":r)?e.index_pagination={limit:null!=n?n:e.index_pagination.limit,offset:o}:e.project_results=d(d({},e.project_results),{},{limit:n,offset:o})},set_filter_modal:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;e.filter_modal=t},set_compare_modal:function(e){e.compare_modal=!e.compare_modal},set_project_filters:function(e,t){var n=Object(o.a)(t);n.forEach((function(t,r){var f,c,m,_,v,h={},y=t.column;if(Object.keys(e.project_filter_ranges).includes(y))f=e.project_filter_ranges[y],c=Object(l.a)(f,2),m=c[0],_=c[1],v=_>20,h={filterModal:[0,_],numberValue:{min:m,max:_,marks:Array(v?_/10:_).fill(null).map((function(e,i){return v?10*i:i}))}};else if(t.options){var x=Object(o.a)(t.options.sort((function(a,b){return a-b})));h={filterModal:x,options:x}}else h={filterModal:t.options?[]:""};n[r]=d(d({},t),h)})),e.project_filters=n},update_project_filters:function(e,t){var n=t.key,r=void 0===n?"filterModal":n,filter=t.filter,l=t.filterKey,f=void 0===l?e.filter_modal:l,c=Object(o.a)(e.project_filters),m=c.findIndex((function(e){return e.column===f}));c[m][r]=filter,e.project_filters=c},set_gene_modal:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;e.gene_modal=t},set_alert_modal:function(e,t){var n=t.msg,o=void 0===n?"":n,r=t.bool,l=void 0===r||r;e.alert_modal.msg=o,e.alert_modal.isOn=l},set_specie:function(e,t){e.active_specie=f.find((function(e){return e.species===t}))},set_active_dataset:function(e,t){e.active_dataset=t},set_active_filter:function(e){var filter=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"gene";e.active_filter=filter},set_results:function(e,t){var n=t.results,o=t.results_num,l=void 0===o?0:o,f=t.filterType,c=void 0===f?e.active_filter:f;e.results=d(d({},e.results),{},Object(r.a)({},c,{results:null!=n?n:[],results_num:l}))},set_page_type:function(e,t){e.page_type=t},set_filter_search_value:function(e,t){e.filter_search_value=t},set_checked_results:function(e,t){e.checked_results=t},set_index_gene_pages_number:function(e,t){e.index_gene_pages_number=t},set_index_sample_pages_number:function(e,t){e.index_sample_pages_number=t},set_project_pages_number:function(e,t){e.project_pages_number=t}}}},[[238,38,11,39]]]);