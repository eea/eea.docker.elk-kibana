FROM ubuntu:16.04

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install npm git curl vim

RUN npm install -g n

#RUN curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
#RUN bash nodesource_setup.sh
#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
#RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

#RUN apt-get -y update
#RUN apt-get -y install nodejs yarn

ENV KIBANA_VERSION 6.2.2

RUN git clone https://github.com/elastic/kibana.git \
    && cd kibana \
    && git checkout v$KIBANA_VERSION

RUN cd kibana && n "$(cat .node-version)"

RUN sed "s#Loading Kibana##g" -i /kibana/src/core_plugins/kibana/translations/en.json
RUN sed "s#title Kibana#title EEA#g" -i /kibana/src/ui/ui_render/views/chrome.jade

ADD src/ui_app.jade /kibana/src/ui/ui_render/views/ui_app.jade

ADD src/*.png /kibana/src/ui/public/assets/favicons/
ADD src/*.ico /kibana/src/ui/public/assets/favicons
ADD src/*.svg /kibana/src/ui/public/assets/favicons

RUN cd kibana \
     && npm install
#    && npm run build

#RUN npm install bower
#RUN echo '{ "allow_root": true }' > /root/.bowerrc

#ADD plugins/kibana-time-plugin /kibana/plugins/kibana-time-plugin
#RUN cd /kibana/plugins/kibana-time-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install --force-latest && npm install

#ADD plugins/computed-columns /kibana/plugins/computed-columns
#RUN cd /kibana/plugins/computed-columns && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

#ADD plugins/kbn_network /kibana/plugins/kbn_network
#RUN cd /kibana/plugins/kbn_network && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

#ADD plugins/kibana-swimlane-vis /kibana/plugins/kibana-swimlane-vis
#RUN cd /kibana/plugins/kibana-swimlane-vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

#ADD plugins/kibana-html-plugin /kibana/plugins/kibana-html-plugin
#RUN cd /kibana/plugins/kibana-html-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install && npm install

#ADD plugins/kibana-enhanced-table /kibana/plugins/kibana-enhanced-table
#RUN cd /kibana/plugins/kibana-enhanced-table && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

#ADD plugins/ob-kb-percent /kibana/plugins/ob-kb-percent
#RUN cd /kibana/plugins/ob-kb-percent && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ENV PATH /kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/kibana/bin/kibana"]
