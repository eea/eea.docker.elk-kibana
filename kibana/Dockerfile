FROM ubuntu:16.10

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install vim npm git curl 

ENV KIBANA_VERSION 5.4.0

RUN git clone https://github.com/elastic/kibana.git \
    && cd kibana \
    && git checkout v$KIBANA_VERSION

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get -y install nodejs

RUN npm install bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

#in order to have search bar in embed mode, PR: https://github.com/elastic/kibana/pull/8947 - updated for 5.3.0
ADD src/kbn_chrome.js /kibana/src/ui/public/chrome/directives/kbn_chrome.js
ADD src/dashboard.html /kibana/src/core_plugins/kibana/public/dashboard/dashboard.html
ADD src/editor.html /kibana/src/core_plugins/kibana/public/visualize/editor/editor.html
ADD src/controls.js /kibana/src/ui/public/chrome/api/controls.js
ADD src/kbn_chrome.js /kibana/src/ui/public/chrome/directives/kbn_chrome.js
ADD src/kbn_top_nav.html /kibana/src/ui/public/kbn_top_nav/kbn_top_nav.html
ADD src/kbn_top_nav_controller.js /kibana/src/ui/public/kbn_top_nav/kbn_top_nav_controller.js
ADD src/share.js /kibana/src/ui/public/share/directives/share.js
ADD src/share.html /kibana/src/ui/public/share/views/share.html
ADD src/index.less /kibana/src/core_plugins/kibana/public/dashboard/styles/index.less

ADD src/logo_hack.txt /tmp/logo_hack.txt
RUN cat /tmp/logo_hack.txt >> /kibana/src/ui/views/chrome.jade

RUN cd kibana \
    && npm install

ADD plugins/kibana_dropdown /kibana/plugins/kibana_dropdown
RUN cd /kibana/plugins/kibana_dropdown && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-plugin-gauge-sg /kibana/plugins/kibana-plugin-gauge-sg
RUN cd /kibana/plugins/kibana-plugin-gauge-sg && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-swimlane-vis /kibana/plugins/kibana-swimlane-vis
RUN cd /kibana/plugins/kibana-swimlane-vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kbn_network /kibana/plugins/kbn_network
RUN cd /kibana/plugins/kbn_network && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-plugin-metric-percent /kibana/plugins/kibana-plugin-metric-percent
RUN cd /kibana/plugins/kibana-plugin-metric-percent && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/Elastic-5.0-Traffic-Light-Visualizer /kibana/plugins/Elastic-5.0-Traffic-Light-Visualizer
RUN cd /kibana/plugins/Elastic-5.0-Traffic-Light-Visualizer && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/Elastic-5.0-Offline-Map-Visualizer /kibana/plugins/Elastic-5.0-Offline-Map-Visualizer
RUN cd /kibana/plugins/Elastic-5.0-Offline-Map-Visualizer && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/Elastic-5.0-Country-Map-Visualizer /kibana/plugins/Elastic-5.0-Country-Map-Visualizer
RUN cd /kibana/plugins/Elastic-5.0-Country-Map-Visualizer && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

#ADD plugins/kbn_c3js_vis /kibana/plugins/kbn_c3js_vis
#RUN cd /kibana/plugins/kbn_c3js_vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/ob-kb-funnel /kibana/plugins/ob-kb-funnel
RUN cd /kibana/plugins/ob-kb-funnel && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

#ADD plugins/geoJsonMapKibana /kibana/plugins/geoJsonMapKibana
#RUN cd /kibana/plugins/geoJsonMapKibana && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-time-plugin /kibana/plugins/kibana-time-plugin
RUN cd /kibana/plugins/kibana-time-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/ob-kb-percent /kibana/plugins/ob-kb-percent
RUN cd /kibana/plugins/ob-kb-percent && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibi_radar_vis /kibana/plugins/kibi_radar_vis
RUN cd /kibana/plugins/kibi_radar_vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana_ext_metrics_vis /kibana/plugins/kibana_ext_metrics_vis
RUN cd /kibana/plugins/kibana_ext_metrics_vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/cohort /kibana/plugins/cohort
RUN cd /kibana/plugins/cohort && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-relational-filter /kibana/plugins/kibana-relational-filter
RUN cd /kibana/plugins/kibana-relational-filter && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/transform_vis /kibana/plugins/transform_vis
RUN cd /kibana/plugins/transform_vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

RUN npm install -g bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD plugins/enhanced_tilemap /kibana/plugins/enhanced_tilemap
RUN cd /kibana/plugins/enhanced_tilemap && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install && npm install

#ADD plugins/kbn_sankey_vis /kibana/plugins/kbn_sankey_vis
#RUN cd /kibana/plugins/kbn_sankey_vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/computed-columns /kibana/plugins/computed-columns
RUN cd /kibana/plugins/computed-columns && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ENV PATH /kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/kibana/bin/kibana"]
