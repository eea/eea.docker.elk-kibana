FROM docker.elastic.co/kibana/kibana:7.12.0
MAINTAINER michimau <mauro.michielon@eea.europa.eu>

USER root
ADD docker-entrypoint.sh /

ADD src/*.png /usr/share/kibana/src/core/server/core_app/assets/favicons/
ADD src/*.ico /usr/share/kibana/src/core/server/core_app/assets/favicons/
ADD src/*.svg /usr/share/kibana/src/core/server/core_app/assets/favicons/

USER kibana

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/usr/local/bin/kibana-docker"]

