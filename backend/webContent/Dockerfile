FROM tomcat:9-jdk11

EXPOSE 8080

# Copy JDBC drivers to Tomcat lib directory
COPY ./WebContent/WEB-INF/lib/mssql-jdbc-13.2.1.jre11.jar /usr/local/tomcat/lib/mssql-jdbc-13.2.1.jre11.jar
COPY ./WebContent/WEB-INF/lib/mysql-connector-j-9.5.0.jar /usr/local/tomcat/lib/mysql-connector-j-9.5.0.jar

CMD ["catalina.sh", "run"]
