FROM centos:7

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

ENV KIBANA_VERSION 6.3.0

ADD src/ui_app.jade /tmp/ui_app.jade
ADD src/*.png src/*.ico src/*.svg /tmp/

RUN yum -y install epel-release \
 && yum -y update \
 && curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo \
 && yum -y install npm git curl nodejs zip yarn-1.6.0 \
 && npm install -g n \
 && git clone https://github.com/elastic/kibana.git /kibana-dev \
 && cd /kibana-dev \
 && git checkout v$KIBANA_VERSION \
 && sed "s#Loading Kibana##g" -i /kibana-dev/src/core_plugins/kibana/translations/en.json \
 && sed "s#title Kibana#title EEA#g" -i /kibana-dev/src/ui/ui_render/views/chrome.jade \
 && sed -i -e '/\.kibanaWelcomeLogo {/{r /tmp/ui_app.jade' -e 'd}'   /kibana-dev/src/ui/ui_render/views/ui_app.jade \
 && rm /tmp/ui_app.jade \
 && mv /tmp/*.png /tmp/*.ico /tmp/*.svg /kibana-dev/src/ui/public/assets/favicons/ \
 &&  n "$(cat .node-version)" \
  && yarn kbn bootstrap \
  && yarn build --skip-os-packages \
  && mv /kibana-dev/build/oss/kibana-$KIBANA_VERSION-SNAPSHOT-linux-x86_64 /opt/kibana \
  && sed "s#-SNAPSHOT##g" -i /opt/kibana/package.json \
  && cp /opt/kibana/config/kibana.yml /opt/kibana.yml \
  && rm -rf /kibana-dev \
  && yum remove epel-release npm nodejs zip yarn \
  && yum install -y fontconfig freetype \
  && yum clean all

ENV PATH /opt/kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

WORKDIR /opt/kibana
EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/opt/kibana/bin/kibana"]
