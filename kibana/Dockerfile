FROM ubuntu:17.10

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install vim npm git curl 

ENV KIBANA_VERSION 6.1.0

RUN git clone https://github.com/elastic/kibana.git \
    && cd kibana \
    && git checkout v$KIBANA_VERSION

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get -y install nodejs

RUN npm install bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD src/en.json /kibana/src/core_plugins/kibana/translations/en.json
ADD src/chrome.jade /kibana/src/ui/views/chrome.jade
ADD src/ui_app.jade /kibana/src/ui/views/ui_app.jade
ADD src/*.png /kibana/src/ui/public/assets/favicons/
ADD src/favicon.ico /kibana/src/ui/public/assets/favicons
ADD src/safari-pinned-tab.svg /kibana/src/ui/public/assets/favicons

RUN cd kibana \
    && npm install

RUN npm install -g bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD plugins/kibana-time-plugin /kibana/plugins/kibana-time-plugin
RUN cd /kibana/plugins/kibana-time-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install --force-latest && npm install

ADD plugins/network_vis /kibana/plugins/network_vis
RUN cd /kibana/plugins/network_vis && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ADD plugins/kibana-html-plugin /kibana/plugins/kibana-html-plugin
RUN cd /kibana/plugins/kibana-html-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install && npm install

ADD plugins/ob-kb-percent /kibana/plugins/ob-kb-percent
RUN cd /kibana/plugins/ob-kb-percent && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && npm install

ENV PATH /kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/kibana/bin/kibana"]
