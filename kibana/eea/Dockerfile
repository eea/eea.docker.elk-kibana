FROM docker.elastic.co/kibana/kibana:6.8.8
MAINTAINER michimau <mauro.michielon@eea.europa.eu>

USER root
ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

USER kibana
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/opt/kibana/bin/kibana"]
