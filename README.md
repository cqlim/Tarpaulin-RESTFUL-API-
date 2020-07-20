
# Tarpaulin


Tarpaulin is a a lightweight course management tool that’s an “alternative” to Canvas.

  - Type some Markdown on the left
  - See HTML in the right
  - Magic


### Tech

Tarpaulin uses a number of open source projects to work properly:

* [MySQL] - HTML enhanced for web apps!
* [MongoDB] - Database to store images with GridFS bucket
* [Redis] - Rate limiting with Reddis.
* [GridFS] - Store images as buckets with MongoDB
* [mySQL2] - I/O to the MYSQL backend
* [Docker] - Docker container to run MongoDB, Redis, MySQL
* [Express] - Express 
* [Node.js] - fast node.js network app framework 

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation

Tarpaulin requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install 
```

```
### Docker
Tarpaulin is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.
docker-compose up 
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
localhost:8000
```

#### Documentation 

See [Requirement Document](https://docs.google.com/document/d/1YpYahhqLRekq9hQfYZpJWzfFwNRG06CS9ZNiExJKbjk/edit#)
see [Architecture Diagram](https://github.com/Flazzing/Tarpaulin-RESTFUL-API-/blob/master/architecture.png)
### Todos

 - Completed

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [MySQL]: <https://www.mysql.com/>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [MongoDB]: <https://www.mongodb.com/>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [Redis]: <https://redis.io/>
   [node.js]: <http://nodejs.org>
   [GridFS]: <https://docs.mongodb.com/manual/core/gridfs/>
   [mySQL2]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [Docker]: <https://www.docker.com/>
   [Gulp]: <http://gulpjs.com>
   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
