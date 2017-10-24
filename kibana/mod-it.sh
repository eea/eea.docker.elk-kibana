#!/bin/bash
set -e


sed "s#chrome.getVisible#chrome.getShowSearch#g" -i /kibana/src/core_plugins/kibana/public/dashboard/dashboard.html

sed "s#chrome.getVisible#chrome.getShowSearch#g" -i /kibana/src/core_plugins/kibana/public/visualize/editor/editor.html

sed "s#internals.setVisibleDefault(!$location.search().embed);#internals.setVisibleDefault(!$location.search().embed); if ($location.search().embed) { chrome.setShowSearch($location.search().showSearch);}#g" -i /kibana/src/ui/public/chrome/directives/kbn_chrome.js

sed 's#<div class="localNavRow">#<div class="localNavRow" ng-show="!kbnTopNav.isEmbedded()">#g' -i /kibana/src/ui/public/kbn_top_nav/kbn_top_nav.html

sed "s#internals.setVisibleDefault(!$location.search().embed);#internals.setVisibleDefault(!$location.search().embed); if ($location.search().embed) { chrome.setShowSearch($location.search().showSearch);}#g" -i  /kibana/src/ui/public/chrome/directives/kbn_chrome.js

sed "s#return chrome.getVisible();#  return chrome.getVisible() || chrome.getShowSearch(); } isEmbedded() { return !chrome.getVisible();#g" -i /kibana/src/ui/public/kbn_top_nav/kbn_top_nav_controller.js
