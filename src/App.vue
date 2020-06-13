<template>
  <router-view/>
</template>

<style lang="less">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body { padding:0; margin:0; height: 100%; overflow: hidden; }
html { height: 100% }

.app-root { font-family: Verdana; font-size: 1em; margin: 0; padding: 20px 100px 0 100px; height: 100%; overflow: auto; }
code { font-size: 1.2em; font-weight: bold; }

.header-cmd { color: #c5c5c5 }

.top-links { position: absolute; right: 10px; top: 10px; list-style-type: none; margin: 0 }
.top-links li { float: left; }
.top-links a { display: inline-block; padding: 10px 15px}
.top-links .icon { margin-right: 5px; }

.mono { font-family: monospace; font-size: 1.3em }
.expressionInput { width: 500px; padding: 3px; border: solid 1px lightgray; }

.result { margin: 10px 10px 30px; }
.result .input { margin-bottom: 10px; }
.result .content { padding-left: 10px}
.result .cur { margin-right: 5px; }

.hashLink { text-decoration: none; margin-left: 5px; visibility: hidden }
.hashLink:hover { text-decoration: underline; margin-left: 5px; }
.result:hover .hashLink { visibility: visible }

.expression .label { font-weight:  bold; padding-right: 5px; text-align: right; }
.expression .bin { letter-spacing: 3px; padding: 0px 20px; }
.expression .flipable { cursor: pointer; opacity: 1 }
.expression .flipable:hover { opacity: 0.8 }
.expression .byte { margin: 0 3px; }
.expression .flipable { cursor: pointer; opacity: 1 }
.expression .flipable:hover { opacity: 0.8 }
.expression-result td { border-top: dotted 1px gray; }
.expression { font-size: 1.5em; font-family: monospace }
.expression .prefix { font-weight: normal; display: none; font-size: 0.9em }
.expression .other { font-size: 0.9em; padding: 0px 20px; }
.expression .sign { text-align: right}

.hex .prefix { display: inline; }

.help { padding: 10px; }
.help ul { list-style-type: none; margin: 0; padding: 0;  }
.help p { margin-top: 0 }

.indicator { padding: 2px 5px;  font-family: monospace; font-size: 1.3em; background: transparent; border: none; cursor: pointer }
.error { color: maroon; }

.soft { opacity: 0.7 }

.changelog .item { margin-top: 2em; }

#view { padding: 10px}

.cur { color: lightgray; }

/* Light */
.light { background: #fafafa; }
.light a, .light a:visited { color: #222; }
.light .one { color: black; }
.light .zero { color: #888; }
.light .indicator { color: #ddd; }
.light .on { color: #121212; }
.light .prefix { color: #888}
.light .other { color: #bbb }
.light .hashLink, .light .hashLink:visited { color: #ddd }
.light .hashLink:hover { color: #888 }
.light ul.top-links li:hover { background: #ddd }
.light .error { color: #da586d }

/* Dark */
.dark { background: #121212; color: white;}
.dark .expression { color: white;}
.dark .expressionInput { background: #121212; color: white; }
.dark a, .dark a:visited { color: white; }
.dark .indicator { color: #555; }
.dark .on { color: white; }
.dark .zero { color: #999;}
.dark .prefix { color: #999}
.dark  .other { color: #444;}
.dark .hashLink, .dark .hashLink:visited { color: #333 }
.dark .hashLink:hover { color: #999 }
.dark ul.top-links li:hover { background: #333 }
.dark .error { color: #da586d}

.v-select.dark {
  border: solid 1px lightgray;
  color: white;
}

.dark .vs__selected {
  color: white;
}

.dark .vs__dropdown-option--highlight {
  background: white !important;
  color: black !important;
}

.dark .vs__search::placeholder,
.dark .vs__dropdown-toggle,
.dark .vs__dropdown-menu,
.dark .vs__dropdown-option {
  background: #121212;
  color: white;
  border: none;
}

.dark .vs__clear,
.dark .vs__open-indicator {
  fill: white;
}

/*
    Midnight Theme
*/
.midnight .header-cmd { color: #85a0ad }
.midnight { background: #2c3e50; color: white }
.midnight .expression { color: white;}
.midnight .expressionInput { background: #2c3e50; color: white; border-color: #85a0ad }
.midnight a, .dark a:visited { color: white; }
.midnight .indicator { color: #85a0ad; }
.midnight .on { color: white; }
.midnight .zero { color: #85a0ad;}
.midnight .prefix { color: #85a0ad}
.midnight  .other { color: #9FBAC7;}
.midnight .hashLink, .dark .hashLink:visited { color: #85a0ad }
.midnight .hashLink:hover { color: #9FBAC7 }
.midnight ul.top-links li:hover { background: #132537 }
.midnight .error { color:#da586d}
.midnight .changelog .item-new .date { font-weight: bold }

.v-select.midnight {
  border: solid 1px #85a0ad;
  color: white;
}

.midnight .vs__selected {
  color: white;
}

.midnight .vs__dropdown-option--highlight {
  background: white !important;
  color: black !important;
}

.midnight .vs__search::placeholder,
.midnight .vs__dropdown-toggle,
.midnight .vs__dropdown-menu,
.midnight .vs__dropdown-option {
  background: #2c3e50;
  color: white;
  border: none;
}

.midnight .vs__clear,
.midnight .vs__open-indicator {
  fill: white;
}

/* Top Links Shrink */
@media (max-width: 800px) {

    .top-links .link-text { display: none }
}

.social-container{ position:fixed; bottom:10px; right:10px }

/* Remove margin space on body. Inline top links with header */
@media (max-width: 700px) {
    body { padding: 10px; }
    .expressionInput { width: 500px; }
}

/* Further shrink */
@media (max-width: 500px) {
    .expressionInput { width: 350px; }
    .top-links a { display: inline-block; padding: 5px 10px}
}

@media (max-width: 350px) {
    .expressionInput { width: 200px; }
}

</style>
