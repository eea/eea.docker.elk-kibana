cp ../eea/docker-entrypoint.sh .

 sed -i 's/European Environment Agency/Inspire Dashboard/' docker-entrypoint.sh 
 sed -i 's/EEA/Inspire/' docker-entrypoint.sh 
 sed -i 's#eea/src#inspire/src#' docker-entrypoint.sh 

