FROM ubuntu:16.10

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install vim npm git curl 

ENV KIBANA_VERSION 5.6.4

RUN git clone https://github.com/elastic/kibana.git \
    && cd kibana \
    && git checkout v$KIBANA_VERSION

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get -y install nodejs

RUN npm install bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD mod-it.sh /mod-it.sh
RUN chmod a+x /mod-it.sh
run sh /mod-it.sh

#in order to have search bar in embed mode, PR: https://github.com/elastic/kibana/pull/8947 - updated for 5.6.3
ADD src/kbn_chrome.js src/ui/public/chrome/directives/kbn_chrome.js
ADD src/dashboard.html src/core_plugins/kibana/public/dashboard/dashboard.html
ADD src/editor.html src/core_plugins/kibana/public/visualize/editor/editor.html
ADD src/controls.js src/ui/public/chrome/api/controls.js
ADD src/kbn_chrome.js src/ui/public/chrome/directives/kbn_chrome.js
ADD src/ui_framework.css ui_framework/dist/ui_framework.css 
ADD src/kbn_top_nav.html src/ui/public/kbn_top_nav/kbn_top_nav.html 
ADD src/kbn_top_nav_controller.js src/ui/public/kbn_top_nav/kbn_top_nav_controller.js	
ADD src/share.js src/ui/public/share/directives/share.js
ADD src/share.html src/ui/public/share/views/share.html
ADD src/for-theme.less src/ui/public/styles/variables/for-theme.less
ADD src/en.json src/core_plugins/kibana/translations/en.json 
#ADD src/index.less kibana/public/dashboard/styles/index.less

ADD src/logo_hack.txt /tmp/logo_hack.txt
RUN cat /tmp/logo_hack.txt >> /kibana/src/ui/views/chrome.jade

RUN cd kibana \
    && npm install

RUN npm install -g bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD plugins/kibana-time-plugin /kibana/plugins/kibana-time-plugin
RUN cd /kibana/plugins/kibana-time-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install --force-latest && npm install

ADD plugins/computed-columns /kibana/plugins/computed-columns
RUN cd /kibana/plugins/computed-columns && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kbn_network /kibana/plugins/kbn_network
RUN cd /kibana/plugins/kbn_network && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-swimlane-vis /kibana/plugins/kibana-swimlane-vis
RUN cd /kibana/plugins/kibana-swimlane-vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-plugin-metric-percent /kibana/plugins/kibana-plugin-metric-percent
RUN cd /kibana/plugins/kibana-plugin-metric-percent && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/vega_vis-0.4.0--for-Kibana-5.6.3.zip /vega_vis.zip
RUN /kibana/bin/kibana-plugin install file:/vega_vis.zip

ADD plugins/kibana_dropdown /kibana/plugins/kibana_dropdown
RUN cd /kibana/plugins/kibana_dropdown && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-relational-filter /kibana/plugins/kibana-relational-filter
RUN cd /kibana/plugins/kibana-relational-filter && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/enhanced_tilemap /kibana/plugins/enhanced_tilemap
RUN cd /kibana/plugins/enhanced_tilemap && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install && npm install

ADD plugins/kibana-html-plugin /kibana/plugins/kibana-html-plugin
RUN cd /kibana/plugins/kibana-html-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install && npm install

ADD plugins/kibana-graph-plugin /kibana/plugins/kibana-graph-plugin
RUN cd /kibana/plugins/kibana-graph-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ENV PATH /kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/kibana/bin/kibana"]
