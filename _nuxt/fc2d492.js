(window.webpackJsonp=window.webpackJsonp||[]).push([[34,36],{336:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},337:function(t,e,o){var r=o(5),n=o(29),l=o(13),h=o(336),c=r("".replace),d="["+h+"]",v=RegExp("^"+d+d+"*"),m=RegExp(d+d+"*$"),f=function(t){return function(e){var o=l(n(e));return 1&t&&(o=c(o,v,"")),2&t&&(o=c(o,m,"")),o}};t.exports={start:f(1),end:f(2),trim:f(3)}},340:function(t,e,o){var r=o(2),n=o(231).values;r({target:"Object",stat:!0},{values:function(t){return n(t)}})},369:function(t,e,o){var r=o(98).PROPER,n=o(3),l=o(336);t.exports=function(t){return n((function(){return!!l[t]()||"​᠎"!=="​᠎"[t]()||r&&l[t].name!==t}))}},371:function(t,e,o){"use strict";var r=o(2),n=o(337).trim;r({target:"String",proto:!0,forced:o(369)("trim")},{trim:function(){return n(this)}})},376:function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},425:function(t,e,o){"use strict";(function(t){const o={selectionUp:[38],selectionDown:[40],select:[13],hideList:[27],showList:[40],autocomplete:[32,13]},r={input:String,select:Object};function n(t,e){return l(t,e.keyCode)}function l(t,e){if(t.length<=0)return!1;const o=t=>t.some((code=>code===e));return Array.isArray(t[0])?t.some((t=>o(t))):o(t)}function h(t,e,o){return o?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}function c(t){return function(){for(var e=[],i=0;i<arguments.length;i++)e[i]=arguments[i];try{return Promise.resolve(t.apply(this,e))}catch(t){return Promise.reject(t)}}}function d(){}function v(body,t){var e=body();return e&&e.then?e.then(t):t(e)}function m(body,t){try{var e=body()}catch(e){return t(e)}return e&&e.then?e.then(void 0,t):e}function f(body,t){try{var e=body()}catch(e){return t()}return e&&e.then?e.then(t,t):t()}var _={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"vue-simple-suggest",class:[t.styles.vueSimpleSuggest,{designed:!t.destyled,focus:t.isInFocus}],on:{keydown:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"tab",9,e.key,"Tab"))return null;t.isTabbed=!0}}},[o("div",{ref:"inputSlot",staticClass:"input-wrapper",class:t.styles.inputWrapper,attrs:{role:"combobox","aria-haspopup":"listbox","aria-owns":t.listId,"aria-expanded":t.listShown&&!t.removeList?"true":"false"}},[t._t("default",[o("input",t._b({staticClass:"default-input",class:t.styles.defaultInput,domProps:{value:t.text||""}},"input",t.$attrs,!1))])],2),t._v(" "),o("transition",{attrs:{name:"vue-simple-suggest"}},[t.listShown&&!t.removeList?o("ul",{staticClass:"suggestions",class:t.styles.suggestions,attrs:{id:t.listId,role:"listbox","aria-labelledby":t.listId}},[this.$scopedSlots["misc-item-above"]?o("li",{class:t.styles.miscItemAbove},[t._t("misc-item-above",null,{suggestions:t.suggestions,query:t.text})],2):t._e(),t._v(" "),t._l(t.suggestions,(function(e,r){return o("li",{key:t.getId(e,r),staticClass:"suggest-item",class:[t.styles.suggestItem,{selected:t.isSelected(e),hover:t.isHovered(e)}],attrs:{role:"option","aria-selected":t.isHovered(e)||t.isSelected(e)?"true":"false",id:t.getId(e,r)},on:{mouseenter:function(o){return t.hover(e,o.target)},mouseleave:function(e){return t.hover(void 0)},click:function(o){return t.suggestionClick(e,o)}}},[t._t("suggestion-item",[o("span",[t._v(t._s(t.displayProperty(e)))])],{autocomplete:function(){return t.autocompleteText(e)},suggestion:e,query:t.text})],2)})),t._v(" "),this.$scopedSlots["misc-item-below"]?o("li",{class:t.styles.miscItemBelow},[t._t("misc-item-below",null,{suggestions:t.suggestions,query:t.text})],2):t._e()],2):t._e()])],1)},staticRenderFns:[],name:"vue-simple-suggest",inheritAttrs:!1,model:{prop:"value",event:"input"},props:{styles:{type:Object,default:()=>({})},controls:{type:Object,default:()=>o},minLength:{type:Number,default:1},maxSuggestions:{type:Number,default:10},displayAttribute:{type:String,default:"title"},valueAttribute:{type:String,default:"id"},list:{type:[Function,Array],default:()=>[]},removeList:{type:Boolean,default:!1},destyled:{type:Boolean,default:!1},filterByQuery:{type:Boolean,default:!1},filter:{type:Function,default(t,e){return!e||~this.displayProperty(t).toLowerCase().indexOf(e.toLowerCase())}},debounce:{type:Number,default:0},nullableSelect:{type:Boolean,default:!1},value:{},mode:{type:String,default:"input",validator:t=>!!~Object.keys(r).indexOf(t.toLowerCase())},preventHide:{type:Boolean,default:!1}},watch:{mode:{handler(t,e){this.constructor.options.model.event=t,this.$parent&&this.$parent.$forceUpdate(),this.$nextTick((()=>{"input"===t?this.$emit("input",this.text):this.$emit("select",this.selected)}))},immediate:!0},value:{handler(t){"string"!=typeof t&&(t=this.displayProperty(t)),this.updateTextOutside(t)},immediate:!0}},data(){return{selected:null,hovered:null,suggestions:[],listShown:!1,inputElement:null,canSend:!0,timeoutInstance:null,text:this.value,isPlainSuggestion:!1,isClicking:!1,isInFocus:!1,isFalseFocus:!1,isTabbed:!1,controlScheme:{},listId:`${this._uid}-suggestions`}},computed:{listIsRequest(){return"function"==typeof this.list},inputIsComponent(){return this.$slots.default&&this.$slots.default.length>0&&!!this.$slots.default[0].componentInstance},input(){return this.inputIsComponent?this.$slots.default[0].componentInstance:this.inputElement},on(){return this.inputIsComponent?"$on":"addEventListener"},off(){return this.inputIsComponent?"$off":"removeEventListener"},hoveredIndex(){for(let i=0;i<this.suggestions.length;i++){const t=this.suggestions[i];if(this.hovered&&this.valueProperty(this.hovered)==this.valueProperty(t))return i}return-1},textLength(){return this.text&&this.text.length||this.inputElement.value.length||0},isSelectedUpToDate(){return!!this.selected&&this.displayProperty(this.selected)===this.text}},created(){this.controlScheme=Object.assign({},o,this.controls)},mounted:c((function(){const t=this;return h(t.$slots.default,(function(){t.$nextTick((()=>{t.inputElement=t.$refs.inputSlot.querySelector("input"),t.inputElement?(t.setInputAriaAttributes(),t.prepareEventHandlers(!0)):console.error("No input element found")}))}))})),beforeDestroy(){this.prepareEventHandlers(!1)},methods:{isEqual(t,e){return e&&this.valueProperty(t)==this.valueProperty(e)},isSelected(t){return this.isEqual(t,this.selected)},isHovered(t){return this.isEqual(t,this.hovered)},setInputAriaAttributes(){this.inputElement.setAttribute("aria-activedescendant",""),this.inputElement.setAttribute("aria-autocomplete","list"),this.inputElement.setAttribute("aria-controls",this.listId)},prepareEventHandlers(t){const e=this[t?"on":"off"],o={click:this.showSuggestions,keydown:this.onKeyDown,keyup:this.onListKeyUp},r=Object.assign({blur:this.onBlur,focus:this.onFocus,input:this.onInput},o);for(const t in r)this.input[e](t,r[t]);const n=t?"addEventListener":"removeEventListener";for(const t in o)this.inputElement[n](t,o[t])},isScopedSlotEmpty(slot){if(slot){const t=slot(this);return!(Array.isArray(t)||t&&(t.tag||t.context||t.text||t.children))}return!0},miscSlotsAreEmpty(){const t=["misc-item-above","misc-item-below"].map((s=>this.$scopedSlots[s]));if(t.every((s=>!!s)))return t.every(this.isScopedSlotEmpty.bind(this));const slot=t.find((s=>!!s));return this.isScopedSlotEmpty.call(this,slot)},getPropertyByAttribute(t,e){return this.isPlainSuggestion?t:void 0!==typeof t?function(t,path){return path.split(".").reduce(((t,i)=>t===Object(t)?t[i]:t),t)}(t,e):t},displayProperty(e){if(this.isPlainSuggestion)return e;let o=this.getPropertyByAttribute(e,this.displayAttribute);return void 0===o&&(o=JSON.stringify(e),t&&~"production".indexOf("dev")&&console.warn("[vue-simple-suggest]: Please, provide `display-attribute` as a key or a dotted path for a property from your object.")),String(o||"")},valueProperty(t){if(this.isPlainSuggestion)return t;const e=this.getPropertyByAttribute(t,this.valueAttribute);return void 0===e&&console.error("[vue-simple-suggest]: Please, check if you passed 'value-attribute' (default is 'id') and 'display-attribute' (default is 'title') props correctly.\n        Your list objects should always contain a unique identifier."),e},autocompleteText(t){this.setText(this.displayProperty(t))},setText(text){this.$nextTick((()=>{this.inputElement.value=text,this.text=text,this.$emit("input",text)}))},select(t){(this.selected!==t||this.nullableSelect&&!t)&&(this.selected=t,this.$emit("select",t),t&&this.autocompleteText(t)),this.hover(null)},hover(t,e){const o=t?this.getId(t,this.hoveredIndex):"";this.inputElement.setAttribute("aria-activedescendant",o),t&&t!==this.hovered&&this.$emit("hover",t,e),this.hovered=t},hideList(){this.listShown&&(this.listShown=!1,this.hover(null),this.$emit("hide-list"))},showList(){this.listShown||this.textLength>=this.minLength&&(this.suggestions.length>0||!this.miscSlotsAreEmpty())&&(this.listShown=!0,this.$emit("show-list"))},showSuggestions:c((function(){const t=this;return v((function(){if(0===t.suggestions.length&&t.minLength<=t.textLength)return t.showList(),function(t,e){if(!e)return t&&t.then?t.then(d):Promise.resolve()}(t.research())}),(function(){t.showList()}))})),onShowList(t){n(this.controlScheme.showList,t)&&this.showSuggestions()},moveSelection(t){if(this.listShown&&this.suggestions.length&&n([this.controlScheme.selectionUp,this.controlScheme.selectionDown],t)){t.preventDefault();const e=n(this.controlScheme.selectionDown,t),o=2*e-1,r=e?0:this.suggestions.length-1,l=e?this.hoveredIndex<this.suggestions.length-1:this.hoveredIndex>0;let h=null;h=this.hovered?l?this.suggestions[this.hoveredIndex+o]:this.suggestions[r]:this.selected||this.suggestions[r],this.hover(h)}},onKeyDown(t){const select=this.controlScheme.select,e=this.controlScheme.hideList;"Enter"===t.key&&this.listShown&&l([select,e],13)&&t.preventDefault(),"Tab"===t.key&&this.hovered&&this.select(this.hovered),this.onShowList(t),this.moveSelection(t),this.onAutocomplete(t)},onListKeyUp(t){const select=this.controlScheme.select,e=this.controlScheme.hideList;this.listShown&&n([select,e],t)&&(t.preventDefault(),n(select,t)&&this.select(this.hovered),this.hideList())},onAutocomplete(t){n(this.controlScheme.autocomplete,t)&&(t.ctrlKey||t.shiftKey)&&this.suggestions.length>0&&this.suggestions[0]&&this.listShown&&(t.preventDefault(),this.hover(this.suggestions[0]),this.autocompleteText(this.suggestions[0]))},suggestionClick(t,e){this.$emit("suggestion-click",t,e),this.select(t),this.preventHide||this.hideList(),this.isClicking&&setTimeout((()=>{this.inputElement.focus(),this.isClicking=!1}),0)},onBlur(t){this.isInFocus?(this.isClicking=this.hovered&&!this.isTabbed,this.isClicking?t&&t.isTrusted&&!this.isTabbed&&(this.isFalseFocus=!0):(this.isInFocus=!1,this.hideList(),this.$emit("blur",t))):(this.inputElement.blur(),console.error("This should never happen!\n          If you encountered this error, please make sure that your input component emits 'focus' events properly.\n          For more info see https://github.com/KazanExpress/vue-simple-suggest#custom-input.\n\n          If your 'vue-simple-suggest' setup does not include a custom input component - please,\n          report to https://github.com/KazanExpress/vue-simple-suggest/issues/new")),this.isTabbed=!1},onFocus(t){this.isInFocus=!0,t&&!this.isFalseFocus&&this.$emit("focus",t),this.isClicking||this.isFalseFocus||this.showSuggestions(),this.isFalseFocus=!1},onInput(t){const e=t.target?t.target.value:t;this.updateTextOutside(e),this.$emit("input",e)},updateTextOutside(t){this.text!==t&&(this.text=t,this.hovered&&this.hover(null),this.text.length<this.minLength?this.hideList():this.debounce?(clearTimeout(this.timeoutInstance),this.timeoutInstance=setTimeout(this.research,this.debounce)):this.research())},research:c((function(){const t=this;return f((function(){return m((function(){return function(body){var t=body();if(t&&t.then)return t.then(d)}((function(){if(t.canSend){t.canSend=!1;let e=t.text;return h(t.getSuggestions(t.text),(function(o){e===t.text&&t.$set(t,"suggestions",o)}))}}))}),(function(e){throw t.clearSuggestions(),e}))}),(function(){return t.canSend=!0,0===t.suggestions.length&&t.miscSlotsAreEmpty()?t.hideList():t.isInFocus&&t.showList(),t.suggestions}))})),getSuggestions:c((function(t){const e=this;if((t=t||"").length<e.minLength)return[];e.selected=null,e.listIsRequest&&e.$emit("request-start",t);let o=!1,r=[];return f((function(){return m((function(){return v((function(){if(e.listIsRequest)return h(e.list(t),(function(t){r=t||[]}));r=e.list}),(function(){Array.isArray(r)||(r=[r]),o="object"!=typeof r[0]&&void 0!==r[0]||Array.isArray(r[0]),e.filterByQuery&&(r=r.filter((o=>e.filter(o,t)))),e.listIsRequest&&e.$emit("request-done",r)}))}),(function(t){if(!e.listIsRequest)throw t;e.$emit("request-failed",t)}))}),(function(){return e.maxSuggestions&&r.splice(e.maxSuggestions),e.isPlainSuggestion=o,r}))})),clearSuggestions(){this.suggestions.splice(0)},getId(t,i){return`${this.listId}-suggestion-${this.isPlainSuggestion?i:this.valueProperty(t)||i}`}}};e.a=_}).call(this,o(163))},462:function(t,e,o){var r=o(33)(!1);r.push([t.i,".resize-observer[data-v-8859cc6c]{border:none;background-color:transparent;opacity:0}.resize-observer[data-v-8859cc6c],.resize-observer[data-v-8859cc6c] object{position:absolute;top:0;left:0;z-index:-1;width:100%;height:100%;pointer-events:none;display:block;overflow:hidden}.v-popper__popper{z-index:10000;top:0;left:0;outline:none}.v-popper__popper.v-popper__popper--hidden{visibility:hidden;opacity:0;transition:opacity .15s,visibility .15s;pointer-events:none}.v-popper__popper.v-popper__popper--shown{visibility:visible;opacity:1;transition:opacity .15s}.v-popper__popper.v-popper__popper--skip-transition,.v-popper__popper.v-popper__popper--skip-transition>.v-popper__wrapper{transition:none!important}.v-popper__backdrop{position:absolute;top:0;left:0;width:100%;height:100%;display:none}.v-popper__inner{position:relative;box-sizing:border-box;overflow-y:auto}.v-popper__inner>div{position:relative;z-index:1;max-width:inherit;max-height:inherit}.v-popper__arrow-container{position:absolute;width:10px;height:10px}.v-popper__popper--arrow-overflow .v-popper__arrow-container,.v-popper__popper--no-positioning .v-popper__arrow-container{display:none}.v-popper__arrow-inner,.v-popper__arrow-outer{border-style:solid;position:absolute;top:0;left:0;width:0;height:0}.v-popper__arrow-inner{visibility:hidden;border-width:7px}.v-popper__arrow-outer{border-width:6px}.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-inner,.v-popper__popper[data-popper-placement^=top] .v-popper__arrow-inner{left:-2px}.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-outer,.v-popper__popper[data-popper-placement^=top] .v-popper__arrow-outer{left:-1px}.v-popper__popper[data-popper-placement^=top] .v-popper__arrow-inner,.v-popper__popper[data-popper-placement^=top] .v-popper__arrow-outer{border-bottom-width:0;border-left-color:transparent!important;border-right-color:transparent!important;border-bottom-color:transparent!important}.v-popper__popper[data-popper-placement^=top] .v-popper__arrow-inner{top:-2px}.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-container{top:0}.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-inner,.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-outer{border-top-width:0;border-left-color:transparent!important;border-right-color:transparent!important;border-top-color:transparent!important}.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-inner{top:-4px}.v-popper__popper[data-popper-placement^=bottom] .v-popper__arrow-outer{top:-6px}.v-popper__popper[data-popper-placement^=left] .v-popper__arrow-inner,.v-popper__popper[data-popper-placement^=right] .v-popper__arrow-inner{top:-2px}.v-popper__popper[data-popper-placement^=left] .v-popper__arrow-outer,.v-popper__popper[data-popper-placement^=right] .v-popper__arrow-outer{top:-1px}.v-popper__popper[data-popper-placement^=right] .v-popper__arrow-inner,.v-popper__popper[data-popper-placement^=right] .v-popper__arrow-outer{border-left-width:0;border-left-color:transparent!important;border-top-color:transparent!important;border-bottom-color:transparent!important}.v-popper__popper[data-popper-placement^=right] .v-popper__arrow-inner{left:-4px}.v-popper__popper[data-popper-placement^=right] .v-popper__arrow-outer{left:-6px}.v-popper__popper[data-popper-placement^=left] .v-popper__arrow-container{right:-10px}.v-popper__popper[data-popper-placement^=left] .v-popper__arrow-inner,.v-popper__popper[data-popper-placement^=left] .v-popper__arrow-outer{border-right-width:0;border-top-color:transparent!important;border-right-color:transparent!important;border-bottom-color:transparent!important}.v-popper__popper[data-popper-placement^=left] .v-popper__arrow-inner{left:-2px}.v-popper--theme-dropdown .v-popper__inner{background:#fff;color:#000;border-radius:6px;border:1px solid #ddd;box-shadow:0 6px 30px rgba(0,0,0,.10196)}.v-popper--theme-dropdown .v-popper__arrow-inner{visibility:visible;border-color:#fff}.v-popper--theme-dropdown .v-popper__arrow-outer{border-color:#ddd}.v-popper--theme-tooltip .v-popper__inner{background:rgba(0,0,0,.8);color:#fff;border-radius:6px;padding:7px 12px 6px}.v-popper--theme-tooltip .v-popper__arrow-outer{border-color:rgba(0,0,0,.8)}",""]),t.exports=r},475:function(t,e,o){var content=o(462);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(34).default)("2636fafc",content,!0,{sourceMap:!1})}}]);