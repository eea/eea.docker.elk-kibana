FROM centos:7 AS build

RUN yum -y install epel-release
RUN yum -y update
RUN yum -y install npm git curl vim nodejs zip

RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn-1.6.0

RUN npm install -g n

ENV KIBANA_VERSION 6.3.0

RUN git clone https://github.com/elastic/kibana.git /kibana-dev \
    && cd /kibana-dev \
    && git checkout v$KIBANA_VERSION \
    && sed "s#Loading Kibana#Loading Inpire#g" -i /kibana-dev/src/core_plugins/kibana/translations/en.json \
    && sed "s#title Kibana#title INSPIRE#g" -i /kibana-dev/src/ui/ui_render/views/chrome.jade

ADD src/ui_app.jade /tmp/ui_app.jade

RUN sed -i -e '/\.kibanaWelcomeLogo {/{r /tmp/ui_app.jade' -e 'd}'   /kibana-dev/src/ui/ui_render/views/ui_app.jade \
 && rm /tmp/ui_app.jade

ADD src/*.png /kibana-dev/src/ui/public/assets/favicons/
ADD src/*.ico /kibana-dev/src/ui/public/assets/favicons
ADD src/*.svg /kibana-dev/src/ui/public/assets/favicons

WORKDIR /kibana-dev
RUN n "$(cat .node-version)" \
 && yarn kbn bootstrap \
 && yarn build --skip-os-packages \
 && mv /kibana-dev/build/oss/kibana-$KIBANA_VERSION-SNAPSHOT-linux-x86_64 /opt/kibana \
 && sed "s#-SNAPSHOT##g" -i /opt/kibana/package.json \
 && cp /opt/kibana/config/kibana.yml /opt/kibana.yml




FROM centos:7

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN yum update -y && yum install -y fontconfig freetype && yum clean all

COPY --from=build /opt/kibana /opt/kibana 

ENV PATH /opt/kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh


EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/opt/kibana/bin/kibana"]
