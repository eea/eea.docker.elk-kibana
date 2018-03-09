FROM ubuntu:16.04

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install npm git curl vim

RUN npm install -g n

ENV KIBANA_VERSION 6.2.2

RUN git clone https://github.com/elastic/kibana.git /kibana-dev \
    && cd /kibana-dev \
    && git checkout v$KIBANA_VERSION

RUN n "$(cat .node-version)"

RUN sed "s#Loading Kibana##g" -i /kibana-dev/src/core_plugins/kibana/translations/en.json
RUN sed "s#title Kibana#title EEA#g" -i /kibana-dev/src/ui/ui_render/views/chrome.jade

ADD src/ui_app.jade /kibana-dev/src/ui/ui_render/views/ui_app.jade

ADD src/*.png /kibana-dev/src/ui/public/assets/favicons/
ADD src/*.ico /kibana-dev/src/ui/public/assets/favicons
ADD src/*.svg /kibana-dev/src/ui/public/assets/favicons

WORKDIR /kibana-dev
RUN n "$(cat .node-version)"
RUN npm install

RUN npm run build --skip-os-packages --force
RUN mv /kibana-dev/target/kibana-6.2.2-SNAPSHOT-linux-x86_64.tar.gz /tmp/kibana-6.2.2-SNAPSHOT-linux-x86_64.tar.gz

RUN mv /kibana-dev/build/kibana-$KIBANA_VERSION-SNAPSHOT-linux-x86_64 /opt/kibana
RUN rm -rf /kibana-dev

ENV PATH /opt/kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/opt/kibana/bin/kibana"]
