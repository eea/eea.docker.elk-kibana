FROM ubuntu:16.04

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install vim npm git curl 

ENV KIBANA_VERSION 6.2.2

RUN git clone https://github.com/elastic/kibana.git \
    && cd kibana \
    && git checkout v$KIBANA_VERSION

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get -y install nodejs

RUN npm install bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

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

ADD plugins/kibana-html-plugin /kibana/plugins/kibana-html-plugin
RUN cd /kibana/plugins/kibana-html-plugin && sed "s#KIBANA_VERSION#$KIBANA_VERSION#g" -i ./package.json && bower install && npm install

ENV PATH /kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/kibana/bin/kibana"]
